#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import sys,json,copy
from random import seed,randint

#from os.path import realpath
#sys.path.append(realpath(".")) # librerie del programma

from classiBase import gameMap,mapObject,room,character,thing
from main import game

if False:
    # codice incorporato nella classe

    # lettura personaggi
    with open('chars.json','r') as fp:
        riga = fp.read()
        cod_p = str("").join([riga])

    elements = json.loads(cod_p)

    #oggetti = elements["things"]
    oggetti = {}
    for obj in elements["things"]:
        oggetto = thing(
            name=elements["things"][obj]["name"]
            ,desc=elements["things"][obj]["description"]
        )
        oggetto.setDamage(elements["things"][obj]["damage"])
        oggetto.setCost(elements["things"][obj]["damage"])
        oggetti[elements["things"][obj]["name"]] = copy.deepcopy(oggetto)

    #personaggi = elements["characters"]
    personaggi = {}
    for singlech in elements["characters"]:
        #debug
        #print("{} - {}".format(elements["characters"][singlech]["name"],elements["characters"][singlech]["description"]))
        personaggio = character(
            name=elements["characters"][singlech]["name"]
            ,desc=elements["characters"][singlech]["description"]
        )
        personaggio.setStrenght(elements["characters"][singlech]["strenght"])
        personaggio.setDamage(elements["characters"][singlech]["damage"])

        if "inventory" in elements["characters"][singlech] \
            and len(elements["characters"][singlech]["inventory"]) > 0:
            p_oggetti = elements["characters"][singlech]["inventory"]
            inventario = {}
            for oggetto in elements["characters"][singlech]["inventory"]:
                inventario[oggetto] = copy.deepcopy(oggetti[oggetto])
                #{
                #    "description": p_oggetti[oggetto]["description"]
                #    ,"damage": p_oggetti[oggetto]["damage"]
                #    ,"cost": p_oggetti[oggetto]["cost"]
                #}
            #debug
            #print("Oggetti del personaggio {}: {}".format(singlech,inventario))

            personaggio.setThings(inventario)

        personaggi[elements["characters"][singlech]["name"]] = copy.deepcopy(personaggio)
        
    #debug
    #print("Lista personaggi: {}\n\nLista oggetti: {}\n".format(personaggi,oggetti))
    #sys.exit()


    # lettura mappa
    with open('map.json','r') as fp:
        riga = fp.read()
        cod_m = str("").join([riga])

    luoghi = json.loads(cod_m)

    mappa = gameMap(luoghi["maxdim"][0],luoghi["maxdim"][1])
    for stanza in luoghi["map"]:
        nuova = room(stanza["name"],stanza["description"])
        nuova.setBM(stanza["bonusmalus"])
        #TODO: assegna personaggi e cose al luogo

        pers_stanza = []
        for ch in stanza["cluster"]:
            pers_stanza.append(personaggi[ch])
        nuova.cluster = copy.deepcopy(pers_stanza)

        oggetti_stanza = []
        for th in stanza["inventory"]:
            oggetti_stanza.append(oggetti[th])
        nuova.inventory = copy.deepcopy(oggetti_stanza)

        mappa.setCell(stanza["pos"][0],stanza["pos"][1],nuova)
        
    # posizionamento dell'eroe
    if "start" in luoghi:
        #posiziona
        mappa.setPosHero(luoghi["start"][0],luoghi["start"][1])
    else:
        seed()
        x,y = randint(0,mappa.max_x),randint(0,mappa.max_y)
        while(mappa.getcell(x,y) == False):
            x,y = randint(0,mappa.max_x),randint(0,mappa.max_y)
        mappa.setPosHero(x,y)

gioco = game('chars.json','map.json')

#debug
#print("Mappa del gioco:\n")
#mappa.printMap()




sys.exit()
