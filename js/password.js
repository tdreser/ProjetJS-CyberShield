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

    for (const char of password) {

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

    const boundedScore = Math.max(0, Math.min(score, 100));

    return {
        score: boundedScore,
        length: password.length,
        hasUppercase: resultmaj > 0,
        hasDigit: resultchiffre > 0,
        hasSymbol: resultsymbole > 0,
        blacklistSafe: !listenoire.includes(password.toLowerCase()),
        level: getPasswordLevel(boundedScore)
    };
}

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

function getPasswordLevel(score) {
    if (score < 30) return "Faible";
    if (score < 60) return "Moyen";
    if (score < 85) return "Bon";
    return "Excellent";
}

function persistPasswordSummary(score, passwordLength) {
    const summary = {
        score: Math.max(0, Math.min(score, 100)),
        level: getPasswordLevel(score),
        length: passwordLength,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem("cybershield.password.last", JSON.stringify(summary));
}

const passwordInput = document.getElementById("passwordInput");
const togglePasswordButton = document.getElementById("togglePassword");

if (passwordInput) {
    passwordInput.addEventListener("input", (event) => {
        const password = event.target.value;
        const analysis = analyzePassword(password);
        updateScoreBar(analysis.score);
        persistPasswordSummary(analysis.score, analysis.length);
    });
}

if (passwordInput && togglePasswordButton) {
    togglePasswordButton.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        togglePasswordButton.textContent = isHidden ? "👁" : "👁";
        togglePasswordButton.setAttribute(
            "aria-label",
            isHidden ? "Masquer le mot de passe" : "Afficher le mot de passe"
        );
    });
}