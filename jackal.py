# -*- coding: utf-8 -*-
__author__ = 'dimanoid'
import os
from google.appengine.ext.webapp import template
from google.appengine.ext import db, webapp
from google.appengine.api import users
from random import shuffle
import models
import json


def main(cl):
    """

    :param cl:
    """
    # Если пользователя нет в базе, добавим его
    players_query = models.Player.all()
    player = players_query.filter('account =', users.get_current_user()).get()
    if not player:
        player_new = models.Player()
        player_new.account = users.get_current_user()
        player_new.put()

    template_values = {
        "field_size": 13
    }
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    cl.response.out.write(template.render(path, template_values))


def createField():
    # Generate cards
    counts = [10, 10, 10, 10,
              3, 3, 3, 3, 3, 3, 3,
              2,
              5, 4, 2, 1,
              6, 3, 2, 2, 1, 4, 4,
              1, 2, 1,
              5, 5, 3, 2, 1]
    cards = []
    for type in range(0, len(counts)):
        for c in range(0, counts[type] + 1):
            cards.append(models.Card(type=type))
    shuffle(cards)
    field = []
    temp = 0
    for i in range(0, 13):
        row = []
        for j in range(0, 13):
            if ((i == 0 or i == 12) and 1 < j < 11) or ((j == 0 or j == 12) and 1 < i < 11):
                row.append(31)
            elif (0 <= i <= 1 or 11 <= i <= 12) and (0 <= j <= 1 or 11 <= j <= 12):
                row.append(32)
            else:
                row.append(cards[temp].type)
                temp += 1
        field.append(row)

    figures = []
    for i in range(0, 13):
        row = []
        for j in range(0, 13):
            row.append('')
        figures.append(row)
    figures[0][6] = 'ship_white pirate_white pirate_white pirate_white'
    figures[6][12] = 'ship_red pirate_red pirate_red pirate_red'
    figures[12][6] = 'ship_black pirate_black pirate_black pirate_black'
    figures[6][0] = 'ship_yellow pirate_yellow pirate_yellow pirate_yellow'

    return field, figures


def query(q):
    """Обработчик запросов клиентов.
    """
    answer = {}
    answer['query'] = q
    answer['type'] = ''
    answer['content'] = {}
    if q == 'gamesList':
        answer['type'] = 'data'
        content = {}
        content['games'] = []
        games_query = models.PlayerGame.gql('WHERE player=:1', users.get_current_user())
        for game in games_query.run():
            game_new = {}
            game_new['id'] = models.Game.gql('WHERE __key__=:1', db.Key(game.game)).get().key().id().__str__()
            game_new['players'] = []
            players_query = models.PlayerGame.gql('WHERE game=:1', game.game)
            for player in players_query.run():
                game_new['players'].append(player.player.nickname().__str__())
            content['games'].append(game_new)
        answer['content'] = content
        return json.JSONEncoder().encode(answer)
    elif q == 'createGame':
        field, figures = createField()
        game = models.Game()
        game.field, game.figures = field.__str__(), figures.__str__()
        game.put()
        player_game = models.PlayerGame()
        player_game.player = users.get_current_user()
        player_game.game = game.key().__str__()
        player_game.put()
        return [query('field'), query('figures')]
    elif q == 'field':
        player_game = models.PlayerGame().gql('WHERE player=:1', users.get_current_user()).get()
        game = models.Game().gql('WHERE __key__=:1', db.Key(player_game.game)).get()
        return game.field
    elif q == 'figures':
        player_game = models.PlayerGame().gql('WHERE player=:1', users.get_current_user()).get()
        game = models.Game().gql('WHERE __key__=:1', db.Key(player_game.game)).get()
        return game.figures
    else:
        return None
