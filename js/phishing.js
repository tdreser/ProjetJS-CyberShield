function analyzeEmail(emailObject) {
    const phishingRules = {
        urgencyKeywords: [
            'urgent', 'immédiatement', 'expire dans', 'action requise', 'votre compte sera suspendu', 'vérifiez maintenant'
        ],
        suspiciousDomains: [
            'paypa1.com', 'amaz0n.fr', 'noreply-security.tk'
        ],
        redFlags: [
            'cliquez ici', 'connexion sécurisée', 'mot de passe expiré', 'vous avez gagné', 'félicitations',
        ],
        legitimateSenders: [
            '@impots.gouv.fr', '@pole-emploi.fr'
        ]
    };
    
    const emailSubject = emailObject.subject ?? "Sujet manquant";
    const emailSender = emailObject.from ?? "Sender manquant";
    const emailMessage = emailObject.message ?? "Message manquant";

    let result = {
        score: 0
    };

    phishingRules.suspiciousDomains.some(substring => emailSender.includes(substring)) && (result.score += 10);
    
    const count = phishingRules.redFlags.reduce((acc, keyword) => {
        const matches = emailMessage.match(new RegExp(keyword, 'gi'));
        return acc + (matches ? matches.length : 0);
    }, 0);

    result.score += count * 5;

    return result;

}

const email = {
    subject: "Remise de prêt",
    from: "paypa1.com",
    to: "example@example.com",
    message: "Bonjour, je vous informe que le prêt à été accepté ! Félicitations. Pour vous connecter à votre compte paypal, cliquez ici."
}

console.log(analyzeEmail(email))