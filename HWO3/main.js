
var express = require("express");
var app = express();
var path = require("path");
var session = require('express-session');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();


var userDbFile = "database/user.db";
var topicDbFile = "database/topics.db";
var quizDbFile = "database/quizzes.db";
var questionDbFile = "database/questions.db";

var userDbExists = fs.existsSync(userDbFile);
var topicDbExists = fs.existsSync(topicDbFile);
var quizDbExists = fs.existsSync(quizDbFile);
var questionDbExists = fs.existsSync(questionDbFile);

var userDb = new sqlite3.Database(userDbFile, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

var topicDb = new sqlite3.Database(topicDbFile, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

var quizDb = new sqlite3.Database(quizDbFile, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

var questionDb = new sqlite3.Database(questionDbFile, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});



//zorgt dat alle static file automatisch geroute worden, dus voor de static files hoef je geen routers te maken
var staticPath = path.join(__dirname, "static");

app.use(express.static(staticPath));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json({ limit: '50mb' }));

app.get('/userinfo', function (req, res) {
    if (req.session.loggedin) {
        res.send(JSON.stringify({ "userName": req.session.username, "currentQuizState": req.session.user.currentQuizState }));
    }
});

app.get('/logout', function (req, res) {
    
    req.session.destroy();
    
    res.send(JSON.stringify({ "userLoggedIn": false }));
});

app.get('/remove-current-topic', function (req, res) {
    if (req.session.loggedin) {
        req.session.user.currentQuizState = {};
        res.send();
    }

    else {
        res.send();
    }
})
/*wanneer je een database wilt aanspreken doe je dat in de serialize functie.
 * nadat db.close() is aangeroepen kun je de database niet meer aanspreken*/

userDb.serialize(function () {

    //users is de naam van de tabel, username en password zijn namen van de 2 kolommen
    if (!userDbExists) {
        userDb.run("CREATE TABLE users (username TEXT, password TEXT)");
        let insert = userDb.prepare("INSERT INTO users VALUES(?,?)");
        insert.run(["user#1", "password#1"]);
        insert.finalize();
    }
});

topicDb.serialize(function () {
    if (!topicDbExists) {
        topicDb.run("CREATE TABLE topics (title TEXT, description TEXT, link TEXT, quizzes TEXT)");
        let insert = topicDb.prepare("INSERT INTO topics VALUES(?,?,?,?)");
        insert.run(["Cache Control", "Choose one of the quizzes which are both about the topic Cache Control. To find information about this topic click the link ", JSON.stringify({ "href": "cache-control.html", "anchor": "information about Cache Control" }), JSON.stringify({ "quiz1": "Request Directives", "quiz2": "Response Directives" })]);
        insert.run(["Cache Clusters", "Choose one of the quizzes which are both about the topic cache clusters. To find information about this topic click the link ", JSON.stringify({ "href": "cache-clusters.html", "anchor": "information about cache clusters" }), JSON.stringify({ "quiz1":"Cache Hierarchies","quiz2":"Inter Cache Protocols"})]);
        insert.finalize();
    }

});

quizDb.serialize(function () {
    if (!quizDbExists) {
        quizDb.run("CREATE TABLE quizzes (title TEXT, questions TEXT, topic TEXT)");
        let insert = quizDb.prepare("INSERT INTO quizzes VALUES(?,?,?)");
        insert.run(["Request Directives", JSON.stringify({ "question1": "Request Directives 1", "question2": "Request Directives 2", "question3": "Request Directives 3" }), "Cache Control"]);
        insert.run(["Response Directives", JSON.stringify({ "question1": "Response Directives 1", "question2": "Response Directives 2", "question3": "Response Directives 3" }), "Cache Control"]);
        insert.run(["Cache Hierarchies", JSON.stringify({ "question1": "Cache Hierarchies 1", "question2": "Cache Hierarchies 2", "question3": "Cache Hierarchies 3" }), "Cache Clusters"]);
        insert.run(["Inter Cache Protocols", JSON.stringify({ "question1": "Inter Cache Protocols 1", "question2": "Inter Cache Protocols 2", "question3": "Inter Cache Protocols 3" }), "Cache Clusters"]);
        insert.finalize();
    }
});

questionDb.serialize(function () {
    if (!questionDbExists) {
        questionDb.run("CREATE TABLE questions(title TEXT, problemStatement TEXT, answers TEXT, questionType TEXT, subject TEXT)");
        let insert = questionDb.prepare("INSERT INTO questions VALUES(?,?,?,?,?)");
        insert.run(["Request Directives 1", "The _____ directive keeps track of the time during which an item is fresh.", JSON.stringify({ "correctAnswer": "max-age" }), "open", "Request Directives"]);
        insert.run(["Request Directives 2", "Which cache request directive prevents the response being cached by any cache?", JSON.stringify({ "correctAnswer": "no-store", "possibleAnswers": ["no-cache", "no-store", "only-if-cache", "must-revalidate"] }), "multipleChoice", "Request Directives"]);
        insert.run(["Request Directives 3", "Which directive indicates that the client accepts a stale response?", JSON.stringify({ "correctAnswer": "max-stale", "possibleAnswers": ["no-cache", "only-if-cached", "max-stale", "no-store"] }), "multipleChoice", "Request Directives"]);
        insert.run(["Response Directives 1", "Which directive indicates that the response can only be cached by the client?", JSON.stringify({ "correctAnswer": "private", "possibleAnswers": ["ICP", "client-only", "public", "private"] }), "multipleChoice", "Response Directives"]);
        insert.run(["Response Directives 2", "The _____ directive makes it possible for the response to be cached anywhere.", JSON.stringify({ "correctAnswer": "public" }), "open", "Response Directives"]);
        insert.run(["Response Directives 3", "Which directive indicates that a stale response has to be revalidated by the server first?", JSON.stringify({ "correctAnswer": "must-revalidate", "possibleAnswers": ["must-revalidate", "only-if-cached", "no-store", "HTCP"] }), "multipleChoice", "Response Directives"]);
        insert.run(["Cache Hierarchies 1", "Sibling caches can not forward requests to eachother", JSON.stringify({ "correctAnswer": "True", "possibleAnswers": ["True", "Only when the other sibling is busy", "False", "Only when the cache handling the request has no parent"] }), "multipleChoice", "Cache Hierarchies"]);
        insert.run(["Cache Hierarchies 2", "_____ caches are on the same level in the hierarchy", JSON.stringify({ "correctAnswer": "sibling" }), "open", "Cache Hierarchies"]);
        insert.run(["Cache Hierarchies 3", "What happens when siblings can't find an item", JSON.stringify({ "correctAnswer": "The request will be forwarded to a parent", "possibleAnswers": ["The request is thrown away", "The origin server will send an error to the client", "The request will be forwarded to a parent", "The cache cluster will explode"] }), "multipleChoice", "Cache Hierarchies"]);
        insert.run(["Inter Cache Protocols 1", "ICP datapackages are _____", JSON.stringify({ "correctAnswer": "fast & unreliable", "possibleAnswers": ["fast & unreliable", "slow & reliable", "just fast", "just slow"] }), "multipleChoice", "Inter Cache Protocols"]);
        insert.run(["Inter Cache Protocols 2", "ICP is mostly used between _____ caches", JSON.stringify({ "correctAnswer": "sibling" }), "open", "Inter Cache Protocols"]);
        insert.run(["Inter Cache Protocols 3", "HTCP stands for", JSON.stringify({ "correctAnswer": "HyperText Caching Protocol", "possibleAnswers": ["Hyper Transfer Coach Protocol", "HyperText Caching Protocol", "Html Text Cache Protocol", "Http Text Coordination Protocol"] }), "multipleChoice", "Inter Cache Protocols"]);
        insert.finalize();
    }
    

});



// post functie die plaats vindt wanneer de form op login html wordt gesubmit  
app.post('/auth', function (req, res) {

    
    
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    
    
    userDb.serialize(function () {
        var prep = userDb.prepare("SELECT username, password FROM users WHERE username=? AND password=?");
        prep.all([userName, userPassword], function (err, rows) {

            if (err) {
                return console.log(err.message);
            }

            else if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.username = userName;
                req.session.user = {
                    "currentQuizState": {}

                };
                res.send(JSON.stringify({ "userLoggedIn": true }));
                
                
                
            }

            else {
                res.send(JSON.stringify({ "userLoggedIn": false }));
                
            }
                
            

        });
        prep.finalize();
    });
       
       
});

app.post('/reg', function (req, res) {

    var userName = req.body.userName;
    var userPassword = req.body.userPassword;

    userDb.serialize(function () {
        var prepSelect = userDb.prepare("SELECT username, password FROM users WHERE username=?");
        prepSelect.all(userName, function (err, rows) {

            if (err) {
                return console.log(err.message);
            }

            else if (rows.length > 0) {
                res.send(JSON.stringify({ "userExists": true }));
                console.log("username bestaat al");
            }

            else {
                let prepInsert = userDb.prepare("INSERT INTO users (username, password) VALUES (?,?)");
                prepInsert.run([userName, userPassword]);
                
                req.session.loggedin = true;
                req.session.username = userName;
                req.session.user = {
                    "currentQuizState": {}
                };
                res.send(JSON.stringify({ "userLoggedIn": true, "userExists":false }));
                
                console.log("user toegevoegd aan de tabel");
                prepInsert.finalize();
            }



        });
        prepSelect.finalize();

    });
    

});

//het is nogal een gedoe met al die quotes, dus ik raad aan dat je mijn format aanhoudt, dan hoort er niks mis te gaan

app.get('/user-database', function (req, res) {

    //whatever rowid you want to select
    var whatever = 1;

    //zendt de inhoud van de tabel naar de user
    userDb.serialize(function () {
        var prep = userDb.prepare("SELECT username, password FROM users WHERE rowid=?");
        prep.each(whatever, function (err, row) {
            res.send(row.username + row.password);
            
        });
        prep.finalize();
    });

    
});

//stuurt een topic terug naar de client
app.get('/topic', function (req, res) {

    /*req.query.topicName is de value van de name-value pair topicName=value in de url die je in de clientside script hebt gespecificeerd
     * zie de functie doeiets() in quizscript.js als voorbeeld*/
    
    var topicName = decodeURIComponent(req.query.topicName);

    topicDb.serialize(function () {

        //haalt row.title, row.description etc. van de rijen waarbij de title gelijk is aan topicName
        var prep = topicDb.prepare("SELECT title, description, link, quizzes FROM topics WHERE title=?");
        prep.each(topicName, function (err, row) {

            var requestedTopic = {
                "title": row.title,
                "description": row.description,
                "link": JSON.parse(row.link),
                "quizzes": JSON.parse(row.quizzes)
            }
            

            if (req.session.loggedin) {
                req.session.user.currentQuizState = { "currentTopic": requestedTopic };
            }
            res.send(JSON.stringify(requestedTopic));

            /*wat er in de response body nu komt te staan is {"title":"titel van topic", "description":"description van topic" etc.}
             * In de clientside javascript doe je var obj = JSON.parse(req.responseText); zodat je het daadwerkelijke object krijgt
             * en dan kun je bijvoorbeeld obj.title opvragen*/

        });
        prep.finalize();
    });
});


app.get('/quiz', function (req, res) {

    var quizName = decodeURIComponent(req.query.quizName);

    quizDb.serialize(function () {
        var prep = quizDb.prepare("SELECT title, questions, topic FROM quizzes WHERE title=?");
        prep.each(quizName, function (err, row) {

            var requestedQuiz = {
                "title": row.title,
                "questions": JSON.parse(row.questions),
                "topic": row.topic
            }

            if (req.session.loggedin) {
                req.session.user.currentQuizState = { "currentQuiz": requestedQuiz }
           
            }
            res.send(JSON.stringify(requestedQuiz));
            
        });
        prep.finalize();
    });
});

app.get('/question', function (req, res) {

    var questionName = decodeURIComponent(req.query.questionName);

    questionDb.serialize(function () {
        var prep = questionDb.prepare("SELECT title, problemStatement, answers, questionType, subject FROM questions WHERE title=?");
        prep.each(questionName, function (err, row) {

            var requestedQuestion = {
                "title": row.title,
                "problemStatement": row.problemStatement,
                "answers": JSON.parse(row.answers),
                "questionType": row.questionType,
                "subject": row.subject
            };

            if (req.session.loggedin) {
                req.session.user.currentQuizState = { "currentQuestion": requestedQuestion };
            }

            res.send(JSON.stringify(requestedQuestion));
            
        });
        prep.finalize();
    });
    
}); 

app.get('/answer', function (req, res) {

    var questionName = decodeURIComponent(req.query.questionName);
    var givenAnswer = decodeURIComponent(req.query.givenAnswer);

    questionDb.serialize(function () {
        var prep = questionDb.prepare("SELECT answers FROM questions WHERE title=?");
        prep.each(questionName, function (err, row) {

            let correctnessObj = JSON.parse(row.answers).correctAnswer;

            res.send("{\"correctness\": " + (givenAnswer == correctnessObj) + "}");
            
        });
        prep.finalize();
    });

}); 

app.listen(3000);
