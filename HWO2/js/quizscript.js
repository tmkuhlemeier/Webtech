/*script voor de quiz*/

var questionObjects = [];

class question {

    //all arguments should be strings
    constructor(title, problemStatement, correctAnswer) {
        this.title = title;
        this.problemStatement = problemStatement;
        this.correctAnswer = correctAnswer;
        this.answered = false;
    }

    //loads the correct answer and feedback
    loadAnswer(givenAnswer) {

        if (givenAnswer && (questionObjects.indexOf(currentQuestion) < (questionObjects.length - 1))) {
            let p = document.createElement('p');
            let strong = document.createElement('strong');

            p.setAttribute("class", "question__feedback");
            strong.appendChild(document.createTextNode("correct"));
            p.appendChild(strong);
            document.getElementsByClassName('question')[0].appendChild(p);

            let nextButton = makeButton("Next question", "question__next-button");
            nextButton.addEventListener("click", currentQuestion.nextPage);
            document.getElementsByClassName('question')[0].appendChild(nextButton);

        }

        else if (!givenAnswer && (questionObjects.indexOf(currentQuestion) < (questionObjects.length - 1))) {
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            let strong = document.createElement('strong');

            p1.setAttribute("class", "question__feedback");
            p2.setAttribute("class", "question__correct-answer");

            strong.appendChild(document.createTextNode("wrong"));
            p2.appendChild(document.createTextNode("the correct answer is: " + currentQuestion.correctAnswer));
            p1.appendChild(strong);
            document.getElementsByClassName('question')[0].appendChild(p1);
            document.getElementsByClassName('question')[0].appendChild(p2);

            let nextButton = makeButton("Next question", "question__next-button");
            nextButton.addEventListener("click", currentQuestion.nextPage);
            document.getElementsByClassName('question')[0].appendChild(nextButton);
        }

        else if (givenAnswer && !(questionObjects.indexOf(currentQuestion) < (questionObjects.length - 1))) {
            let p = document.createElement('p');
            let strong = document.createElement('strong');

            p.setAttribute("class", "question__feedback");
            strong.appendChild(document.createTextNode("correct"));
            p.appendChild(strong);
            document.getElementsByClassName('question')[0].appendChild(p);

            let nextButton = makeButton("Finish", "question__next-button");
            nextButton.addEventListener("click", currentQuestion.nextPage);
            document.getElementsByClassName('question')[0].appendChild(nextButton);
        }

        else if (!givenAnswer && !(questionObjects.indexOf(currentQuestion) < (questionObjects.length - 1))) {
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            let strong = document.createElement('strong');

            p1.setAttribute("class", "question__feedback");
            p2.setAttribute("class", "question__correct-answer");

            strong.appendChild(document.createTextNode("wrong"));
            p1.appendChild(strong);
            p2.appendChild(document.createTextNode("the correct answer is: " + currentQuestion.correctAnswer));

            document.getElementsByClassName('question')[0].appendChild(p1);
            document.getElementsByClassName('question')[0].appendChild(p2);

            let nextButton = makeButton("Finish", "question__next-button");
            nextButton.addEventListener("click", currentQuestion.nextPage);
            document.getElementsByClassName('question')[0].appendChild(nextButton);

        }
    }

    //loads the next question
    nextPage() {
        if (questionObjects.indexOf(currentQuestion) < (questionObjects.length - 1)) {
            currentQuestion = questionObjects[questionObjects.indexOf(currentQuestion) + 1];
            let main = document.getElementsByTagName('main')[0];
            while (main.firstChild) {
                main.removeChild(main.firstChild);
            }
            currentQuestion.loadQuestion();
        }

        else {
            let main = document.getElementsByTagName('main')[0];

            while (main.firstChild) {
                main.removeChild(main.firstChild);
            }

            let p1 = document.createElement('p');
            let strong = document.createElement('strong');

            strong.appendChild(document.createTextNode("End of quiz!"));
            p1.setAttribute("class", "quiz-end");
            p1.appendChild(strong);

            main.appendChild(p1);

        }
    }     

    //loads the current question
    loadQuestion() {
        var main = document.getElementsByTagName('main')[0];
        var article = document.createElement('article');
        article.setAttribute("class", "question");

        var questionTitle = document.createElement('h2');
        questionTitle.setAttribute("class", "question__title");
        questionTitle.appendChild(document.createTextNode(currentQuestion.title));
        
        article.appendChild(questionTitle);

        var questionStatement = document.createElement('p');
        questionStatement.setAttribute("class", "question__question-statement");
        questionStatement.appendChild(document.createTextNode(currentQuestion.problemStatement));
        questionStatement.addEventListener("click", clickOnQuestionEventHandler, false);
        article.appendChild(questionStatement);

        main.appendChild(article);

        
    }
}

class multipleChoiceQuestion extends question {

    //possibleAnswers should be an array of strings
    constructor(title, problemStatement, correctAnswer, possibleAnswers) {
        super(title, problemStatement, correctAnswer);
        this.possibleAnswers = possibleAnswers;
    }

    loadQuestion() {
        super.loadQuestion();

        var main = document.getElementsByTagName('main')[0];

        var possibleAnswer1 = makeButton(currentQuestion.possibleAnswers[0], "question__multiple-choice-button");
        var possibleAnswer2 = makeButton(currentQuestion.possibleAnswers[1], "question__multiple-choice-button");
        var possibleAnswer3 = makeButton(currentQuestion.possibleAnswers[2], "question__multiple-choice-button");
        var possibleAnswer4 = makeButton(currentQuestion.possibleAnswers[3], "question__multiple-choice-button");

        var question = document.getElementsByClassName('question')[0];

        question.appendChild(possibleAnswer1);
        question.appendChild(possibleAnswer2);
        question.appendChild(possibleAnswer3);
        question.appendChild(possibleAnswer4);

        possibleAnswer1.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer2.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer3.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer4.addEventListener("click", currentQuestion.answerEventhandler);

        
    }

    //handlers the event when an answer by the user is submitted
    answerEventhandler(e) {

        e.stopPropagation();

        if (e.target.firstChild.nodeValue == currentQuestion.correctAnswer && !currentQuestion.answered) {
            e.target.setAttribute("class", "question__multiple-choice-button--selected");
            currentQuestion.answered = true;
            currentQuestion.loadAnswer(true);
        }

        else if(!currentQuestion.answered) {
            e.target.setAttribute("class", "question__multiple-choice-button--selected");
            currentQuestion.answered = true;
            currentQuestion.loadAnswer(false);
        }
    }

    loadAnswer(givenAnswer) {
        super.loadAnswer(givenAnswer);
    }

    nextPage() {
        super.nextPage();
    }     
}

class fillInTheBlankQuestion extends question {

    constructor(title, problemStatement, correctAnswer) {
        super(title, problemStatement, correctAnswer);
    }

    loadAnswer(givenAnswer) {
        super.loadAnswer(givenAnswer);
    }

    nextPage() {
        super.nextPage();
    }     

    loadQuestion() {
        super.loadQuestion();

        var main = document.getElementsByTagName('main')[0];
        



        var textBox = document.createElement('input');
        textBox.setAttribute("type", "text");
        textBox.setAttribute("name", "textbox");
        textBox.setAttribute("class", "question__textbox");
        
        
        
        var question = document.getElementsByClassName('question')[0];
        


        var confirmButton = makeButton("Confirm", "question__confirm-button");
        confirmButton.addEventListener("click", currentQuestion.answerEventhandler);

        
        question.appendChild(textBox);
        question.appendChild(confirmButton);

        
        
    }

    answerEventhandler(e) {
        var givenAnswer = document.getElementsByName('textbox')[0].value;
        e.stopPropagation();

        if (givenAnswer == currentQuestion.correctAnswer && !currentQuestion.answered) {
            currentQuestion.answered = true;
            currentQuestion.loadAnswer(true);
        }

        else if (!currentQuestion.answered && givenAnswer) {
            currentQuestion.answered = true;
            currentQuestion.loadAnswer(false);
        }
    }
}

//makes a button with given buttontext and class
function makeButton(text, klasse) {
    var button = document.createElement("button");
    var buttonText = document.createTextNode(text);
    button.setAttribute("class", klasse);
    button.appendChild(buttonText);
    return button;
}

//generates all the standard page elements that every page has e.g. the page headings and the navigation menu
function makeStandardPageElements() {
    var header, nav, h1, h2, navList, a1, a2, a3, a4, a5, a6, li1, li2, li3, li4, li5, li6;
    header = document.getElementsByTagName("header")[0];
    nav = document.getElementsByTagName("nav")[0];
    h1 = document.createElement("h1");
    h2 = document.createElement("h2");
    navList = document.createElement("ul");

    h1.appendChild(document.createTextNode("Introduction To Webcaches"));
    h2.appendChild(document.createTextNode("The website to find information about webcaches"));
    header.appendChild(h1);
    header.appendChild(h2);

    a1 = makeLink("index.html", "_self", "Introduction to Webcaches");
    a2 = makeLink("browser-and-proxy-caches.html", "_self", "Browser Cache and Proxy Cache");
    a3 = makeLink("forward-and-reverse-caching.html", "_self", "Forward and Reverse Caching");
    a4 = makeLink("cache-control.html", "_self", "Cache Control");
    a5 = makeLink("cache-clusters.html", "_self", "Cache Clusters");
    a6 = makeLink("assesment.html", "_self", "Quiz");
    a6.setAttribute("class", "nav__link--active");

    li1 = document.createElement("li");
    li2 = document.createElement("li");
    li3 = document.createElement("li");
    li4 = document.createElement("li");
    li5 = document.createElement("li");
    li6 = document.createElement("li");

    li1.appendChild(a1);
    li2.appendChild(a2);
    li3.appendChild(a3);
    li4.appendChild(a4);
    li5.appendChild(a5);
    li6.appendChild(a6);

    navList.appendChild(li1);
    navList.appendChild(li2);
    navList.appendChild(li3);
    navList.appendChild(li4);
    navList.appendChild(li5);
    navList.appendChild(li6);

    navList.setAttribute("class", "nav__list");
    nav.appendChild(navList);

    var main = document.getElementsByTagName('main')[0];
    main.setAttribute("id", "main-quiz");
    main.addEventListener("click", clickOnMainEventHandler, false);
}

//returns a link with a given url, target and anchor
function makeLink(url, target, text) {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", target);
    a.appendChild(document.createTextNode(text));
    return a;
}

//changes the question title when clicked on main, only active through bubbling
function clickOnMainEventHandler(e) {
    var questionTitle = document.getElementsByClassName('question__title')[0];

    if (questionTitle.firstChild.nodeValue == "Fill in the blank") {
        questionTitle.firstChild.nodeValue = "Use the textbox";
    }

    else if (questionTitle.firstChild.nodeValue == "Use the textbox") {
        questionTitle.firstChild.nodeValue = "Fill in the blank";
    }

    else if (questionTitle.firstChild.nodeValue == "Select the correct option") {
        questionTitle.firstChild.nodeValue = "Select one of the four options below";
    }

    else {
        questionTitle.firstChild.nodeValue = "Select the correct option";
    }
}

/* changes the question statement. Because the question statement is inside <main> and the question element and <main> are both
 * active through the bubbling phase, it will change also the question title through event propagation of the click event*/

function clickOnQuestionEventHandler(e) {
    var question = document.getElementsByClassName('question__question-statement')[0];
    if (question.firstChild.nodeValue == currentQuestion.problemStatement) {
        question.firstChild.nodeValue = "This is the question, click on me to see the question again";
    }

    else {
        question.firstChild.nodeValue = currentQuestion.problemStatement;
    }
}


makeStandardPageElements();

questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "A _____ cache is located in the client host.", "browser"));
questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which cache request directive prevents the response being cached by any cache?", "no-store", ["no-cache", "no-store", "only-if-cached", "must-revalidate"]));
questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "Cache-control headers are also known as cache _____", "directives"));
questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which inter cache protocol uses HTTP cache-control headers?", "HTCP", ["ICP","HTTP","HTCP","TCP"]));

var currentQuestion = questionObjects[0];
currentQuestion.loadQuestion();














