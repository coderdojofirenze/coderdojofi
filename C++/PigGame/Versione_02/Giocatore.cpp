#include "Giocatore.hpp"
#include <iostream>

namespace robi {


std::mt19937 Giocatore::eng {
    static_cast<unsigned>(
        std::chrono::high_resolution_clock::now().time_since_epoch().count()
    ) };


Giocatore::Giocatore(std::string nome_arg)
    : nome { nome_arg },
      punteggio {},
      altro { nullptr }
{
}


Giocatore::Giocatore(std::string nome_arg, Giocatore * const altro_arg)
    : nome { nome_arg },
      punteggio {},
      altro { altro_arg }
{
}


void Giocatore::setAltro(Giocatore * const altro_arg)
{
    altro = altro_arg;
}


const Giocatore * Giocatore::getAltro() const
{
    return altro;
}


int Giocatore::getPunteggio() const
{
    return punteggio;
}


// void setPunteggio(int punteggio_arg)
// {
    // punteggio = punteggio_arg;
// }


bool Giocatore::gioca()
{
    int subtotale { turno() };
    std::cout << "In questo turno: " << subtotale << '\n';
    punteggio += subtotale;
    if(punteggio > TRAGUARDO) {
        return true;
    }
    return false;
}


/*! restituisce un intero da 1 a 6
 */
int Giocatore::tiro()
{
    std::uniform_int_distribution dst(1, 6);
    return dst(eng);
}


// friend Giocatore
std::ostream & operator<<(std::ostream & os, const Giocatore & rhs)
{
    return ( os << rhs.nome << ": " << rhs.punteggio );
}


 } // end namespace robi
