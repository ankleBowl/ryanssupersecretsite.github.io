document.getElementById("prematchContainer").style.display = "none";
document.getElementById("countdownContainer").style.display = "none";
document.getElementById("questionContainer").style.display = "none";
document.getElementById("answeringContainer").style.display = "none";
document.getElementById("reviewContainer").style.display = "none";

ws = null

function connectToServer() {
    console.log("Connecting...")
    ws = new WebSocket("ws://10.0.0.25:13254");
    ws.onopen = function() {
        ws.send("name," + document.getElementById("name").value);
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("prematchContainer").style.display = "block";
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
}

function start() {
    ws.send("start");
    console.log("Started");
}

function guessAnswer(index) {
    ws.send("answer," + index);
    document.getElementById("answeringContainer").style.display = "none";
}