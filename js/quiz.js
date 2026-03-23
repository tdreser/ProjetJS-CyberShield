function start(difficulty, duel = false) {

    switch (difficulty) {
        case "easy":
            break;

        case "medium":
            break;
        
        case "hard":
            break;
        
        default:
            break;
    }
    
    const randomQuestions = quizQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0,10);

    quizQuestions.filter(q => q.difficulty === difficulty);

    quizQuestions.find(q => q.id === 5);

}