const STORAGE_KEYS = {
	quizScores: "quizScores",
	passwordLast: "cybershield.password.last",
	phishingStats: "cybershield.phishing.stats",
	newsCache: "cybershield.news.cache"
};

function readJSON(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch (error) {
		return fallback;
	}
}

function setText(id, value) {
	const element = document.getElementById(id);
	if (element) element.textContent = value;
}

function formatDate(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "--";
	return date.toLocaleDateString("fr-FR");
}

function initTabs() {
	const buttons = Array.from(document.querySelectorAll(".app-tab-button"));
	const panels = Array.from(document.querySelectorAll(".app-tab-panel"));
	if (buttons.length === 0 || panels.length === 0) return;

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const tab = button.getAttribute("data-tab");
			buttons.forEach((btn) => btn.classList.remove("active"));
			button.classList.add("active");
			panels.forEach((panel) => {
				panel.classList.toggle("active", panel.id === `tab-${tab}`);
			});
			if (tab === "home") {
				renderHomeKPIs();
			}
		});
	});
}

function renderMiniNews(articles) {
	const container = document.getElementById("miniNewsList");
	if (!container) return;

	container.innerHTML = "";
	const safeArticles = articles.length > 0 ? articles : [{
		title: "Aucune actualite en cache",
		source: { name: "CyberShield" },
		publishedAt: new Date().toISOString()
	}];

	safeArticles.slice(0, 4).forEach((article) => {
		const item = document.createElement("article");
		item.className = "mini-news-item";
		item.innerHTML = `
			<p class="mini-news-title">${article.title || "Actualite"}</p>
			<p class="mini-news-meta">${article.source?.name || "Source"} - ${formatDate(article.publishedAt)}</p>
		`;
		container.appendChild(item);
	});
}

function renderHomeKPIs() {
	const scores = readJSON(STORAGE_KEYS.quizScores, []);
	if (scores.length > 0) {
		const average = Math.round(scores.reduce((sum, item) => sum + Number(item.score || 0), 0) / scores.length);
		const best = Math.max(...scores.map((item) => Number(item.score || 0)));
		setText("kpiQuizAverage", `${average} pts`);
		setText("kpiQuizTop", `Meilleur score: ${best} pts`);
	} else {
		setText("kpiQuizAverage", "--");
		setText("kpiQuizTop", "Top 5 non disponible");
	}

	const password = readJSON(STORAGE_KEYS.passwordLast, null);
	if (password && typeof password.score === "number") {
		setText("kpiPasswordScore", `${password.score}/100`);
		setText("kpiPasswordLevel", `${password.level} - ${formatDate(password.updatedAt)}`);
	} else {
		setText("kpiPasswordScore", "--");
		setText("kpiPasswordLevel", "Aucune analyse enregistree");
	}

	const phishing = readJSON(STORAGE_KEYS.phishingStats, { totalAnalyzed: 0, detectedPhishing: 0 });
	const total = Number(phishing.totalAnalyzed || 0);
	const flagged = Number(phishing.detectedPhishing || 0);
	const rate = total === 0 ? 0 : Math.round((flagged / total) * 100);
	setText("kpiPhishingCount", String(total));
	setText("kpiPhishingRate", `Taux de phishing: ${rate}%`);

	const cache = readJSON(STORAGE_KEYS.newsCache, { articles: [] });
	renderMiniNews(Array.isArray(cache.articles) ? cache.articles : []);
}

function buildReport() {
	const report = {
		generatedAt: new Date().toISOString(),
		quiz: readJSON(STORAGE_KEYS.quizScores, []),
		password: readJSON(STORAGE_KEYS.passwordLast, null),
		phishing: readJSON(STORAGE_KEYS.phishingStats, { totalAnalyzed: 0, detectedPhishing: 0 }),
		watch: readJSON(STORAGE_KEYS.newsCache, { updatedAt: null, articles: [] })
	};

	const quizScores = report.quiz;
	const totalQuiz = quizScores.length;
	const avgQuiz = totalQuiz === 0
		? 0
		: Math.round(quizScores.reduce((sum, item) => sum + Number(item.score || 0), 0) / totalQuiz);

	report.summary = {
		quizAverage: avgQuiz,
		quizAttempts: totalQuiz,
		passwordLevel: report.password ? report.password.level : "Inconnu",
		phishingRate: report.phishing.totalAnalyzed === 0
			? 0
			: Math.round((report.phishing.detectedPhishing / report.phishing.totalAnalyzed) * 100),
		watchArticlesCached: Array.isArray(report.watch.articles) ? report.watch.articles.length : 0
	};

	return report;
}

function initReportActions() {
	const generateButton = document.getElementById("generateReportBtn");
	const downloadButton = document.getElementById("downloadReportBtn");
	const printButton = document.getElementById("printReportBtn");
	const preview = document.getElementById("reportPreview");
	const modal = document.getElementById("reportModal");
	const modalContent = document.getElementById("reportModalContent");
	const closeModalButton = document.getElementById("closeReportModal");

	if (!generateButton || !downloadButton || !printButton || !preview) return;

	const renderPreview = () => {
		const report = buildReport();
		const serialized = JSON.stringify(report, null, 2);
		preview.textContent = serialized;
		if (modalContent) {
			modalContent.textContent = serialized;
		}
		return report;
	};

	generateButton.addEventListener("click", () => {
		renderPreview();
		if (modal) {
			modal.classList.add("open");
			modal.setAttribute("aria-hidden", "false");
		}
	});

	downloadButton.addEventListener("click", () => {
		const report = renderPreview();
		const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `cybershield-report-${new Date().toISOString().slice(0, 10)}.json`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	});

	printButton.addEventListener("click", () => {
		const report = renderPreview();
		const content = `<pre>${JSON.stringify(report, null, 2)}</pre>`;
		const win = window.open("", "_blank", "width=900,height=700");
		if (!win) return;
		win.document.write(`
			<html><head><title>Rapport CyberShield</title>
			<style>body{font-family:monospace;padding:24px;background:#f6fbff;color:#0b2538}pre{white-space:pre-wrap}</style>
			</head><body><h1>Rapport CyberShield</h1>${content}</body></html>
		`);
		win.document.close();
		win.print();
	});

	if (closeModalButton && modal) {
		closeModalButton.addEventListener("click", () => {
			modal.classList.remove("open");
			modal.setAttribute("aria-hidden", "true");
		});
	}

	if (modal) {
		modal.addEventListener("click", (event) => {
			if (event.target === modal) {
				modal.classList.remove("open");
				modal.setAttribute("aria-hidden", "true");
			}
		});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	initTabs();
	renderHomeKPIs();
	initReportActions();
});
