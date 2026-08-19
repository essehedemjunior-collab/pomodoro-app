let temps = document.getElementById("temps");
let start = document.getElementById("start");
let btnav = document.querySelectorAll(".btn-nav");

let enCours = false;

let pomodoro = document.getElementById("pomo");
let shBreak = document.getElementById("sh-br");
let lgBreak = document.getElementById("lg-br");

let restart = document.getElementById("restart");

let rotation = document.getElementById("rotation");

let settings = document.getElementById("settings");

let modalOverlay = document.getElementById("modal-overlay");
let modalClose = document.getElementById("modal-close"); 

let inputPomo = document.getElementById("input-pomo");
let inputShort = document.getElementById("input-short");
let inputLong = document.getElementById("input-long");

let apply = document.getElementById("apply");

let minutesFinales;
let secondesFinales;

let tempsRestant = 25 * 60;
let tempsTotal = 25 * 60;

let intervalId;

let cyclesPomodoro = 0;

let sonDeFin = new Audio("assets/son-de-fin.wav");

function formatTemps(tps){
    let minutes = Math.floor(tps/60);
    let secondes = tps%60;

    if (secondes < 10){
        secondesFinales = "0" + secondes;
    } else {
        secondesFinales = secondes; 
    }

    if (minutes < 10 ){
        minutesFinales = "0" + minutes;
    } else {
        minutesFinales = minutes;
    }

    return minutesFinales + ":" + secondesFinales;
}

temps.textContent = formatTemps(tempsRestant);

function arreterDecompte(){
    clearInterval(intervalId);
    enCours = false;
    start.textContent = "start";
}

if ("Notification" in window){
    if (Notification.permission !== "granted" && Notification.permission !== "denied"){
        Notification.requestPermission();
    }
}


function decompte(){
    tempsRestant -= 1;
    temps.textContent = formatTemps(tempsRestant);
    
    let progression = (tempsTotal - tempsRestant) / tempsTotal;
    let degres = progression * 360;
    rotation.style.transform = "rotate(" + degres + "deg)";

    if (tempsRestant === 0){
        sonDeFin.play();

        
        arreterDecompte();
        
        if (pomodoro.className == "active btn-nav"){
            if ("Notification" in window && Notification.permission === "granted"){
                new Notification("Pomodoro terminé !", {
                    body: "Il est temps de faire une pause !",
                    icon: "assets/favicon-32x32.png"
                });
            }
            cyclesPomodoro += 1;
            if (cyclesPomodoro % 4 === 0){
                activerLongBreak();
            } else {
                activerShortBreak();
            }
        } else {
            activerPomodoro();
            if ("Notification" in window && Notification.permission === "granted"){
                new Notification("Pause terminée !", {
                    body: "Retour au travail !",
                    icon: "assets/favicon-32x32.png"
                });
            }
        }
    }
}


start.addEventListener("click", function (){
    if (enCours === false){
        if (tempsRestant > 0){
            intervalId = setInterval(decompte, 1000);
            start.textContent = "pause";
            enCours = true;
        }
    } else {
        clearInterval(intervalId);
        start.textContent = "resume";
        restart.textContent = "restart";
        enCours = false;
    }
});

restart.addEventListener("click", function (){
    arreterDecompte();

    /*if (pomodoro.className == "active btn-nav"){
        tempsTotal = 25 * 60;
        tempsRestant = 25 * 60;
    } else if (shBreak.className == "active btn-nav"){
        tempsTotal = 5 * 60;
        tempsRestant = 5 * 60;
    } else if (lgBreak.className == "active btn-nav"){
        tempsTotal = 15 * 60;
        tempsRestant = 15 * 60;
    }*/
    if (pomodoro.className == "active btn-nav"){
        tempsTotal = Number(inputPomo.value) * 60;
        tempsRestant = Number(inputPomo.value) * 60;
    } else if (shBreak.className == "active btn-nav"){
        tempsTotal = Number(inputShort.value) * 60;
        tempsRestant = Number(inputShort.value) * 60;
    } else if (lgBreak.className == "active btn-nav"){
        tempsTotal = Number(inputLong.value) * 60;
        tempsRestant = Number(inputLong.value) * 60;
    }
    
    restart.textContent = "";
    temps.textContent = formatTemps(tempsRestant);
});

function activerPomodoro(){
    tempsTotal = Number(inputPomo.value) * 60;
    tempsRestant = Number(inputPomo.value) * 60;
    temps.textContent = formatTemps(tempsRestant);
    pomodoro.className = "active btn-nav";
    shBreak.className = "btn-nav";
    lgBreak.className = "btn-nav";
    
    btnav.forEach(btn => {
        btn.style.backgroundColor = "";
    });
    document.querySelector("#boutons .active").style.backgroundColor = couleurSelectionnee;

}

function activerShortBreak(){
    tempsTotal = Number(inputShort.value) * 60;
    tempsRestant = Number(inputShort.value) * 60;
    temps.textContent = formatTemps(tempsRestant);
    shBreak.className = "active btn-nav";
    lgBreak.className = "btn-nav";
    pomodoro.className = "btn-nav";
    
    btnav.forEach(btn => {
        btn.style.backgroundColor = "";
    });
    document.querySelector("#boutons .active").style.backgroundColor = couleurSelectionnee;

}

function activerLongBreak(){
    tempsTotal = Number(inputLong.value) * 60;
    tempsRestant = Number(inputLong.value) * 60;
    temps.textContent = formatTemps(tempsRestant);
    lgBreak.className = "active btn-nav";
    shBreak.className = "btn-nav";
    pomodoro.className = "btn-nav";
    
    btnav.forEach(btn => {
        btn.style.backgroundColor = "";
    });
    document.querySelector("#boutons .active").style.backgroundColor = couleurSelectionnee;

}

pomodoro.addEventListener("click", function (){
    arreterDecompte();
    activerPomodoro();
    // tempsTotal = 25 * 60;
    // tempsRestant = 25 * 60;
});

shBreak.addEventListener("click", function (){
    arreterDecompte();
    activerShortBreak();
    // tempsTotal = 5 * 60;
    // tempsRestant = 5 * 60;
});

lgBreak.addEventListener("click", function () {
    arreterDecompte();
    activerLongBreak();
    // tempsTotal = 15 * 60;
    // tempsRestant = 15 * 60;
});

settings.addEventListener("click", function () {
    modalOverlay.classList.remove("hidden");
});

modalClose.addEventListener("click", function () {
    modalOverlay.classList.add("hidden");
});

let fontOption = document.querySelectorAll(".option-police");
let colorOption = document.querySelectorAll(".option-couleur");
let policeSelectionnee = "Verdana, Geneva, Tahoma, sans-serif";
let couleurSelectionnee = "#ff6b6b";

fontOption.forEach(button => {
    button.addEventListener("click", function () {
        fontOption.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        policeSelectionnee = button.dataset.font;
    });
});

colorOption.forEach(button => {
    button.addEventListener("click", function () {
        colorOption.forEach(btn => {
            btn.classList.remove("active");
        });
        
        button.classList.add("active");
        
        couleurSelectionnee = button.dataset.color;
        
        document.getElementById("apply").style.backgroundColor = couleurSelectionnee;
    });
});


apply.addEventListener("click", function (){
    // tempsRestant = Number(inputPomo.value) * 60;
    arreterDecompte();

    if (pomodoro.className == "active btn-nav"){
        tempsTotal = Number(inputPomo.value) * 60;
        tempsRestant = Number(inputPomo.value) * 60;
    } else if (shBreak.className == "active btn-nav"){
        tempsTotal = Number(inputShort.value) * 60;
        tempsRestant = Number(inputShort.value) * 60;
    } else if (lgBreak.className == "active btn-nav"){
        tempsTotal = Number(inputLong.value) * 60;
        tempsRestant = Number(inputLong.value) * 60;
    }

    document.querySelector("#container").style.fontFamily = policeSelectionnee;

    document.getElementById("ptrouge").style.backgroundColor = couleurSelectionnee;

    
    let buttonActive = document.querySelector("#boutons .active");
    if (buttonActive) {
        buttonActive.style.backgroundColor = couleurSelectionnee;
    }
    
    modalOverlay.classList.add("hidden");
    
    temps.textContent = formatTemps(tempsRestant);
});