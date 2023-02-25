#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  classiBase.py
#
#  Copyright 2023 giacomo <gmx@Vega>
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


class gameMap:

    #map: array bidimensionale dei luoghi posizionati sulla mappa

    def __init__(self,max_x,max_y):
        self.map = [[None]*max_x for i in range(max_y)]
        #TODO: altro da fare?


    def setCell(self,x,y,c_type):
        """
        imposta una cella della mappa
        x(int): ascissa della cella
        y(int): ordinata della cella
        c_type(obj): oggetto di tipo luogo - che si suppone già inizializzato

        nessun valore di ritorno - per ora
        """

        self.map[x][y] = c_type.copy()
        #TODO: impostazioni succesive del luogo


    def getCell(self,x,y):
        """
        Restituisce il luogo indicato alle coordinate
        """
        return self.map[x][y]


class mapObject:

    #name (str): nome univoco del personaggio
    #description (str): descrizione estesa
    #pos (int,int): posizione sulla mappa


    def __init__(self,name,desc):
        """
        costruttore per oggetto generico

        name (str): nome dell'oggetto - non
        desc (str): descrizione dell'oggetto
        """
        self.name = name
        if desc != "":
            self.description = desc


    def getName(self):
        """
        restituisce nome
        """
        return self.name


    def getDesc(self):
        """
        restituisce la descrizione
        """
        return self.description


    def setDesc(self,desc):
        """
        imposta la descrizione dell'oggetto in un secondo momento

        desc(str): descrizione testuale
        """
        if desc != "":
            self.description = desc
        return self.getDesc()


    def getPos(self):
        """
        restituisce la posizione
        """
        return [self.x,self.y]


    def setPos(self,x,y):
        """
        imposta posizione sulla mappa

        x,y (int): nuove coordinate

        restituisce:
        (int,int): posizione aggiornata


        N.B: al momento impossibile giudicare se dentro ai confini della mappaù
        (a meno di non passare un oggetto map...)
        """

        if x > 0:
            self.x = x
        if y > 0:
            self.y = y
        return self.getPos()


class room(mapObject):
    #bonusmalus: effetti sul giocatore

    def __init__(self,name,description):
        mapObject.__init__(self,name,description)
        self.bonusmalus = 0


    def setBM(self,value):
        self.bonusmalus = value
        return self.get_BM()


    def getBM(self):
        return self.bonusmalus


    def foo(self,pippo):
        print(pippo)



class character(mapObject):

    #in aggiunta a mapObject:
    #strenght (int): forza del personaggio - per ora 1 per tutti
    #damage (int): entità del danno in punti-vita  - per ora 1 per tutti
    #inventory (list): lista oggetti detenuta dal personaggio


    # costruttore
    def __init__(self):
        """
        costruttore - per ora posizionamento sulla mappa

        posx,posy (int): coordinate della casella
        """

        #TODO: ctrl valori accettabili (dentro la mappa)
        # posiziona il personaggio alla casella posx,posy
        self.pos = [posx,posy]

        # cosa altro fare?
        self.strenght = 1 # varierà in base al personaggio?
        self.damage = 1 # varierà in base al personaggio?
        self.inventory = []


    def setThings(th_list):
        """
        assegna oggetti al personaggio

        thList (array:things)
        """
        if len(th_list) == 0:
            #TODO: log errore?
            return False
        else:
            #TODO: 'and' su tutti gli elementi
            ok = [isinstance(th,thing) for th in th_list]


    #TODO: altri metodi (assegna danno all'eroe, accumula danno dall'eroe, vendi oggetto all'eroe)

class thing(mapObject):

    #in aggiunta:
    #cost (int): costo se acquistato - per ora 1 per tutti
    #health (int): variazione punti-vita  - per ora 1 per tutti
    #obj_list (list): lista oggetti detenuta dal personaggio


    def __init__(self,name,desc):
        """
        costruttore per oggetto generico

        name (str): nome dell'oggetto - non
        desc (str): descrizione dell'oggetto
        """
        self.name = name
        if desc != "":
            self.description = desc


    def setAttr(self,desc,cost,hlt):
        """
        imposta uno o più parametri caratteristici dell'oggetto
        desc (str):
        cost (int):
        hlt (int):

        restituisce:
            (int/str): nuova gamma valori impostata
        """
        if description != "":
            self.description = description
        if cost > 0:
            self.cost = cost
        if dmg > 0:
            self.damage = damage
        if hlt > 0:
            self.health = hlt

        ret = {
            "desc": self.description
            ,"cost": self.cost
            ,"dmg": self.damage
            ,"hlt": self.healt
        }
        return ret.copy


    def getCost(self):
        """
        costo dell'oggetto - se in vendita presso un mercante
        """
        return self.cost


    def getDamage(self):
        """
        capacità di danno se usato
        """
        return self.damage


    def getHealth(self):
        """
        capacità di cura se usato
        """
        return self.health


def main(args):
    return 0

if __name__ == '__main__':
    import sys
    #TODO: unit-test per verificare classi e metodi?
    sys.exit(main(sys.argv))
