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
const togglePasswordButton = document.getElementById("togglePassword");

if (passwordInput) {
    passwordInput.addEventListener("input", (event) => {
        const password = event.target.value;
        const score = analyzePassword(password);
        updateScoreBar(score);
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

// --- CHIFFREMENT CESAR ---

function normalizeShift(shift) {
    const parsed = Number(shift);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 25) {
        throw new Error("Le decalage doit etre un entier entre 1 et 25.");
    }
    return parsed;
}

function shiftLetter(char, shift) {
    const code = char.charCodeAt(0);

    // A-Z
    if (code >= 65 && code <= 90) {
        const rotated = ((code - 65 + shift + 26) % 26) + 65;
        return String.fromCharCode(rotated);
    }

    // a-z
    if (code >= 97 && code <= 122) {
        const rotated = ((code - 97 + shift + 26) % 26) + 97;
        return String.fromCharCode(rotated);
    }

    // Tout le reste reste inchange (espaces, ponctuation, chiffres...)
    return char;
}

function caesarEncrypt(message, shift) {
    const safeShift = normalizeShift(shift);
    let output = "";

    for (let i = 0; i < message.length; i++) {
        output += shiftLetter(message[i], safeShift);
    }

    return output;
}

function caesarDecrypt(message, shift) {
    const safeShift = normalizeShift(shift);
    let output = "";

    for (let i = 0; i < message.length; i++) {
        output += shiftLetter(message[i], -safeShift);
    }

    return output;
}

function caesarBruteForce(cipherText) {
    const attempts = [];

    for (let shift = 1; shift <= 25; shift++) {
        attempts.push({
            shift: shift,
            text: caesarDecrypt(cipherText, shift)
        });
    }

    return attempts;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderBruteForceTable(cipherText, tableBodyElement) {
    if (!tableBodyElement) return;

    const attempts = caesarBruteForce(cipherText);
    const rows = attempts
        .map((attempt) => {
            return "<tr>" +
                "<td>" + attempt.shift + "</td>" +
                "<td>" + escapeHtml(attempt.text) + "</td>" +
                "</tr>";
        })
        .join("");

    tableBodyElement.innerHTML = rows;
}

function initCaesarModule() {
    const messageInput = document.getElementById("caesarMessage");
    const shiftInput = document.getElementById("caesarShift");
    const encryptButton = document.getElementById("caesarEncryptBtn");
    const decryptButton = document.getElementById("caesarDecryptBtn");
    const bruteForceButton = document.getElementById("caesarBruteForceBtn");
    const resultOutput = document.getElementById("caesarResult");
    const bruteForceBody = document.getElementById("caesarBruteForceBody");

    if (!messageInput || !shiftInput) return;

    if (encryptButton && resultOutput) {
        encryptButton.addEventListener("click", () => {
            try {
                resultOutput.textContent = caesarEncrypt(messageInput.value, shiftInput.value);
            } catch (error) {
                resultOutput.textContent = error.message;
            }
        });
    }

    if (decryptButton && resultOutput) {
        decryptButton.addEventListener("click", () => {
            try {
                resultOutput.textContent = caesarDecrypt(messageInput.value, shiftInput.value);
            } catch (error) {
                resultOutput.textContent = error.message;
            }
        });
    }

    if (bruteForceButton && bruteForceBody) {
        bruteForceButton.addEventListener("click", () => {
            renderBruteForceTable(messageInput.value, bruteForceBody);
        });
    }
}

// Expose les fonctions pour l'utilisation depuis le HTML ou la console.
window.caesarEncrypt = caesarEncrypt;
window.caesarDecrypt = caesarDecrypt;
window.caesarBruteForce = caesarBruteForce;
window.renderBruteForceTable = renderBruteForceTable;
window.initCaesarModule = initCaesarModule;

initCaesarModule();