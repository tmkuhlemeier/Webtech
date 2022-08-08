var user;

function loadUser(user) {
    if (user) {
        let userName = user.userName;
        document.getElementById('login-link').remove();
        document.getElementById('register-link').remove();
        let h2 = document.createElement('h2');
        h2.appendChild(document.createTextNode("Welcome " + user.userName));
        

        
        h2.setAttribute("class", "header__welcome-text");

        let logoutButton = document.createElement('button');
        logoutButton.append(document.createTextNode('Logout'));
        logoutButton.setAttribute('class', 'logout-button');
        logoutButton.addEventListener("click", clickOnLogoutEventHandler);

        let header = document.getElementsByTagName('header')[0];

        header.insertBefore(logoutButton, header.firstChild);
        header.insertBefore(h2, header.firstChild);

    }
}


function userMainFunction() {

    get('/userinfo', loadUser);

    if (document.getElementsByTagName('title')[0].firstChild.nodeValue == 'Login') {
        document.getElementsByClassName('form__submit')[0].addEventListener("click", registerOrLoginEventHandler);
    }

    else if (document.getElementsByTagName('title')[0].firstChild.nodeValue == 'Register') {
        document.getElementsByClassName('form__submit')[0].addEventListener("click", registerOrLoginEventHandler);
    }
}

function registerOrLoginEventHandler(e) {

    e.preventDefault();

    var userName = document.getElementsByName('username')[0].value;
    var userPassword = document.getElementsByName('password')[0].value;

    if (userName && userPassword && document.getElementsByTagName('title')[0].firstChild.nodeValue == 'Login') {
        let bodyString = "{\"userName\": \"" + userName + "\"" + ", \"userPassword\": \"" + userPassword + "\"}";
        post('/auth', bodyString, loginUser);
    }

    else if (userName && userPassword && document.getElementsByTagName('title')[0].firstChild.nodeValue == 'Register') {
        let bodyString = "{\"userName\": \"" + userName + "\"" + ", \"userPassword\": \"" + userPassword + "\"}";
        post('/reg', bodyString, registerUser);
    }

    else {
        alert("Please fill in a valid username and password");
    }
}

function post(url, bodyString, callback) {

    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let obj = JSON.parse(req.responseText);
            callback(obj);
        }
    }
    req.send(bodyString);
}


function loginUser(responseObject) {
    if (responseObject.userLoggedIn) {
        window.location.replace('index.html');
        
    }

    else {
        alert("Please fill in a valid username and password");
    }
}

function registerUser(responseObject) {
    if (responseObject.userExists) {
        alert("That username is taken already");
    }

    else {
        window.location.replace('index.html');
        
    }
}

function get(url, callback) {

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let obj = JSON.parse(req.responseText);
            callback(obj);
        }
    }
    req.send();
}

function clickOnLogoutEventHandler(e) {
    get('/logout', logoutUser);
}

function logoutUser(empty) {
    window.location.replace('index.html');
}

userMainFunction();