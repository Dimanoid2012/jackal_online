function gamesList(content) {
    var tbody = document.getElementById("gamesList").getElementsByTagName("tbody")[0];
    content.games.forEach(function(game)
    {
        var tr = document.createElement("tr");
        for(var i = 0; i < 4; i++) {
            var td = document.createElement("td");
            td.innerHTML = (i < game.players.length) ? game.players[i] : '-';
            tr.appendChild(td);
        }
        tr.onclick = function() {
            //query('chooseGame&gameId=' + content.game);
            window.location.href = "?gameId=" + game.id;
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

function query(query) {
    // Получаем GET-параметры
    var get = window.location.href.substring(window.location.href.indexOf('?')+1);
    // Готовим и посылаем запрос
    query = "?query=" + query + "&" + get;
    console.log("Посылаем запрос: " + query);
    var o = new XMLHttpRequest();
    o.onreadystatechange = function() {
        if(o.readyState == 4) {
            if(o.status == 200) {
                console.log("Получен ответ от сервера:\n" + o.responseText);
                responseHandler(JSON.parse(o.responseText));
            }
            else {
                console.log("Ошибка при ожидании запроса:\nreadyState=" + o.readyState + "\nstatus=" + o.status + "\nТекст ошибки:\n" + o.responseText);
            }
        }
    };
    o.open("GET", query, true);
    o.send();
}

function responseHandler(data) {
    if(data.type == 'redirect') {
        window.location.href = data.content;
        return;
    }
    if(data.type == 'data') {
        switch(data.query) {
            case 'gamesList':
                gamesList(data.content);
                break;
            default: console.log("Ошибка при разборе ответа!\n" + data);
        }
    }
}