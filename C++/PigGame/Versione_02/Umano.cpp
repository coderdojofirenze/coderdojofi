#include "Umano.hpp"

namespace robi {

Umano::Umano(std::string nome_arg)
    : Giocatore(nome_arg)
{
}


Umano::Umano(std::string nome_arg, Giocatore * const altro_arg)
    : Giocatore(nome_arg, altro_arg)
{
}


int Umano::turno()
{
    for(int subtotale {}, lancio { tiro() }; /**/; lancio = tiro() ) {
        std::cout << "E' uscito " << lancio;
        if(lancio == 1) {
            std::cout << '\n';
            return 0;
        }
        subtotale += lancio;
        std::cout << "\nIn questo turno " << subtotale
                  << "; nel complesso " << subtotale + getPunteggio()
                  << ". Il punteggio del tuo avversario e' "
                  << getAltro()->getPunteggio();
        if(getPunteggio() + subtotale > TRAGUARDO) {
            return subtotale;
        }
        std::cout << ". Intaschi o prosegui (i/p)? ";
        for(char risp {}; std::cin >> risp && risp != 'p'; /**/) {
            if(risp != 'i' && risp != 'p') {
                std::cout << "Ciccio, **o** Incassi **oppure** Prosegui!\nRiprova: ";
                continue;
            }
            if(risp == 'i') {
                return subtotale;
            }
        }
    }
}


// friend Robot
std::ostream & operator<<(std::ostream & os, const Umano & rhs)
{
    return ( os << rhs.nome << ": " << rhs.getPunteggio() );
}


} // end namespace robi
