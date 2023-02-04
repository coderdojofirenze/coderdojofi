#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

f_out = open('chars.json')
with open('chars.json','r') as fp:
	riga = fp.read()
	codice = str("").join([riga])

totale = json.loads(codice)
print("{}".format(totale))
