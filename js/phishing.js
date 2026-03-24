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
    return {
        score: Math.max(0, Math.min(score, 100)),
        reasons: reasons
    };
}