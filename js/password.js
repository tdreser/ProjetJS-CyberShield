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
        if (char !== ' ' && !(char >= 'a' && char <= 'z')) {
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