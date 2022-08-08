/*script voor de quiz*/

var questionObjects = [];

class topic {
    constructor(title, description, link, quizzes) {
        this.title = title;
        this.description = description;
        this.link = link;
        this.quizzes = quizzes;
    }

    goBack(e) {
        e.stopPropagation();

        var main = document.getElementsByTagName('main')[0];

        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        
        var req = new XMLHttpRequest();
        req.open("GET", '/remove-current-topic', true);
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                makeTopicMenu();
            }
        }
        req.send();

    }

}

class quiz {
    constructor(title, questions, topic) {
        this.title = title;
        this.questions = questions;
        this.topic = topic;
    }

    goBack(e) {
        e.stopPropagation();

        var topicName = encodeURIComponent(currentQuiz.topic);

        get('/topic?topicName=' + topicName, loadTopic);
    }
}

class question {

    //all arguments should be strings
    constructor(title, problemStatement, correctAnswer, subject, questionType) {
        this.title = title;
        this.problemStatement = problemStatement;
        this.correctAnswer = correctAnswer;
        this.answered = false;
        this.subject = subject;
        this.questionType = questionType;
    }

    //loads the correct answer and feedback
    loadAnswer(correctnessObj) {

        var correctness = correctnessObj.correctness;

        document.getElementsByClassName('quiz__back-button')[0].remove();

        if (correctness) {
            let p = document.createElement('p');
            let strong = document.createElement('strong');

            p.setAttribute("class", "quiz__feedback");
            strong.appendChild(document.createTextNode("correct"));
            p.appendChild(strong);
            document.getElementsByClassName('quiz')[0].appendChild(p);

            let backButton = makeButton("Go back to the other questions", "quiz__back-button");
            backButton.addEventListener("click", currentQuestion.goBack);
            document.getElementsByClassName('quiz')[0].appendChild(backButton);

        }

        else if (!correctness) {
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            let strong = document.createElement('strong');

            p1.setAttribute("class", "quiz__feedback");
            p2.setAttribute("class", "quiz__correct-answer");

            strong.appendChild(document.createTextNode("wrong"));
            p2.appendChild(document.createTextNode("the correct answer is: " + currentQuestion.correctAnswer + ". Read up on the information by clicking "));
            p1.appendChild(strong);
            
            document.getElementsByClassName('quiz')[0].appendChild(p1);
            document.getElementsByClassName('quiz')[0].appendChild(p2);

            var backButton = makeButton("Go back to the other questions", "quiz__back-button");
            backButton.addEventListener("click", currentQuestion.goBack);
            document.getElementsByClassName('quiz')[0].appendChild(backButton);

            if (currentQuestion.subject == "Response Directives") {
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(currentQuestion.subject));
                a.setAttribute("href", "cache-control.html#cache-control");
                p2.appendChild(a);
            }

            else if (currentQuestion.subject == "Request Directives") {
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(currentQuestion.subject));
                a.setAttribute("href", "cache-control.html#cache-control");
                p2.appendChild(a);
            }

            else if (currentQuestion.subject == "Cache Hierarchies") {
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(currentQuestion.subject));
                a.setAttribute("href", "cache-clusters.html#cache-hierarchies");
                p2.appendChild(a);
            }

            if (currentQuestion.subject == "Inter Cache Protocols") {
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(currentQuestion.subject));
                a.setAttribute("href", "cache-clusters.html#inter-cache-protocols");
                p2.appendChild(a);
            }
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

        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        var article = document.createElement('article');
        article.setAttribute("class", "quiz");

        var questionTitle = document.createElement('h2');
        questionTitle.setAttribute("class", "quiz__title");
        questionTitle.appendChild(document.createTextNode(currentQuestion.title));
        
        article.appendChild(questionTitle);

        var questionStatement = document.createElement('p');
        questionStatement.setAttribute("class", "quiz__question-statement");
        questionStatement.appendChild(document.createTextNode(currentQuestion.problemStatement));
        questionStatement.addEventListener("click", clickOnProblemStatementEventHandler, false);
        article.appendChild(questionStatement);

        main.appendChild(article);

        
    }

    goBack(e) {
        e.stopPropagation();

        var quizName = encodeURIComponent(currentQuestion.subject);

        get('/quiz?quizName=' + quizName, loadQuiz);
    }
}

class multipleChoiceQuestion extends question {

    //possibleAnswers should be an array of strings
    constructor(title, problemStatement, correctAnswer, subject, possibleAnswers, questionType) {
        super(title, problemStatement, correctAnswer, subject, questionType);
        this.possibleAnswers = possibleAnswers;
        
    }

    loadQuestion() {
        super.loadQuestion();

        var main = document.getElementsByTagName('main')[0];

        var possibleAnswer1 = makeButton(currentQuestion.possibleAnswers[0], "quiz__multiple-choice-button");
        var possibleAnswer2 = makeButton(currentQuestion.possibleAnswers[1], "quiz__multiple-choice-button");
        var possibleAnswer3 = makeButton(currentQuestion.possibleAnswers[2], "quiz__multiple-choice-button");
        var possibleAnswer4 = makeButton(currentQuestion.possibleAnswers[3], "quiz__multiple-choice-button");

        var question = document.getElementsByClassName('quiz')[0];

        question.appendChild(possibleAnswer1);
        question.appendChild(possibleAnswer2);
        question.appendChild(possibleAnswer3);
        question.appendChild(possibleAnswer4);

        possibleAnswer1.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer2.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer3.addEventListener("click", currentQuestion.answerEventhandler);
        possibleAnswer4.addEventListener("click", currentQuestion.answerEventhandler);  

        var backButton = makeButton("Go back to the other questions", "quiz__back-button");
        backButton.addEventListener("click", currentQuestion.goBack);
        document.getElementsByClassName('quiz')[0].appendChild(backButton);
    }

    //handlers the event when an answer by the user is submitted
    answerEventhandler(e) {

        e.stopPropagation();

        if (!currentQuestion.answered && loggedIn) {
            var givenAnswer = encodeURIComponent(e.target.firstChild.nodeValue);
            var questionName = currentQuestion.title;
            get('/answer?questionName=' + questionName + '&givenAnswer=' + givenAnswer, currentQuestion.loadAnswer);
            currentQuestion.answered = true;
            e.target.setAttribute("class", "quiz__multiple-choice-button--selected");
        }

        else if (!loggedIn) {
            loadNotLoggedIn();
        }
    }

    loadAnswer(correctnessObject) {
        super.loadAnswer(correctnessObject);
    }

    nextPage() {
        super.nextPage();
    }

    goBack(e) {
        super.goBack(e);
    }
}

class fillInTheBlankQuestion extends question {

    constructor(title, problemStatement, correctAnswer,subject, questionType) {
        super(title, problemStatement, correctAnswer, subject, questionType);
    }

    loadAnswer(correctnessObj) {
        super.loadAnswer(correctnessObj);
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
        textBox.setAttribute("class", "textbox");
        textBox.addEventListener("click", clickOnTextBoxEventHandler);
        
        
        
        var question = document.getElementsByClassName('quiz')[0];
        


        var confirmButton = makeButton("Confirm", "quiz__confirm-button");
        confirmButton.addEventListener("click", currentQuestion.answerEventhandler);

        
        question.appendChild(textBox);
        question.appendChild(confirmButton);

        var backButton = makeButton("Go back to the other questions", "quiz__back-button");
        backButton.addEventListener("click", currentQuestion.goBack);
        document.getElementsByClassName('quiz')[0].appendChild(backButton);
        
    }

    answerEventhandler(e) {
        
        e.stopPropagation();
        
        var answer = document.getElementsByName('textbox')[0].value;

        if (answer && !currentQuestion.answered && loggedIn) {
            var givenAnswer = encodeURIComponent(answer);
            var questionName = currentQuestion.title;
            get('/answer?questionName=' + questionName + '&givenAnswer=' + givenAnswer, currentQuestion.loadAnswer);
            currentQuestion.answered = true;
        }

        else if (!loggedIn) {
            loadNotLoggedIn();
        }
    }

    goBack(e) {
        super.goBack(e);
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

function clickOnTextBoxEventHandler(e) {
    e.stopPropagation();
}

//generates all the standard page elements that every page has e.g. the page headings and the navigation menu
function makeStandardPageElements() {
    var header, nav, h1, h2, navList, a1, a2, a3, a4, a5, a6, li1, li2, li3, li4, li5, li6, loginLink, registerLink, jsonTest;
    header = document.getElementsByTagName("header")[0];
    nav = document.getElementsByTagName("nav")[0];
    h1 = document.createElement("h1");
    h2 = document.createElement("h2");
    navList = document.createElement("ul");

    loginLink = document.createElement('a');
    loginLink.setAttribute('id', "login-link");
    loginLink.setAttribute('href', "login.html");
    loginLink.setAttribute('target', "_self");
    loginLink.appendChild(document.createTextNode("Login"));

    registerLink = document.createElement('a');
    registerLink.setAttribute('id', "register-link");
    registerLink.setAttribute('href', "register.html");
    registerLink.setAttribute('target', "_self");
    registerLink.appendChild(document.createTextNode("Register"));

    jsonTest = makeButton("jsontest", "nie");

    jsonTest.addEventListener("click", doeiets);

    header.appendChild(jsonTest);

    header.appendChild(loginLink);
    header.appendChild(registerLink);

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
    
    var articleTitle = document.getElementsByClassName('quiz__title')[0];

    

    if (articleTitle.firstChild.nodeValue == currentQuestion.title && currentQuestion.questionType == "open") {
        articleTitle.firstChild.nodeValue = "Use the textbox";
    }

    else if (articleTitle.firstChild.nodeValue == "Use the textbox") {
        articleTitle.firstChild.nodeValue = currentQuestion.title;
    }

    else if (articleTitle.firstChild.nodeValue == currentQuestion.title && currentQuestion.questionType == "multipleChoice") {
        articleTitle.firstChild.nodeValue = "Select the correct option";
    }

    else if (articleTitle.firstChild.nodeValue == "Select the correct option") {
        articleTitle.firstChild.nodeValue = currentQuestion.title;
    }

    
}

/* changes the question statement. Because the question statement is inside <main> and the question element and <main> are both
 * active through the bubbling phase, it will change also the question title through event propagation of the click event*/

function clickOnProblemStatementEventHandler(e) {
    var question = document.getElementsByClassName('quiz__question-statement')[0];
    if (question.firstChild.nodeValue == currentQuestion.problemStatement) {
        question.firstChild.nodeValue = "This is the question, click on me to see the question again";
    }

    else {
        question.firstChild.nodeValue = currentQuestion.problemStatement;
    }
}

function clickOnTopicEventHandler(e) {

    //voorkomt dat clickOnMainEventHandler wordt aangesproken in de bubble-phase
    e.stopPropagation();

    var topicName = encodeURIComponent(e.target.firstChild.nodeValue);

    get('/topic?topicName=' + topicName, loadTopic);
}

function makeTopicMenu() {

    var main = document.getElementsByTagName('main')[0];
    var article = document.createElement('article');
    article.setAttribute("class", "quiz");
    var articleHeading = document.createElement('h2');
    articleHeading.appendChild(document.createTextNode("Topics"));
    articleHeading.setAttribute("class", "quiz__title");
    main.appendChild(article);

    var buttonTopic1 = makeButton("Cache Control", "quiz__button");
    var buttonTopic2 = makeButton("Cache Clusters", "quiz__button");

    article.appendChild(articleHeading);
    article.appendChild(buttonTopic1);
    article.appendChild(buttonTopic2);

    buttonTopic1.addEventListener("click", clickOnTopicEventHandler, false);
    buttonTopic2.addEventListener("click", clickOnTopicEventHandler, false);


}

function loadTopic(top) {


    var main = document.getElementsByTagName('main')[0];

    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    currentTopic = new topic(top.title, top.description, top.link, top.quizzes);

    var article = document.createElement('article');
    article.setAttribute("class", "quiz");

    var articleHeading = document.createElement('h2');
    articleHeading.setAttribute("class", "quiz__title");
    articleHeading.appendChild(document.createTextNode(currentTopic.title));

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(currentTopic.description));

    var a = document.createElement('a');
    a.appendChild(document.createTextNode(currentTopic.link.anchor));
    a.setAttribute("href", currentTopic.link.href);

    p.appendChild(a);

    var buttonQuiz1 = makeButton(currentTopic.quizzes.quiz1, "quiz__button");
    var buttonQuiz2 = makeButton(currentTopic.quizzes.quiz2, "quiz__button");

    buttonQuiz1.addEventListener("click", clickOnQuizEventHandler, false);
    buttonQuiz2.addEventListener("click", clickOnQuizEventHandler, false);

    var backButton = makeButton("Go back to the other topics", "quiz__back-button");
    backButton.addEventListener("click", currentTopic.goBack);

    main.appendChild(article);
    article.appendChild(articleHeading);
    article.appendChild(p);
    article.appendChild(buttonQuiz1);
    article.appendChild(buttonQuiz2);
    article.appendChild(backButton);
}

/*function die een url get d.m.v. ajax, op de server moet je deze request regelen met app.get(url).
 * de server stuurt dan een json string terug naar de client
 * deze functie zet deze string om in een js object en geeft dat object dan door aan de callback functie*/
function get(url, callback) {

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            console.log(req.responseText);
            let obj = JSON.parse(req.responseText);
            console.log(obj);
            callback(obj);
        }
    }
    req.send();
}

function doeiets() {
    
    get('/topic?topicName=cacheControl', alert);
    
    
}


function clickOnQuizEventHandler(e) {

    e.stopPropagation();

    var quizName = encodeURIComponent(e.target.firstChild.nodeValue);

    get('/quiz?quizName=' + quizName, loadQuiz);
}

function loadQuiz(qui) {
    var main = document.getElementsByTagName('main')[0];
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    currentQuiz = new quiz(qui.title, qui.questions, qui.topic);

    var article = document.createElement('article');
    article.setAttribute("class", "quiz");

    var articleHeading = document.createElement('h2');
    articleHeading.setAttribute("class", "quiz__title");
    articleHeading.appendChild(document.createTextNode(currentQuiz.title));

    var p = document.createElement('p');
    p.appendChild(document.createTextNode("Choose one of the questions"));

    var buttonQuestion1 = makeButton(currentQuiz.questions.question1, "quiz__button");
    var buttonQuestion2 = makeButton(currentQuiz.questions.question2, "quiz__button");
    var buttonQuestion3 = makeButton(currentQuiz.questions.question3, "quiz__button");

    buttonQuestion1.addEventListener("click", clickOnQuestionEventHandler, false);
    buttonQuestion2.addEventListener("click", clickOnQuestionEventHandler, false);
    buttonQuestion3.addEventListener("click", clickOnQuestionEventHandler, false);

    var backButton = makeButton("Go back to the other quizzes", "quiz__back-button");
    backButton.addEventListener("click", currentQuiz.goBack);
    
    

    main.appendChild(article);
    article.appendChild(articleHeading);
    article.appendChild(p);
    article.appendChild(buttonQuestion1);
    article.appendChild(buttonQuestion2);
    article.appendChild(buttonQuestion3);
    article.appendChild(backButton);
}

function clickOnQuestionEventHandler(e) {

    e.stopPropagation();

    var questionName = encodeURIComponent(e.target.firstChild.nodeValue);

    get('/question?questionName=' + questionName, loadQuestion);
}

function loadQuestion(question) {
    if (question.questionType == "open") {
        currentQuestion = new fillInTheBlankQuestion(question.title, question.problemStatement, question.answers.correctAnswer, question.subject, question.questionType);
        currentQuestion.loadQuestion();
    }

    else if (question.questionType == "multipleChoice") {
        currentQuestion = new multipleChoiceQuestion(question.title, question.problemStatement, question.answers.correctAnswer, question.subject, question.answers.possibleAnswers, question.questionType);
        currentQuestion.loadQuestion();
    }
}

function loadNotLoggedIn() {


    if (!document.getElementsByTagName('strong')[0]) {
        document.getElementsByClassName('quiz__back-button')[0].remove();

        var p = document.createElement('p');
        var strong = document.createElement('strong');

        p.setAttribute("class", "quiz__feedback");
        strong.appendChild(document.createTextNode("You need to be logged in to answer questions"));
        p.appendChild(strong);
        document.getElementsByClassName('quiz')[0].appendChild(p);

        var backButton = makeButton("Go back to the other questions", "quiz__back-button");
        backButton.addEventListener("click", currentQuestion.goBack);
        document.getElementsByClassName('quiz')[0].appendChild(backButton);

    }
}

//reloads question, quiz or topic from current session if necessary
function loadSessionState(user) {
    
    if (user) {

        loggedIn = true;

        if (user.currentQuizState.currentQuestion) {

            loadQuestion(user.currentQuizState.currentQuestion);
        }


        else if (user.currentQuizState.currentQuiz) {
            loadQuiz(user.currentQuizState.currentQuiz);
        }

        else if (user.currentQuizState.currentTopic) {
            loadTopic(user.currentQuizState.currentTopic);
        }
    }
}



var currentQuestion;
var currentQuiz;
var currentTopic;
var loggedIn = false;




makeStandardPageElements();

makeTopicMenu();

get('/userinfo', loadSessionState);
















/*if (e.target.firstChild.nodeValue == "Request Directives") {
        questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "The _____ directive keeps track of the time during which an item is fresh.", "max-age", "Request Directives"));
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which cache request directive prevents the response being cached by any cache?", "no-store", "Request Directives", ["no-cache", "no-store", "only-if-cached", "must-revalidate"]));
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which directive indicates that the client accepts a stale response?", "max-stale", "Request Directives", ["no-cache", "only-if-cached", "max-stale", "no-store"]));
        currentQuestion = questionObjects[0];
        currentQuestion.loadQuestion();
    }

    else if (e.target.firstChild.nodeValue == "Response Directives") {
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which directive indicates that the response can only be cached by the client?", "private", "Response Directives", ["ICP", "client-only", "public", "private"]));
        questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "The _____ directive makes it possible for the response to be cached anywhere.", "public", "Response Directives"));
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Which directive indicates that a stale response has to be revalidated by the server first?","must-revalidate", "Response Directives", ["must-revalidate", "only-if-cached", "no-store", "HTCP"]));
        currentQuestion = questionObjects[0];
        currentQuestion.loadQuestion();
    }

    else if (e.target.firstChild.nodeValue == "Cache Hierarchies") {
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "Sibling caches can not forward requests to eachother", "True", "Cache Hierarchies", ["True", "Only when the other sibling is busy","False","Only when the cache handling the request has no parent"]));
        questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "_____ caches are on the same level in the hierarchy", "sibling", "Cache Hierarchies"));
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "What happens when siblings can't find an item", "The request will be forwarded to a parent", "Cache Hierarchies", ["The request is thrown away", "The origin server will send an error to the client", "The request will be forwarded to a parent","The cache cluster will explode"]));
        currentQuestion = questionObjects[0];
        currentQuestion.loadQuestion();
    }

    else if (e.target.firstChild.nodeValue == "Inter Cache Protocols") {
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "ICP datapackages are _____", "fast & unreliable", "Inter Cache Protocols", ["fast & unreliable", "slow & reliable", "just fast", "just slow"]));
        questionObjects.push(new fillInTheBlankQuestion("Fill in the blank", "ICP is mostly used between _____ caches", "sibling", "Inter Cache Protocols"));
        questionObjects.push(new multipleChoiceQuestion("Select the correct option", "HTCP stands for", "HyperText Caching Protocol", "Inter Cache Protocols",["Hyper Transfer Coach Protocol", "HyperText Caching Protocol", "Html Text Cache Protocol", "Http Text Coordination Protocol"]));
        currentQuestion = questionObjects[0];
        currentQuestion.loadQuestion();
    }*/


