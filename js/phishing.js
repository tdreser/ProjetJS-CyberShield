const email = {
    subject: "Remise de prêt",
    from: "paypa1.com",
    body: "Bonjour, je vous informe que le prêt à été accepté ! Félicitations. Pour vous connecter à votre compte paypal, cliquez ici."
}

function persistPhishingStats(score) {
    const raw = localStorage.getItem("cybershield.phishing.stats");
    const stats = raw
        ? JSON.parse(raw)
        : { totalAnalyzed: 0, detectedPhishing: 0, updatedAt: null };

    stats.totalAnalyzed += 1;
    if (score >= 70) {
        stats.detectedPhishing += 1;
    }
    stats.updatedAt = new Date().toISOString();

    localStorage.setItem("cybershield.phishing.stats", JSON.stringify(stats));
}

function analyzeEmail(email) {
    let score = 0;
    let reasons = [];

    const phishingRules = {
        urgencyKeywords: ['urgent', 'immédiatement', 'expire dans', 'action requise', 'votre compte sera suspendu', 'vérifiez maintenant'],
        suspiciousDomains: ['paypa1.com', 'amaz0n.fr', 'noreply-security.tk'],
        redFlags: ['cliquez ici', 'connexion sécurisée', 'mot de passe expiré', 'vous avez gagné', 'félicitations'],
        legitimateSenders: ['@impots.gouv.fr', '@pole-emploi.fr']
    };

    const texteAAnalyser = (email.subject + " " + email.body).toLowerCase();
    const expediteur = email.from.toLowerCase();

    //  L'URGENCE (.some)
    if (phishingRules.urgencyKeywords.some(word => texteAAnalyser.includes(word))) {
        score += 20;
        reasons.push("Urgence détectée dans le message.");
    }

    // DOMAINE SUSPECT (.find)
    
    const badDomain = phishingRules.suspiciousDomains.find(domain => expediteur.includes(domain));
    if (badDomain) {
        score += 40;
        reasons.push(`Domaine frauduleux détecté : ${badDomain}`);
    }

   //REDFLAGS (.filter)
    const foundFlags = phishingRules.redFlags.filter(flag => texteAAnalyser.includes(flag));
    if (foundFlags.length > 0) {
        score += (foundFlags.length * 15);
        reasons.push(`Mots suspects trouvés : ${foundFlags.join(', ')}`);
    }

    // IF 4: LA LISTE BLANCHE (.every)
    // On vérifie si l'expéditeur n'est dans AUCUN domaine officiel
    const isUnknown = phishingRules.legitimateSenders.every(safe => !expediteur.includes(safe));
    if (!isUnknown) {
        score -= 50; // Bonus de confiance car il est dans la liste blanche
        reasons.push("Source officielle reconnue.");
    } else {
        score += 10; // Malus car inconnu
        reasons.push("Expéditeur inconnu.");
    }

    // On retourne le résultat
    const boundedScore = Math.max(0, Math.min(score, 100));
    persistPhishingStats(boundedScore);

    return {
        score: boundedScore,
        reasons: reasons
    };
}

function initPhishingModule() {
    const fromInput = document.getElementById("emailinput");
    const subjectInput = document.getElementById("emailSubject");
    const bodyInput = document.getElementById("emailBody");
    const analyzeButton = document.getElementById("analyzeBtn");
    const resetButton = document.getElementById("resetBtn");
    const resultsContainer = document.getElementById("resultsContainer");

    if (!fromInput || !analyzeButton || !resultsContainer) return;

    analyzeButton.addEventListener("click", () => {
        const sender = fromInput.value.trim();
        const subject = subjectInput ? subjectInput.value.trim() : "";
        const body = bodyInput ? bodyInput.value.trim() : sender;

        if (!sender) {
            resultsContainer.textContent = \"Veuillez entrer un expéditeur ou un email.\";
            resultsContainer.style.display = "block";
            resultsContainer.setAttribute("data-risk", "warning");
            return;
        }

        const result = analyzeEmail({
            from: sender,
            subject: subject,
            body: body
        });

        let resultsHTML = `<h3>Score de detection: ${result.score}%</h3><ul>`;
        result.reasons.forEach((reason) => {
            resultsHTML += `<li>${reason}</li>`;
        });
        resultsHTML += "</ul>";

        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = "block";

        let riskLevel = "safe";
        if (result.score >= 70) {
            riskLevel = "danger";
        } else if (result.score >= 40) {
            riskLevel = "warning";
        }
        resultsContainer.setAttribute("data-risk", riskLevel);
    });

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            fromInput.value = "";
            if (subjectInput) subjectInput.value = "";
            if (bodyInput) bodyInput.value = "";
            resultsContainer.style.display = "none";
            resultsContainer.innerHTML = "";
            fromInput.focus();
        });
    }
}

document.addEventListener("DOMContentLoaded", initPhishingModule);