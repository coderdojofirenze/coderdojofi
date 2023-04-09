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

import os,json
from random import seed,randint
from copy import deepcopy
from functools import reduce


# ============================================================================
# =====                                                                  =====
# =====                          gameMap                                 =====
# =====                                                                  =====
# ============================================================================
class gameMap:

    #map: array bidimensionale dei luoghi posizionati sulla mappa
    def __init__(self,cod_p,cod_m):
        """
        costruttore - inizializzazione del gioco
        (qui il codice di testJson.py)
        # TODO: spostare lettura files fuori, su main.py (classe game)

        cod_p (str): oggetto JSON di descrizione personaggi e oggetti
        cod_m (str): oggetto JSON di descrizione luoghi
        
        """
        self.map_x = 0
        self.map_y = 0
        self.map = []
        self.current = [0,0]

        # interpretazione personaggi e oggetti
        self.loadThings(cod_p)
        self.loadChars(cod_p)

        # interpretazione mappa
        if "maxdim" in cod_m and len(cod_m["maxdim"]) == 2:
            self.mapDim(cod_m["maxdim"][0],cod_m["maxdim"][1])
        else:
            # di default mappa 10x10 (e pace)
            self.mapDim(10,10)
        self.loadRooms(cod_m)

        # posizionamento dell'eroe
        if "start" in cod_m:
            #posiziona
            self.setPosHero(cod_m["start"][0],cod_m["start"][1])
        else:
            seed()
            x,y = randint(0,self.max_x),randint(0,self.max_y)
            while(self.getcell(x,y) == False):
                x,y = randint(0,self.max_x),randint(0,self.max_y)
            self.setPosHero(x,y)

        #TODO: eliminare appena pronti
        #print("gameMap.mapDim - struttura mappa:")
        #self.printMap()

        #TODO: verifica se serve altro
        #TODO: CICLO GIOCO


    def mapDim(self,max_x,max_y):
        """
        dimensionamento della mappa

        max_x (int), max_y(int): limiti verticale e orizzontale
        """
        if int(max_x) > 0:
            self.map_x = int(max_x)
        else:
            # ci vuole una dimensione, al limite 1...
            return False
        if int(max_y) > 0:
            self.map_y = int(max_y)
        else:
            # ci vuole una dimensione, al limite 1...
            return False

        self.map = [[None]*self.map_x for i in range(self.map_y)]
        return self.map_x,self.map_y


    def loadThings(self,elements):
        """
        caricamento oggetti

        json_obj (str): oggetto JSON con le definizioni

        TODO: restituire errore in caso di problemi
        """
        obj_dict = {}
        for obj in elements["things"]:
            obj_single = thing(
                name = elements["things"][obj]["name"]
                ,desc = elements["things"][obj]["description"]
            )
            obj_single.setDamage(elements["things"][obj]["damage"])
            obj_single.setCost(elements["things"][obj]["damage"])
            obj_dict[elements["things"][obj]["name"]] = deepcopy(obj_single)
        self.things = obj_dict


    def getThing(name):
        """
        restituisce l'oggetto con il nome indicato - False se non è previsto
        name(str): nome dell'oggetto richiesto
        """
        if name in self.things:
            return self.things[name]
        else:
            return False
            

    def loadChars(self,elements):
        """
        carica personaggi

        json_ch (str): oggetto JSON con le definizioni

        TODO: restituire errore in caso di problemi
        """
        #char_list = elements["characters"]
        char_list = {}
        for singlech in elements["characters"]:
            #debug
            #print("{} - {}".format(elements["characters"][singlech]["name"],elements["characters"][singlech]["description"]))
            char_obj = character(
                name = elements["characters"][singlech]["name"]
                ,desc = elements["characters"][singlech]["description"]
            )
            char_obj.setStrenght(elements["characters"][singlech]["strenght"])
            char_obj.setDamage(elements["characters"][singlech]["damage"])

            if "inventory" in elements["characters"][singlech] \
                and len(elements["characters"][singlech]["inventory"]) > 0:
                p_oggetti = elements["characters"][singlech]["inventory"]
                inventario = {}
                for oggetto in elements["characters"][singlech]["inventory"]:
                    inventario[oggetto] = deepcopy(self.things[oggetto])
                char_obj.setThings(inventario)

            char_list[elements["characters"][singlech]["name"]] = deepcopy(char_obj)
        self.characters = char_list


    def getChar(name):
        """
        restituisce il personaggio con il nome indicato - False se non è previsto
        name(str): nome dell'oggetto richiesto
        """
        if name in self.characters:
            return self.characters[name]
        else:
            return False
            

    def loadRooms(self,luoghi):
        for stanza in luoghi["map"]:
            nuova = room(stanza["name"],stanza["description"])
            nuova.setBM(stanza["bonusmalus"])
            #TODO: assegna self.characters e cose al luogo

            pers_stanza = []
            for ch in stanza["cluster"]:
                pers_stanza.append(self.characters[ch])
            nuova.cluster = deepcopy(pers_stanza)

            things_stanza = []
            for th in stanza["inventory"]:
                things_stanza.append(self.things[th])
            nuova.inventory = deepcopy(things_stanza)

            self.setCell(stanza["pos"][0],stanza["pos"][1],nuova)


    def setCell(self,x,y,c_type):
        """
        imposta una cella della mappa
        x(int): ascissa della cella
        y(int): ordinata della cella
        c_type(obj): oggetto di tipo luogo - che si suppone già inizializzato

        nessun valore di ritorno - per ora
        """
        if x > self.map_x:
            #TODO: log
            print("gameMap.setCell() - Posizione x fuori dai limiti: {} > {}".format(x,self.map_x))
            return False
        if y > self.map_y:
            #TODO: log
            print("gameMap.setCell() - Posizione y fuori dai limiti: {} > {}".format(y,self.map_y))
            return False

        self.map[x][y] = c_type
        #TODO: impostazioni succesive del luogo


    def getCell(self,x,y):
        """
        Restituisce il luogo indicato alle coordinate
        """
        if self.map[x][y] == None:
            return False
        return self.map[x][y]


    def cellDirs(self,x,y):
        """
        Restituisce le direzioni possibili dalla cella indicata tramite coordinate
        ([str])
        """
        out = []
        if x < 0 or x >= self.map_x:
            return False
        if y < 0 or y >= self.map_y:
            return False
        if self.map[x][y] == None:
            return False

        for tx in range(-1,3,2):
            if self.map[x+tx][y] != None:
                if tx < 0:
                    out.append("e")
                else:
                    out.append("o")

        for ty in range(-1,3,2):
            if self.map[x][y+ty] != None:
                if ty < 0:
                    out.append("s")
                else:
                    out.append("n")

        return out


    def setPosHero(self,x,y):
        """
        riposiziona l'eroe sulla mappa
        """
        if self.getCell(x,y) != False:
            self.current = [x,y]
            return self.getPosHero()
        else:
            return False


    def getPosHero(self):
        """
        restituisce la posizione [x,y] dell'eroe sulla mappa
        """
        return deepcopy(self.current)


    def getDirections(self):
        """
        in base alla posizione segnala le possibili direzioni (uscite dalla cella)
        """
        pass


    def getHeroCell(self):
        """
        restituisce l'attuale luogo dell'eroe
        """
        return self.getCell(self.current[0],self.current[1])


    # solo per debug
    def printMap(self):
        for x in range(0,self.map_x):
            for y in range(0,self.map_y):
                if self.getCell(x,y) == False:
                    desc_tot = "Cella vuota"
                else:
                    characters = []
                    things = []
                    desc = self.getCell(x,y).getDesc()
                    for singlech in self.getCell(x,y).getCluster():
                        characters.append(singlech.getDesc())

                    for singleth in self.getCell(x,y).getInventory():
                        things.append(singleth.getDesc())

                    desc_tot = str("\n").join([desc,str("\n").join(characters),str("\n").join(things)])
                print("({},{}): {}\n".format(x,y,desc_tot))
        return True


# ============================================================================
# =====                                                                  =====
# =====                          MapObject                               =====
# =====                                                                  =====
# ============================================================================
class mapObject:

    #name (str): nome univoco del personaggio
    #description (str): descrizione estesa
    #pos (int,int): posizione sulla mappa


    def __init__(self,name,desc="",x=0,y=0):
        """
        costruttore per oggetto generico

        name (str): nome dell'oggetto - non
        desc (str): descrizione dell'oggetto
        """
        self.name = name
        if desc != "":
            self.description = desc
        self.x = x
        self.y = y


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
        return [int(self.x),int(self.y)]

    
    def setPos(self,x,y):
        """
        imposta posizione sulla mappa

        x,y (int): nuove coordinate

        restituisce:
        (int,int): posizione aggiornata

        N.B: al momento impossibile giudicare se dentro ai confini della mappa
        (a meno di non passare un oggetto map...)
        """

        if int(x) >= 0:
            self.x = int(x)
        if int(y) > 0:
            self.y = int(y)
        return self.getPos()


    def descObj(self):
        """
        restituisce nome e descrizione dell'oggetto ben formattati
        """
        return str(": ").join([self.name,self.description])



# ============================================================================
# =====                                                                  =====
# =====                             Room                                 =====
# =====                                                                  =====
# ============================================================================
class room(mapObject):
    #bonusmalus: effetti sul giocatore

    def __init__(self,name,desc):
        mapObject.__init__(self,name,desc)
        self.bonusmalus = 0


    def setBM(self,value):
        self.bonusmalus = value
        return self.getBM()


    def getBM(self):
        return self.bonusmalus


    def getCluster(self):
        return self.cluster


    def getInventory(self):
        return self.inventory


    def descRoom(self):
        """
        restituisce descrizione di personaggi e oggetti nella stanza
        {"desc": str, "chars": str, "things": str}
        """

        chars_desc = []
        for singlech in self.getCluster():
            chars_desc.append(singlech.descObj())

        things_desc = []
        for singleth in self.getInventory():
            things_desc.append(singleth.descObj())

        out = {"desc": self.description
            ,"chars": str("\n").join(chars_desc)
            ,"things": str("\n").join(things_desc)}

        return out


# ============================================================================
# =====                                                                  =====
# =====                             Character                            =====
# =====                                                                  =====
# ============================================================================
class character(mapObject):

    #in aggiunta a mapObject:
    #strenght (int): forza del personaggio - per ora 1 per tutti
    #damage (int): entità del danno in punti-vita  - per ora 1 per tutti
    #inventory (list): lista oggetti detenuta dal personaggio


    # costruttore
    def __init__(self,name,desc):
        """
        costruttore

        name (str): nome del personaggio
        desc (str): descrizione del personaggio
        """

        super().__init__(name,desc)


        # cosa altro fare?
        self.strenght = 1 # varierà in base al personaggio?
        self.damage = 1 # varierà in base al personaggio?
        self.inventory = []


    def Inventory(self):
        """
        restituisce la lista oggetti posseduta
        """
        #TODO: ispirati a test_json
        return self.inventory


    def setThings(self,th_list):
        """
        assegna oggetti al personaggio

        thList (array:things)
        """
        if len(th_list) == 0:
            #TODO: log errore?
            return False
        else:
            #TODO: 'and' su tutti gli elementi
            ok_list = [isinstance(th,thing) for th in th_list]
            ok = reduce(lambda x,y:x and y,ok_list,True)
            if ok:
                self.inventory = deepcopy(th_list)


    def addThing(self,th):
        """
        aggiunge un oggetto all'inventario

        th(thing): oggetto da aggiungere

        restituisce:
            (array): inventario come lista oggetti 
        """
        #TODO
        if isinstance(th,thing):
            self.inventory.append(th)
            return self.inventory


    def subThing(self,tname):
        """
        estrae un oggetto dall'inventario

        tname (str): nome dell'oggetto

        restituisce:
            (thing): oggetto estratto
        """
        #TODO: occhio, occorre cercare in lista
        pass


    def setStrenght(self,sth):
        """
        imposta forza del personaggio

        sth (int): valore della forza

        Restituisce:
            (int) forza attuale
        """
        #TODO: ctrl valore
        self.strenght = sth
        return self.getStrenght()


    def getStrenght(self):
        """
        restituisce capacità danno del personaggio (int)
        """
        return self.strenght

    #TODO: altri metodi (assegna danno all'eroe, accumula danno dall'eroe, vendi oggetto all'eroe)


    def setDamage(self,dmg):
        """
        imposta capacità danno del personaggio

        dmg (int): valore della forza

        Restituisce:
            (int) forza attuale
        """
        #TODO: ctrl valore
        self.damage = dmg
        return self.getDamage()


    def getDamage(self):
        """
        restituisce forza del personaggio (int)
        """
        return self.damage


    def descChar(self):
        """
        restituisce nome e descrizione del personaggio ben formattati
        """
        
        return str(": ").join([self.name,self.description])

    #TODO: altri metodi (assegna danno all'eroe, accumula danno dall'eroe, vendi oggetto all'eroe)
    

# ============================================================================
# =====                                                                  =====
# =====                              Thing                               =====
# =====                                                                  =====
# ============================================================================
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


    def getCost(self):
        """
        costo dell'oggetto - se in vendita presso un mercante
        """
        return self.cost


    def setCost(self,cost):
        """
        setta costo dell'oggetto - se in vendita presso un mercante
        """
        self.cost = cost
        return self.cost


    def getDamage(self):
        """
        capacità di danno/cura se usato
        """
        return self.damage


    def setDamage(self,dmg):
        """
        setta capacità di danno/cura se usato
        """
        self.damage = dmg
        return self.damage


def main(args):
    return 0


if __name__ == '__main__':
    import sys
    #TODO: unit-test per verificare classi e metodi?
    sys.exit(main(sys.argv))
