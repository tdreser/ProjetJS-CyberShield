// Liste noire des 20 mots de passe les plus courants
const listenoire = [
    "123456",
    "password",
    "123456789",
    "qwerty",
    "12345",
    "12345678",
    "football",
    "admin",
    "proword",
    "login",
    "azerty",
    "1234567",
    "password123",
    "000000",
    "111111",
    "monaco",
    "shadow",
    "hunter2",
    "unknown",
    "security"
];



function analyzePassword(password) {
    
    let score = 0;
    let resultmaj = 0;
    let resultchiffre = 0;
    let resultsymbole = 0;

    for (let i = 0; i < password.length; i++) {
        // On récupère le caractère à la position i (ex: 'A', puis 'b', puis '1'...)
        let char = password[i]; 

        // On teste UNIQUEMENT ce caractère
        if (char >= 'A' && char <= 'Z') {
            resultmaj += 1;
        }
        if (char >= '0' && char <= '9') {
            resultchiffre += 1;
        }
        if (
            char !== ' ' &&
            !(char >= 'a' && char <= 'z') &&
            !(char >= 'A' && char <= 'Z') &&
            !(char >= '0' && char <= '9')
        ) {
            resultsymbole += 1;
        }
    }

    // --- CALCUL DU SCORE ---

    if (password.length > 8) {
        score += (password.length - 8) * 2;
    }

    if (resultmaj > 0){
        score += 15;
    }
    if (resultchiffre > 0) {
        score += 15;
    }
    if (resultsymbole > 0) {
        score += 20;
    }

    if (!listenoire.includes(password.toLowerCase()) && password.length > 0) {
        score += 20;
    }

    return score;
}


// JS
function updateScoreBar(score) {
  const fill = document.getElementById("scoreFill");
  const value = document.getElementById("scoreValue");

    if (!fill || !value) return;

  const safeScore = Math.max(0, Math.min(score, 100));
  fill.style.width = safeScore + "%";
  value.textContent = safeScore;

  if (safeScore < 30) fill.style.backgroundColor = "#d44";      // faible
  else if (safeScore < 60) fill.style.backgroundColor = "#e69a00"; // moyen
  else if (safeScore < 85) fill.style.backgroundColor = "#74b816"; // bon
  else fill.style.backgroundColor = "#2b8a3e";                    // excellent
}

const passwordInput = document.getElementById("passwordInput");

if (passwordInput) {
    passwordInput.addEventListener("input", (event) => {
        const password = event.target.value;
        const score = analyzePassword(password);
        updateScoreBar(score);
    });
}