function gamesList(data) {
    var tbody = document.getElementById("gamesList").getElementsByTagName("tbody")[0];
    data.games.forEach(function(game)
    {
        var tr = document.createElement("tr");
        tr.style.backgroundColor = (game.type == 0) ? 'green' : 'white';
        for(var i = 0; i < 4; i++) {
            var td = document.createElement("td");
            td.innerHTML = (i < game.players.length) ? game.players[i] : '-';
            tr.appendChild(td);
        }
        tr.onclick = function() {
            window.location.href = "#gameId=" + game.id;
            query('game');
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

function gameStart(data) {
    var div = document.getElementById('gamesListDiv');
    div.style.display = "none";
    if(data.type == 0)
        gameCreate(data);
    else
        //div = document.getElementById('fieldDiv');
        gamePlay(data);
    //div.style.display = "block";
    /*var table = document.getElementById('field');
    for(var i = 0; i < data.field.length; i++) {
        var tr = table.getElementsByTagName("tr")[i];
        for(var j = 0; j < data.field[i].length; j++) {
            var td = tr.getElementsByTagName("td")[j];
            var img = document.createElement("img");
            img.width = 32;
            img.height = 32;
            img.src = "/images/" + data.field[i][j] + ".png";
            td.appendChild(img);
        }
    }*/
}

function query(query) {
    // Получаем GET-параметры
    var sign = window.location.href.indexOf('#');
    var get = '';
    if(sign != -1)
        get = window.location.href.substring(sign+1);
    // Готовим и посылаем запрос
    query = "?query=" + query;
    if(get != '')
        query += '&' + get;
    console.log("Посылаем запрос: " + query);
    var o = new XMLHttpRequest();
    o.onreadystatechange = function() {
        if(o.readyState == 4) {
            if(o.status == 200) {
                console.log("Получен ответ от сервера:\n" + o.responseText);
                if(o.responseText == 'None')
                    return;
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
            case 'game':
                gameStart(data.content);
                break;
            default: console.log("Ошибка при разборе ответа!\n" + data);
        }
    }
}

function gameCreate(game) {
    var div = document.getElementById('createGameDiv');
    var ul = document.getElementById('playersList');
    div.style.display = "block";
    game.players.forEach(function(player) {
        var li = document.createElement("li");
        li.innerHTML = player;
        ul.appendChild(li);
    });
    if(game.players.length > 1)
        div.getElementsByTagName('input')[0].disabled = false;
}