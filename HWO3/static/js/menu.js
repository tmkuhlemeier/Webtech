var domArray = createDomArray(["header","body","footer"]);//
var colorAndFontSizeArray = ["green", "red", "steelblue", "white","medium","large","x-large"];//
var themeArray = ["light","dark"];///

makeMenus();///


// --functions-- \\ 

///
function createDomArray(elemArr) {
    var domArr = [];
    for (const elem of elemArr){
        if (document.getElementsByTagName(elem).length>0){
            domArr.push(elem);
        }
    }
    return domArr;
}
///

function makeMenus() {

    fillDomArray();

    var dropdownList = document.createElement("select");
    var dropdownList2 = document.createElement("select");
    var dropdownList3 = document.createElement("select");///

    var header = document.getElementsByTagName("header")[0];

    var menu = document.createElement("p");
    var domLabel = document.createElement("LABEL");
    var styleLabel = document.createElement("LABEL");
    var themeLabel = document.createElement("LABEL");///

    dropdownList.setAttribute("id", "domSelect");
    dropdownList2.setAttribute("id", "styleSelect");
    dropdownList3.setAttribute("id", "themeSelect");///

    domLabel.setAttribute("for", "domSelect");
    styleLabel.setAttribute("for", "styleSelect");
    themeLabel.setAttribute("for","themeSelect");///

    domLabel.appendChild(document.createTextNode("Element: "));
    styleLabel.appendChild(document.createTextNode(" Style: "));
    themeLabel.appendChild(document.createTextNode(" Theme: "));///
    dropdownList.addEventListener("change", changeColor);
    dropdownList2.addEventListener("change", changeColor);
    dropdownList3.addEventListener("change",changeTheme);///

    var header = document.getElementsByTagName("header")[0];

    header.appendChild(menu);

    menu.appendChild(domLabel);
    fillDropdown(dropdownList, domArray);
    menu.appendChild(styleLabel);
    fillDropdown(dropdownList2, colorAndFontSizeArray);
    menu.appendChild(themeLabel);///
    fillDropdown(dropdownList3, themeArray);///
}

///
function changeTheme(){
    var dropdownList3 = document.getElementById('themeSelect');
    var selectedTheme = dropdownList3.options[dropdownList3.selectedIndex].text;

    var domElems = createDomArray(["table","header","body","footer","ul"]);

    if (domElems.includes("table")){
        document.getElementsByTagName("table")[0].style.color="black";
    }

    if (selectedTheme == "dark"){
        document.getElementsByTagName("header")[0].style.background="dimgray";
        document.body.style.background="black";
        document.getElementsByTagName("ul")[0].style.background="gray";
        document.body.style.color = "whitesmoke";
        document.getElementsByTagName("main")[0].style.background="dimgray";
        document.getElementsByTagName("footer")[0].style.background="dimgray";
    }
    else {
        document.getElementsByTagName("header")[0].style.background="white";
        document.body.style.background="steelblue";
        document.getElementsByTagName("ul")[0].style.background="white";
        document.body.style.color = "black";
        document.getElementsByTagName("main")[0].style.background="white";
        document.getElementsByTagName("footer")[0].style.background="white";
    }
}
///

function fillDomArray() {

    var pageName = document.getElementsByTagName('Title')[0].firstChild.nodeValue;
    if (pageName == "Assesment" || pageName == "Login" || pageName == "Register") {
        domArray.push("Article");
    }

    else {
        for (let i of document.getElementsByClassName("article__heading")) {
            domArray.push(i.firstChild.nodeValue);
        }

        for (let i of document.getElementsByClassName("section__heading")) {
            domArray.push(i.firstChild.nodeValue);
        }
    }
    
}

function fillDropdown(dropdown, array) {

    var defOptn = document.createElement("option");
    defOptn.setAttribute("value", "");
    defOptn.setAttribute("disabled", "disabled");
    defOptn.setAttribute("selected", "selected");
    defOptn.setAttribute("hidden", "hidden");
    defOptn.appendChild(document.createTextNode("choose option"));

    
    dropdown.appendChild(defOptn);

    for(let i = 0; i < array.length; i++){///
        let option = document.createElement("option");///
        option.setAttribute("value", array[i]);
        option.appendChild(document.createTextNode(array[i]));
        dropdown.appendChild(option);
    }

    var menu = document.getElementsByTagName('p')[0];
    menu.appendChild(dropdown);
}

function changeColor() {
    var dropdownList = document.getElementById('domSelect');
    var dropdownList2 = document.getElementById('styleSelect');

    var selectedText1 = dropdownList.options[dropdownList.selectedIndex].text;
    var selectedText2 = dropdownList2.options[dropdownList2.selectedIndex].text;

    if (selectedText2 != "medium" && selectedText2 != "large" && selectedText2 != "x-large") {//
        if (selectedText1 != "header" && selectedText1 != "body" && selectedText1 != "footer") {//

            for (let i of document.getElementsByClassName('article__heading')) {
                if (i.firstChild.nodeValue == selectedText1) {
                    i.parentNode.style.background = dropdownList2.options[dropdownList2.selectedIndex].text;
                }
            }

            for (let i of document.getElementsByClassName('section__heading')) {
                if (i.firstChild.nodeValue == selectedText1) {
                    i.parentNode.style.background = dropdownList2.options[dropdownList2.selectedIndex].text;
                }
            }
        }

        else {
            document.getElementsByTagName(selectedText1)[0].style.background = dropdownList2.options[dropdownList2.selectedIndex].text;
        }
    }

    else {
        if (selectedText1 != "header" && selectedText1 != "body") {

            for (let i of document.getElementsByClassName('article__heading')) {
                if (i.firstChild.nodeValue == selectedText1) {
                    for (let j of i.parentNode.children) {
                        j.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
                    }
                }
            }

            for (let i of document.getElementsByClassName('section__heading')) {
                if (i.firstChild.nodeValue == selectedText1) {
                    for (let j of i.parentNode.children) {
                        j.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
                    }
                }
            }
        }

        else if (selectedText1 == "header") {
            for (let i of document.getElementsByTagName('header')[0].children) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }
        }

        else if (selectedText1 == "body"){

            for (let i of document.getElementsByTagName('p')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('h1')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByClassName('nav__list')[0].getElementsByTagName('a')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('h2')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('h3')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('h4')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('th')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('td')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }

            for (let i of document.getElementsByTagName('figure')) {
                i.style.fontSize = dropdownList2.options[dropdownList2.selectedIndex].text;
            }
        }
    }
}