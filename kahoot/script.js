document.getElementById("prematchContainer").style.display = "none";
document.getElementById("countdownContainer").style.display = "none";
document.getElementById("questionContainer").style.display = "none";
document.getElementById("answeringContainer").style.display = "none";
document.getElementById("reviewContainer").style.display = "none";

ws = null

function connectToServer() {
    console.log("Connecting...")
    ws = new WebSocket("ws://162.195.241.63:25565");
    ws.onopen = function() {
        ws.send("name," + document.getElementById("name").value);
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("prematchContainer").style.display = "block";
        playMP3("music/lobby.mp3")
    }
    ws.onmessage = function(event) {
        console.log(event.data);
        var data = event.data.split(",");
        if (data[0] == "players") {
            var players = document.getElementById("playerList");
            players.innerHTML = "";
            for (var i = 1; i < data.length; i++) {
                players.innerHTML += "<div class=\"playerWidget\">" + data[i] + "</div>";
            }
        }
        if (data[0] == "start") {
            console.log("Server start issued")
            document.getElementById("prematchContainer").style.display = "none";
            document.getElementById("countdownContainer").style.display = "block";
            loop = false
            stopMP3();
            startingCountdown()
        }
        if (data[0] == "question") {
            document.getElementById("countdownContainer").style.display = "none";
            document.getElementById("questionContainer").style.display = "block";
            document.getElementById("answeringContainer").style.display = "none";
            document.getElementById("reviewContainer").style.display = "none";

            document.getElementById("question").innerHTML = data[1];
            document.getElementById("question").classList.remove("questionTimer");
            document.getElementById("question").classList.add("questionTimer");

            document.getElementById("question2").innerHTML = data[1];

            document.getElementById("ans1").innerHTML = data[2];
            document.getElementById("ans2").innerHTML = data[3];
            document.getElementById("ans3").innerHTML = data[4];
            document.getElementById("ans4").innerHTML = data[5];
            questionCountdown();
        }
        if (data[0] == "review") {
            stopMP3();
            document.getElementById("reviewContainer").style.display = "flex";
            document.getElementById("score").innerHTML = data[1]
            if (data[7] == "1") {
                document.getElementById("playerPosition").innerHTML = "You are in " + data[7] + "st place!";
            } else if (data[7] == "2") {
                document.getElementById("playerPosition").innerHTML = "You are in " + data[7] + "nd place!";
            } else if (data[7] == "3") {
                document.getElementById("playerPosition").innerHTML = "You are in " + data[7] + "rd place!";
            } else {
                document.getElementById("playerPosition").innerHTML = "You are in " + data[7] + "th place!";
            }
            html = ""
            for (var i = 2; i < 7; i++) {
                console.log(data[i])
                contents = data[i].split('|')
                if (contents[0] == "") {
                    continue
                }
                html += "<div class=\"leaderboardEntry\"><div class=\"leaderboardEntryName\">" + contents[0] + "</div><div class=\"leaderboardEntryScore\">" + contents[1] + "</div></div>"
            }
            document.getElementById("leaderboard").innerHTML = html;
        }
        if (data[0] == "answer") {
            if (document.getElementById("score").hasAttribute("style")) {
                document.getElementById("score").removeAttribute("style");
            }
            if (document.getElementById("playerPosition").hasAttribute("style")) {
                document.getElementById("playerPosition").removeAttribute("style");
            }
            if (data[1] == "incorrect") {
                document.getElementById("playerPosition").setAttribute("style", "background-color: rgb(173, 38, 38);")
                document.getElementById("score").setAttribute("style", "background-color: rgb(173, 38, 38);")
            } else {
                document.getElementById("playerPosition").setAttribute("style", "background-color: rgb(22, 187, 63)")
                document.getElementById("score").setAttribute("style", "background-color: rgb(22, 187, 63)")
            }
        }
    }
}

function delay(n) {
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

async function startingCountdown() {
    var countdown = document.getElementById("countdown");
    countdown.innerHTML = "3";
    await delay(1);
    countdown.innerHTML = "2";
    await delay(1);
    countdown.innerHTML = "1";
    await delay(1);
    return true
}

async function questionCountdown() {
    await delay(5);
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("answeringContainer").style.display = "block";
    var random = Math.floor(Math.random() * 3) + 1;
    playMP3("music/question" + random + ".mp3")
}

function start() {
    ws.send("start");
    console.log("Started");
}

function guessAnswer(index) {
    ws.send("answer," + index);
    document.getElementById("answeringContainer").style.display = "none";
}

audio = document.getElementById("audioPlayer");
loop = true

function playMP3(name) {
    stopMP3();
    audio.children[0].src = name;
    audio.load();
    audio.play();

    audio.addEventListener('ended', function() {
        if (loop) {
            this.currentTime = 0;
            this.play();
        }
    }, false);
}

function stopMP3() {
    audio.pause();
}