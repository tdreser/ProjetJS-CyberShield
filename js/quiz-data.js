export const quizQuestions = [
  {
    id: 1,
    question: "Qu'est-ce qu'un phishing ?",
    options: [
      "Un virus informatique",
      "Une technique pour voler des informations en se faisant passer pour une entité fiable",
      "Un logiciel antivirus",
      "Un protocole réseau",
    ],
    answer: 1,
    difficulty: "easy",
    category: "phishing",
    explanation:
      "Le phishing consiste à tromper l'utilisateur pour qu'il divulgue ses informations personnelles.",
  },

  {
    id: 2,
    question: "Quel est le mot de passe le plus sécurisé ?",
    options: ["123456", "password", "P@ssw0rd!93kL", "azerty"],
    answer: 2,
    difficulty: "easy",
    category: "password",
    explanation:
      "Un mot de passe sécurisé contient majuscules, minuscules, chiffres et caractères spéciaux.",
  },

  {
    id: 3,
    question: "Que signifie HTTPS ?",
    options: [
      "HyperText Transfer Protocol Secure",
      "High Transfer Protocol System",
      "Hyper Terminal Transfer Protocol",
      "Host Transfer Protocol Security",
    ],
    answer: 0,
    difficulty: "easy",
    category: "network",
    explanation:
      "HTTPS est la version sécurisée du protocole HTTP utilisant le chiffrement TLS.",
  },

  {
    id: 4,
    question: "Quel outil protège contre les logiciels malveillants ?",
    options: [
      "Un antivirus",
      "Un navigateur",
      "Un éditeur de texte",
      "Un lecteur vidéo",
    ],
    answer: 0,
    difficulty: "easy",
    category: "malware",
    explanation: "Un antivirus détecte et supprime les logiciels malveillants.",
  },

  {
    id: 5,
    question: "Qu'est-ce qu'un malware ?",
    options: [
      "Un logiciel malveillant",
      "Un moteur de recherche",
      "Un protocole web",
      "Un serveur",
    ],
    answer: 0,
    difficulty: "easy",
    category: "malware",
    explanation: "Malware signifie 'malicious software'.",
  },

  {
    id: 6,
    question: "Quelle pratique protège le mieux un compte en ligne ?",
    options: [
      "Utiliser toujours le même mot de passe",
      "Activer l'authentification à deux facteurs",
      "Partager son mot de passe",
      "Utiliser un mot de passe simple",
    ],
    answer: 1,
    difficulty: "easy",
    category: "authentication",
    explanation: "La double authentification ajoute une couche de sécurité.",
  },

  {
    id: 7,
    question: "Qu'est-ce qu'un pare-feu (firewall) ?",
    options: [
      "Un logiciel qui filtre le trafic réseau",
      "Un antivirus",
      "Un câble réseau",
      "Un système de sauvegarde",
    ],
    answer: 0,
    difficulty: "easy",
    category: "network",
    explanation: "Le firewall contrôle les connexions entrantes et sortantes.",
  },

  {
    id: 8,
    question:
      "Quelle extension peut indiquer un fichier exécutable dangereux ?",
    options: [".jpg", ".exe", ".txt", ".png"],
    answer: 1,
    difficulty: "easy",
    category: "malware",
    explanation: ".exe est un fichier exécutable qui peut contenir un malware.",
  },

  // MEDIUM

  {
    id: 9,
    question: "Qu'est-ce qu'une attaque par force brute ?",
    options: [
      "Une attaque physique",
      "Tenter de deviner un mot de passe avec toutes les combinaisons possibles",
      "Un virus",
      "Un phishing",
    ],
    answer: 1,
    difficulty: "medium",
    category: "password",
    explanation:
      "Les attaques par force brute testent toutes les combinaisons possibles.",
  },

  {
    id: 10,
    question: "Qu'est-ce qu'un ransomware ?",
    options: [
      "Un antivirus",
      "Un malware qui bloque les fichiers contre une rançon",
      "Un système de sauvegarde",
      "Un navigateur",
    ],
    answer: 1,
    difficulty: "medium",
    category: "malware",
    explanation: "Le ransomware chiffre les données et demande une rançon.",
  },

  {
    id: 11,
    question: "Quel protocole est utilisé pour envoyer des emails ?",
    options: ["SMTP", "FTP", "SSH", "DNS"],
    answer: 0,
    difficulty: "medium",
    category: "network",
    explanation: "SMTP est le protocole standard pour l'envoi d'emails.",
  },

  {
    id: 12,
    question: "Qu'est-ce que le social engineering ?",
    options: [
      "Manipulation psychologique pour obtenir des informations",
      "Un protocole réseau",
      "Un logiciel",
      "Un antivirus",
    ],
    answer: 0,
    difficulty: "medium",
    category: "social",
    explanation: "Les attaques exploitent les comportements humains.",
  },

  {
    id: 13,
    question: "Quelle méthode protège les données en les rendant illisibles ?",
    options: ["Compression", "Chiffrement", "Copie", "Suppression"],
    answer: 1,
    difficulty: "medium",
    category: "cryptography",
    explanation: "Le chiffrement transforme les données pour les protéger.",
  },

  {
    id: 14,
    question: "Qu'est-ce qu'un VPN ?",
    options: [
      "Un réseau privé virtuel sécurisé",
      "Un virus",
      "Un pare-feu",
      "Un navigateur",
    ],
    answer: 0,
    difficulty: "medium",
    category: "network",
    explanation: "Un VPN chiffre la connexion entre l'utilisateur et Internet.",
  },

  {
    id: 15,
    question: "Quel type d'attaque surcharge un serveur ?",
    options: ["DDoS", "Phishing", "SQL", "Malware"],
    answer: 0,
    difficulty: "medium",
    category: "network",
    explanation:
      "Une attaque DDoS envoie un grand nombre de requêtes pour saturer un serveur.",
  },

  {
    id: 16,
    question: "Qu'est-ce qu'un keylogger ?",
    options: [
      "Un logiciel qui enregistre les frappes clavier",
      "Un antivirus",
      "Un protocole réseau",
      "Un firewall",
    ],
    answer: 0,
    difficulty: "medium",
    category: "malware",
    explanation: "Les keyloggers volent les mots de passe tapés.",
  },

  // HARD

  {
    id: 17,
    question: "Qu'est-ce qu'une injection SQL ?",
    options: [
      "Une attaque exploitant les bases de données via des requêtes malveillantes",
      "Un virus",
      "Un firewall",
      "Un protocole",
    ],
    answer: 0,
    difficulty: "hard",
    category: "web",
    explanation:
      "Elle permet de manipuler une base de données via un champ utilisateur.",
  },

  {
    id: 18,
    question: "Quel algorithme est utilisé pour le chiffrement asymétrique ?",
    options: ["RSA", "AES", "MD5", "SHA-1"],
    answer: 0,
    difficulty: "hard",
    category: "cryptography",
    explanation: "RSA utilise une clé publique et une clé privée.",
  },

  {
    id: 19,
    question: "Que signifie XSS ?",
    options: [
      "Cross Site Scripting",
      "Extended Security System",
      "External Server Script",
      "Cross Server Security",
    ],
    answer: 0,
    difficulty: "hard",
    category: "web",
    explanation: "XSS permet d'injecter du code malveillant dans une page web.",
  },

  {
    id: 20,
    question: "Quel port est utilisé par HTTPS ?",
    options: ["80", "21", "443", "25"],
    answer: 2,
    difficulty: "hard",
    category: "network",
    explanation: "HTTPS fonctionne généralement sur le port 443.",
  },

  {
    id: 21,
    question:
      "Quel type de hash est considéré comme obsolète pour la sécurité ?",
    options: ["SHA-256", "bcrypt", "MD5", "Argon2"],
    answer: 2,
    difficulty: "hard",
    category: "cryptography",
    explanation: "MD5 est vulnérable aux collisions.",
  },

  {
    id: 22,
    question: "Qu'est-ce qu'un zero-day ?",
    options: [
      "Une vulnérabilité inconnue exploitée avant correction",
      "Un virus",
      "Un firewall",
      "Un antivirus",
    ],
    answer: 0,
    difficulty: "hard",
    category: "vulnerability",
    explanation: "Les développeurs n'ont pas encore publié de correctif.",
  },

  {
    id: 23,
    question: "Quelle technique cache des données dans une image ?",
    options: ["Steganographie", "Hashing", "Compression", "Encodage"],
    answer: 0,
    difficulty: "hard",
    category: "cryptography",
    explanation: "La stéganographie dissimule des informations dans un média.",
  },

  {
    id: 24,
    question: "Quel protocole sécurise les communications web ?",
    options: ["TLS", "FTP", "POP3", "ARP"],
    answer: 0,
    difficulty: "hard",
    category: "network",
    explanation: "TLS chiffre les communications Internet.",
  },

  {
    id: 25,
    question: "Quel outil teste la sécurité d'un système ?",
    options: ["Pentest", "Firewall", "Backup", "DNS"],
    answer: 0,
    difficulty: "hard",
    category: "security",
    explanation: "Un pentest simule une attaque pour détecter les failles.",
  },
];

export default quizQuestions;