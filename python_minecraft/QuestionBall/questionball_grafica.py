#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  questionball.py
#
#  Copyright 2019 giacomo <gmx@vega>
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
from random import seed,randint,randrange,shuffle


class Ball:

    def __init__(self,filename):
        self.x = 520
        self.y = 0
        self.bitmap = pygame.image.load(filename)
        self.bitmap.set_colorkey((0,0,0))

    def set_position(self, xpos, ypos):
        self.x = xpos
        self.y = ypos

    def render(self,screen):
        screen.blit(self.bitmap,(self.x, self.y))

    def reset(self):
        self.y = 0

    def bang(self,filename):
        self.bitmap = pygame.image.load(filename)
        self.bitmap.set_colorkey((0,0,0))


class Question:

    def __init__(self,screen):
        self.question = ""
        self.answer = 0
        self.choice = [0,0,0]
        self.font = pygame.font.Font('gfx/Oxygen-Sans-Bold.ttf',20)
        self.screen = screen
        self.newQuest()

    def newQuest(self):
        # generazione della nuova domanda (moltiplicazione)
        facts = [randint(2,10),randint(2,10)]
        while (facts[0] * facts[1]) == self.answer:
            facts = [randint(2,10),randint(2,10)]
        self.question = "Quanto fa {} per {}?".format(facts[0],facts[1])
        swapper = [randrange(-1,2,2),randrange(-1,2,2)]
        self.answer = facts[0] * facts[1]
        self.choice = [self.answer
            ,self.answer+(facts[0]*swapper[0])
            ,self.answer+(facts[1]*swapper[1])]
        shuffle(self.choice)

    def getQuestText(self):
        if self.question == "":
            self.newQuest()
        return self.question

    def getOptions(self):
        if self.question == "":
            self.newQuest()
        return "[1]: {} - [2]: {} - [3]: {}".format(self.choice[0],self.choice[1],self.choice[2])

    def printMsg(self,msg,posx,posy):
        if msg == "" or posx < 0 or posy < 0:
            return False
        msg_text = self.font.render(msg,True,(255,255,255))
        msg_rect = msg_text.get_rect()
        msg_rect.centerx = posx
        msg_rect.y = posy
        self.screen.blit(msg_text,msg_rect)
        pygame.display.update(msg_rect)

    def getChoiceVal(self,btn):
        if btn in range(1,4):
            return choice[(btn-1)]
        else:
            return False

    def getAnswer(self):
        return self.answer

    def check(self,ans):
        if ans not in range(1,4):
            return False
        if self.choice[(ans-1)] == self.answer:
            return True
        else:
            return False


def main(args):

    # inizializzazione num. pseuodcasuali
    seed()

    pygame.init()
    screen = pygame.display.set_mode((640,480))
    pygame.key.set_repeat(1,1)
    pygame.display.set_caption("question ball")
    backdrop = pygame.image.load('gfx/backdrop.png')
    player = Ball("gfx/intro_ball.png")

    #TODO: impostare quesito e risposta in finestra
    qst = Question(screen)

    responses = 0
    quit = 0
    delay = 50 # passo std tra fotogrammi

    while quit == 0:
        screen.blit(backdrop, (0, 0))
        #screen.fill((0,0,0))
        msg = qst.getQuestText()
        qst.printMsg(msg,260,5) # da ripetere ad ogni passo
        msg = qst.getOptions()
        qst.printMsg(msg,260,25) # da ripetere ad ogni passo

        if player.y <= 319:
            for ourevent in pygame.event.get():
                if ourevent.type == pygame.QUIT or (ourevent.type == pygame.KEYDOWN and ourevent.key == pygame.K_q):
                    quit = 1

                if ourevent.type == pygame.KEYDOWN:
                    ans_list = {
                        pygame.K_1: 1
                        ,pygame.K_2: 2
                        ,pygame.K_3: 3
                    }
                    if ourevent.key in ans_list:
                        delay = 2000 # attesa per messaggi a schermo
                        if qst.check(ans_list[ourevent.key]) == True:
                            # indovinato - ferma tempo
                            qst.printMsg("Indovinato",260,55)
                            responses += 1
                            quit = 2 # in realtà serve segnalibro per innescare azzeramento tempo e nuova domanda
                        else:
                            # errore
                            msg = "Errore - la risposta era {}".format(qst.getAnswer())
                            qst.printMsg(msg,260,55)
                            quit = 1
            player.y +=2
        else:
            player.bang("gfx/bang.png");
            msg = "Tempo scaduto!"
            qst.printMsg(msg,260,55)
            quit = 1

        player.render(screen)
        pygame.display.update()
        pygame.time.delay(delay)
        if delay != 50:
            delay = 50

        if quit == 2:
            # msg congratulazioni, nuovo quesito e azzeramento tempo
            qst.newQuest()
            msg = qst.getQuestText()
            qst.printMsg(msg,260,5)
            player.y = 0
            quit = 0

    if responses > 0:
        if responses > 1:
            lastchar = "e"
        else:
            lastchar = "a"
        msg = "hai risposto esattamente a {} domand{}".format(responses,lastchar)
        qst.printMsg(msg,260,105)
        pygame.time.delay(3000)
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
