# codice per i personaggi

class character:

    #strenght (int): forza del personaggio - per ora 1 per tutti
    #damage (int): entità del danno in punti-vita  - per ora 1 per tutti
    #objs (list): lista oggetti detenuta dal personaggio
    #pos (list): posizione sulla mappa


    # costruttore
    def __init__(self,posx,posy):
        """
        costruttore - per ora posizionamento sulla mappa

        posx,posy (int): coordinate della casella
        """

        #TODO: ctrl valori accettabili (dentro la mappa)
        # posiziona il personaggio alla casella posx,posy
        self.pos = [posx,posy]
        # cosa altro fare?


    # interazione con l'eroe
    def interact(self,hero):
        """
        interact() - interazione con l'eroe (passato come argomento)

        hero (obj): oggetto Eroe

        ritorna:
            esito dell'interazione (da stabilire)
        """
        return True


    def inventory(self):
        """
        lista oggetti posseduti dal personaggio

        restituisce:
            (list): lista oggetti come stringhe
            False: in caso di problemi
        """

        objlist = []
        for obj in self.objs:
            objlist.append(str("").join([obj.name," - ",obj.desc," - ",obj.val])

        return objlist


class dragon(character):

    def init(self,dragontype,posx,posy,things):
        """
        costruttore

        dragontype(dict(,int)): tipo di drago
        """

        character.__init__(posx,posy,things)


class merchant(character):

    def __init__(self,,posx,posy,things):
        """
        costruttore - classe Mercante derivata dal carattere generico

        posx,posy (int): coordinate della casella
        things (list [element,int]): lista oggetti in vendita con il loro prezzo
        """

        character.__init__(posx,posy)
        self.shop = []
        for elem in things:
            self.shop.append({"obj": elem[0],"value": elem[1]})


    def showShop(self):
        """
        showShop() - presenta la mercanzia
        TODO
        """
        # idea di base: lista degli oggetti in objs con relativi prezzi
        out = []
        for elem in self.shop:
            out.append(elem)

