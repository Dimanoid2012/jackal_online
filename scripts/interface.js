function gamesList(text) {
    var tbody = document.getElementById("gamesList").getElementsByTagName("tbody")[0];
    //text = JSON.parse(text);
    text = eval(text);
    text.forEach(function(players) {
        var tr = document.createElement("tr");
        for(var i = 0; i < 4; i++) {
            var td = document.createElement("td");
            td.innerHTML = i < players.length ? players[i] : "-";
            tr.appendChild(td);
        }
        tr.onclick = function() {
            query('field', gameStart);
        };
        tbody.appendChild(tr);
    });
}

function createField() {
    var table = document.getElementById("field");
    table.innerHTML = "";
    for(var i = 0; i < 13; i++) {
        var tr = document.createElement("tr");
        for(var j = 0; j < 13; j++) {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function gameStart(text) {
    if(text == "None") return;
    var field = JSON.parse(text);
    createField();
    var div = document.getElementById('gamesListDiv');
    div.style.display = "none";
    div = document.getElementById('fieldDiv');
    div.style.display = "block";
    var table = document.getElementById('field');
    for(var i = 0; i < field.length; i++) {
        var tr = table.getElementsByTagName("tr")[i];
        for(var j = 0; j < field[i].length; j++) {
            var td = tr.getElementsByTagName("td")[j];
            var img = document.createElement("img");
            img.width = 32;
            img.height = 32;
            img.src = "/images/" + field[i][j] + ".png";
            td.appendChild(img);
        }
    }
}

function query(query, f) {
    console.log("Посылаем запрос: " + query);
    var o = new XMLHttpRequest();
    o.onreadystatechange = function() {
        if(o.readyState == 4) {
            if(o.status == 200) {
                console.log("Получен ответ от сервера:\n" + o.responseText);
                f(o.responseText);
            }
            else {
                console.log("Ошибка при ожидании запроса:\nreadyState=" + o.readyState + "\nstatus=" + o.status + "\nТекст ошибки:\n" + o.responseText);
            }
        }
    };
    o.open("GET", "?query=" + query, true);
    o.send();
}