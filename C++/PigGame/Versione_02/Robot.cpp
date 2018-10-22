#include "Robot.hpp"
#include <cmath>

namespace robi {


Robot::Robot(std::string nome_arg)
    : Giocatore(nome_arg)
{
}


Robot::Robot(std::string nome_arg, Giocatore * const altro_arg)
    : Giocatore(nome_arg, altro_arg)
{
}


/*! Decide se proseguire nei tiri o 'intascare' il risultato.
 *  Criterio: intasca quando raggiunge:
 *            21 + round[(proprio punteggio - punteggio avversario) / 8]
 *            Se uno dei giocatori ha già totalizzato > 70, cerca di
 *            vincere (= intasca se punteggio totale > 100).
 */
int Robot::turno()
{
    int subtotale {};
    for(int simil_punti { getPunteggio() }, lancio { tiro() };
            simil_punti <= 100;
            lancio = tiro())
    {
        std::cout << "tiro: " << lancio << "; ";

        if(lancio == 1) {
            return 0;
        }

        simil_punti += lancio;
        subtotale += lancio;
        if(simil_punti > TRAGUARDO) {
            return subtotale;
        }

        if(simil_punti < 71 && getAltro()->getPunteggio() < 71) {
            // solo per la leggibilita' del codice:
            double tmp {
                21 + std::round(
                        static_cast<double>(simil_punti - getAltro()->getPunteggio())
                        / 8.0 )
            };
            if(subtotale > static_cast<int>(tmp)) {
                return subtotale;
            }
        }
    } // end for
    return subtotale; // ridondante?
}


// friend Robot
std::ostream & operator<<(std::ostream & os, const Robot & rhs)
{
    return ( os << rhs.nome << ": " << rhs.getPunteggio() );
}


} // end namespace robi
