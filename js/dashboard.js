// Dashboard de veille cybersécurité
// Utilise l'API NewsAPI.org pour récupérer les actualités en cybersécurité

const NEWSAPI_KEY = 'fake_key_demo'; // À remplacer avec votre clé NewsAPI
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

let allNews = [];
let filteredNews = [];
let categories = [];
let activeFilter = 'Tous';

function cacheNews(articles) {
  const payload = {
    updatedAt: new Date().toISOString(),
    articles: articles
  };
  localStorage.setItem('cybershield.news.cache', JSON.stringify(payload));
}

// Données locales de démonstration si l'API ne fonctionne pas
const DEMO_NEWS = [
  {
    title: "Nouvelle vulnérabilité critique découverte dans les systèmes d'exploitation",
    source: { name: "SecurityNews" },
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Les experts en sécurité ont identifié une faille critique affectant millions d'appareils",
    urlToImage: "https://via.placeholder.com/300x200?text=Vulnérabilité",
    severity: "élevé"
  },
  {
    title: "Attaque ransomware massive contre le secteur hospitalier",
    source: { name: "CyberSecure" },
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Plusieurs hôpitaux impactés par une nouvelle variante de ransomware",
    urlToImage: "https://via.placeholder.com/300x200?text=Ransomware",
    severity: "élevé"
  },
  {
    title: "Les meilleures pratiques pour sécuriser vos mots de passe",
    source: { name: "TechGuard" },
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Guide complet sur les techniques modernes de sécurisation des identifiants",
    urlToImage: "https://via.placeholder.com/300x200?text=Sécurité+MDP",
    severity: "moyen"
  },
  {
    title: "Microsoft publie des correctifs de sécurité importants",
    source: { name: "SecurityUpdates" },
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Patch Day : 50+ vulnérabilités corrigées dans Windows et Office",
    urlToImage: "https://via.placeholder.com/300x200?text=Patches",
    severity: "moyen"
  },
  {
    title: "Campagne de phishing ciblant les PME françaises",
    source: { name: "FranceCyber" },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Une nouvelle vague de mails malveillants détectée visant les entreprises",
    urlToImage: "https://via.placeholder.com/300x200?text=Phishing",
    severity: "moyen"
  },
  {
    title: "Tendances en cybersécurité pour 2026",
    source: { name: "TrendReport" },
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    description: "IA, zero-trust et cloud security : les enjeux prioritaires",
    urlToImage: "https://via.placeholder.com/300x200?text=Tendances",
    severity: "faible"
  },
  {
    title: "Fuite de données : 2 millions de profils exposés",
    source: { name: "DataBreachAlert" },
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Une base de données mal sécurisée a été découverte publiquement",
    urlToImage: "https://via.placeholder.com/300x200?text=Data+Breach",
    severity: "élevé"
  },
  {
    title: "La biométrie : solution miracle ou risque de sécurité ?",
    source: { name: "SecurityAnalysis" },
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Analyse critique des systèmes d'authentification biométrique",
    urlToImage: "https://via.placeholder.com/300x200?text=Biométrie",
    severity: "faible"
  },
  {
    title: "Botnet détecté : 500 000 appareils compromis",
    source: { name: "ThreatIntel" },
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Les autorités ont démantelé un réseau de bots malveillants",
    urlToImage: "https://via.placeholder.com/300x200?text=Botnet",
    severity: "élevé"
  },
  {
    title: "Webinaire gratuit : Protéger votre entreprise",
    source: { name: "CyberAcademy" },
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Expert en cybersécurité partage ses conseils pour les PME",
    urlToImage: "https://via.placeholder.com/300x200?text=Webinaire",
    severity: "faible"
  }
];

// Initialiser le dashboard
async function initDashboard() {
  await fetchNews();
  setupFilters();
  displayNews();
  updateAlertLevel();
}

// Récupérer les actualités depuis l'API ou données de démonstration
async function fetchNews() {
  try {
    // Essayer avec l'API NewsAPI.org
    const response = await fetch(
      `${NEWS_API_URL}?q=cybersecurity&language=fr&sortBy=publishedAt&pageSize=10`,
      {
        headers: {
          'X-API-Key': NEWSAPI_KEY
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      allNews = data.articles.map((article) => ({
        ...article,
        severity: calculateSeverity(article.description + ' ' + article.title)
      }));
    } else {
      // Si la clé est invalide, utiliser les données de démonstration
      console.log('API non disponible, utilisation des données de démonstration');
      allNews = DEMO_NEWS;
    }
  } catch (error) {
    console.log('Erreur réseau, utilisation des données de démonstration:', error);
    allNews = DEMO_NEWS;
  }

  filteredNews = [...allNews];
  cacheNews(allNews);
}

// Calculer le niveau de sévérité d'un article
function calculateSeverity(text) {
  const text_lower = text.toLowerCase();
  
  // Mots-clés pour les différents niveaux
  const severityKeywords = {
    élevé: ['critique', 'importante', 'massif', 'attaque', 'vulnérabilité', 'ransomware', 'données exposées', 'compromis', 'faille'],
    moyen: ['correction', 'mise à jour', 'phishing', 'avertissement', 'risque'],
    faible: ['conseil', 'guide', 'tendance', 'webinaire', 'analyse', 'formation']
  };

  for (const [severity, keywords] of Object.entries(severityKeywords)) {
    if (keywords.some(keyword => text_lower.includes(keyword))) {
      return severity;
    }
  }
  
  return 'faible';
}

// Configurer les filtres par catégorie (sévérité)
function setupFilters() {
  // Utiliser .filter() pour extraire les catégories uniques
  const severities = [...new Set(allNews.map(article => article.severity))];
  categories = ['Tous', ...severities.sort()];

  const filterButtons = document.getElementById('filterButtons');
  filterButtons.innerHTML = '';

  // Créer les boutons de filtre
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    if (category === 'Tous') button.classList.add('active');
    button.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterByCategory(category);
    });

    filterButtons.appendChild(button);
  });
}

// Filtrer les articles par catégorie
function filterByCategory(category) {
  activeFilter = category;
  
  // Utiliser .filter() pour appliquer le filtre
  if (category === 'Tous') {
    filteredNews = [...allNews];
  } else {
    filteredNews = allNews.filter(article => article.severity === category);
  }

  displayNews();
}

// Afficher les actualités
function displayNews() {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '';

  if (filteredNews.length === 0) {
    newsContainer.innerHTML = '<p class="no-news">Aucune actualité trouvée pour ce filtre.</p>';
    return;
  }

  // Utiliser .slice() pour limiter à 10 articles et .forEach() pour afficher
  filteredNews.slice(0, 10).forEach((article, index) => {
    const newsItem = createNewsCard(article);
    newsContainer.appendChild(newsItem);
  });
}

// Créer une carte d'actualité
function createNewsCard(article) {
  const card = document.createElement('div');
  card.className = `news-card severity-${article.severity}`;

  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString('fr-FR');

  card.innerHTML = `
    <div class="news-header">
      <span class="severity-badge">${article.severity.toUpperCase()}</span>
      <span class="date">${formattedDate}</span>
    </div>
    <h3>${article.title}</h3>
    <p class="source">Source: ${article.source.name}</p>
    <p class="description">${article.description || 'Aucun résumé disponible'}</p>
    <div class="news-footer">
      ${article.url ? `<a href="${article.url}" target="_blank" rel="noopener">Lire l'article complet →</a>` : ''}
    </div>
  `;

  return card;
}

// Calculer et mettre à jour le niveau d'alerte global
function updateAlertLevel() {
  // Utiliser .reduce() pour compter les articles par sévérité
  const severityCount = allNews.reduce((acc, article) => {
    acc[article.severity] = (acc[article.severity] || 0) + 1;
    return acc;
  }, {});

  const criticalCount = severityCount['élevé'] || 0;
  const warningCount = severityCount['moyen'] || 0;

  // Déterminer le niveau d'alerte global
  let alertLevel = 'FAIBLE';
  let alertColor = 'alert-low';
  let alertMessage = 'Situation maîtrisée';

  if (criticalCount >= 3) {
    alertLevel = 'CRITIQUE';
    alertColor = 'alert-critical';
    alertMessage = '⚠️ Plusieurs menaces critiques détectées !';
  } else if (criticalCount > 0) {
    alertLevel = 'ÉLEVÉ';
    alertColor = 'alert-high';
    alertMessage = '🔴 Menace importante détectée';
  } else if (warningCount >= 3) {
    alertLevel = 'MOYEN';
    alertColor = 'alert-medium';
    alertMessage = '🟡 Plusieurs alertes en cours';
  }

  const alertIndicator = document.getElementById('alertIndicator');
  alertIndicator.className = `alert-indicator ${alertColor}`;
  
  document.getElementById('alertLevel').textContent = alertLevel;
  document.getElementById('alertMessage').textContent = alertMessage;
  document.getElementById('alertCount').textContent = 
    `Articles critiques: ${criticalCount} | Moyens: ${warningCount}`;
}

// Démarrer le dashboard
document.addEventListener('DOMContentLoaded', initDashboard);
