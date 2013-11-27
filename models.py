# -*- coding: utf-8 -*-
__author__ = 'dimanoid'
from random import randint
from google.appengine.ext import db
import json


class Player(db.Model):
    account = db.UserProperty()


class PlayerGame(db.Model):
    player = db.UserProperty()
    game = db.StringProperty()


class Game(db.Model):
    field = db.TextProperty()
    figures = db.TextProperty()


class Card(object):
    type = 0
    angle = 0
    ways = [0, 1, 2, 3, 4, 5, 6, 7]

    def __init__(self, type):
        """ type - тип клетки:
                0-3 - пустая
                4 - стрелка к ребру
                5 - стрелка к двум противоположным ребрам
                6 - стрелка ко всем ребрам
                7 - стрелка к углу
                8 - стрелка к двум противоположным углам
                9 - стрелка во все углы
                10 - стрелка к двум ребрам и углу
                11 - лошади
                12 - джунгли (2)
                13 - пустыня (3)
                14 - болото (4)
                15 - горы (5)
                16 - лед
                17 - капкан
                18 - пушка
                19 - крепость
                20 - крепости с аборигенкой
                21 - ром
                22 - крокодил
                23 - людоед
                24 - воздушный шар
                25 - самолет
                26 - сундук (1)
                27 - сундук (2)
                28 - сундук (3)
                29 - сундук (4)
                30 - сундук (5)
                31 - вода
                32 - ничего"""
        self.type = type
        self.angle = randint(0, 3)

    def action(self, pirate):
        pass