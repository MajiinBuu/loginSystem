// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClvlw2ij0_ET5kPgArRyKE3sooZ3imPXY",
    authDomain: "login-system-9d2a4.firebaseapp.com",
    databaseURL: "https://login-system-9d2a4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "login-system-9d2a4",
    storageBucket: "login-system-9d2a4.appspot.com",
    messagingSenderId: "892579975252",
    appId: "1:892579975252:web:17cf37b87575aa3d1c5dc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);


// add event listener on form
document.querySelector('form').addEventListener("submit", e => {
    e.preventDefault();

    let submitter = e.submitter.value

    switch (submitter) {
        case "Login":
            {
                let canLogin = false;

                checkLogin().then(login => {
                    canLogin = login;

                    if (canLogin) {
                        RedirectionJavascript();
                    }
                    else {
                        alert("Wrong value");
                    }

                }).catch(err => {
                    console.log(err);
                });

                break;
            }

        case "Register":
            {
                let canRegister = false;

                checkData().then(register => {
                    canRegister = register;

                    if (canRegister) {
                        let isLogged = insertData();

                        if (isLogged)
                            RedirectionJavascript();
                        else
                            alert("Sorry something going wrong");
                    }
                    else {
                        alert("email already used");
                    }

                }).catch(err => {
                    console.log(err);
                });

                break;
            }
    }
});


// ===================================== GETTER =====================================
function getUsername() {
    const username = document.getElementById("username").value;
    if (username === "") {
        alert("pleas fill in username field")
        return;
    }
    else
        return username;
}

function getUsermail() {
    const email = document.getElementById("email").value;
    if (email === "") {
        alert("pleas fill in email field")
        return;
    }
    else
        return email;
}

function getUserPassword() {
    const password = document.getElementById("password").value;
    if (password === "") {
        alert("pleas fill in password field")
        return;
    }
    else
        return password;
}


// ===================================== helper =====================================
function clearInput() {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function RedirectionJavascript() {
    clearInput();
    location.replace("./logged.html");
    //window.location.href = "./logged.html";
}


// Loading ID
let userID = 0;
loadCountID().then(counterID => {
    userID = counterID;
}).catch(err => {
    console.log(err);
});

let username = "";
let email = "";
let password = "";


// ===================================== DB FUNCTION =====================================
function insertData() {

    let logged = false;

    try {
        set(ref(db, 'User/' + userID), {
            Name: username,
            Email: email,
            Password: password
        }).then(() => {
            alert("date inserted succesfully");
        });

        logged = true;

        userID++;
    }
    catch (error) {
        console.log(error);
    }

    return logged;
}

function checkData() {

    username = getUsername();
    email = getUsermail();
    password = getUserPassword();

    let loginAvailible = true;

    // return promise to allow to wait the end of the function
    return new Promise((resolve, reject) => {
        get(child(dbRef, "User/")).then((snapshot) => {

            snapshot.forEach(childSnapshot => {

                // stop the foreach if registration is unavailible
                if (loginAvailible === false)
                    return;

                // get data of each snapshot
                const data = childSnapshot.val();

                // check if email is already used
                if (data.Email === email)
                    loginAvailible = false;
            })
            // return the value
            resolve(loginAvailible);

        }).catch((error) => {
            console.log(error);
        });
    }
    )
}


function checkLogin() {

    email = getUsermail();
    password = getUserPassword();

    let loginAvailible = false;

    // return promise to allow to wait the end of the function
    return new Promise((resolve, reject) => {
        get(child(dbRef, "User/")).then((snapshot) => {

            snapshot.forEach(childSnapshot => {

                // stop the foreach when first occurence is availible
                if (loginAvailible === true)
                    return;

                // get data of each snapshot
                const data = childSnapshot.val();

                // check if email and name match
                if (data.Email === email && data.Password === password)
                    loginAvailible = true;

            })
            // return the value
            resolve(loginAvailible);

        }).catch((error) => {
            console.log(error);
        });
    })
}


function loadCountID() {

    let counterID = 0;

    // return promise to allow to wait the end of the function
    return new Promise((resolve, reject) => {
        get(child(dbRef, "User/")).then((snapshot) => {

            snapshot.forEach(childSnapshot => {
                counterID++;
            })
            // return the value
            resolve(counterID);

        }).catch((error) => {
            console.log(error);
        });
    })
}

function displayFrom() {
    var value = ["submit", "regisrer", "username"];

    for (let i = 0; i < value.length; i++) {
        var x = document.getElementById(value[i]);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    var x = document.getElementById("titleH2");
    if (x.textContent === "Login") {
        x.textContent = "Register";
    }
    else if (x.textContent === "Register") {
        x.textContent = "Login";
    }
}