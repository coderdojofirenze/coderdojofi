#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  step_1.py
#  
#  Copyright 2018 Giacomo <gmx@vega>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

import pygame


class GameBall:

    def __init__(self,img):
        self.speed = [0,0]
        self.bitmap = pygame.image.load(img)
        self.bitmap.set_colorkey((0,0,0))

    def reset(self):
        self.x = 11
        self.y = 43
        self.speed = [0,0]

    def start(self):
        self.speed = [1,1]

    def addX(self,val):
        new_x = self.x + val
        if new_x < 640 and new_x > 0:
            self.x += val
        else:
            if new_x < 0:
                diff = abs(new_x)
                self.x = diff
            else:
                diff = new_x - 629
                self.x = 629 - diff
            self.setSpeedX(-self.speedX())

    def addY(self,val):
        new_y = self.y + val
        if new_y <= 466 and new_y >= 42:
            self.y += val
        else:
            if new_y < 42:
                diff = 42 - new_y
                self.y = 42 + diff
            else:
                diff = new_y - 466
                self.y = 466 - diff
            self.setSpeedY(-self.speedY())

    def makeStep(self):
        self.addX(self.speed[0])
        self.addY(self.speed[1])
        
    def setSpeedX(self,val):
        if abs(val) < 3:
            self.speed[0] = val

    def speedX(self):
        return self.speed[0]

    def setSpeedY(self,val):
        if abs(val) < 3:
            self.speed[1] = val

    def speedY(self):
        return self.speed[1]

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def render(self,screen):
        self.makeStep()
        screen.blit(self.bitmap,(self.x, self.y))


def main(args):

    pygame.init()
    screen = pygame.display.set_mode((640,480))
    pygame.key.set_repeat(1,1)
    pygame.display.set_caption("python pong")
    backdrop = pygame.image.load('img/pong_a_2.bmp')

    ball = GameBall("img/ball_base.png")
    ball.reset()
    ball.start()

    quit = 0

    while quit == 0:
        screen.blit(backdrop,(0,0))

        for ourevent in pygame.event.get():

            if ourevent.type == pygame.QUIT:
                quit = 1

            if ourevent.type == pygame.KEYDOWN:
                if ourevent.key == pygame.K_ESCAPE:
                    #TODO: qualcosa di più "mosso"
                    quit = 1

        if ball.getX() <= 1:
            #TODO: gestione palla persa da player1
            ball.setSpeedX(-ball.speedX())

        if ball.getX() >= 629:
            #TODO: gestione palla persa da player2
            ball.setSpeedX(-ball.speedX())

        ball.render(screen)
        pygame.display.update()
        pygame.time.delay(2)

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
