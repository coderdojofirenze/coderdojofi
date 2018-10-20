// Istruzioni compilazione:
// g++ -std=gnu++17 -Wall -Wextra -pedantic-errors "piggame.cpp" -o "piggame.exe"

// Each turn, a player repeatedly rolls a die until either a 1 is rolled or
// the player decides to "hold":
// If the player rolls a 1, they score nothing and it becomes the next player's turn.
// If the player rolls any other number, it is added to their turn total and
// the player's turn continues.
// If a player chooses to "hold", their turn total is added to their score, and
// it becomes the next player's turn.
// The first player to score 100 or more points wins.
// For example, the first player, Anne, begins a turn with a roll of 5.
// Anne could hold and score 5 points, but chooses to roll again.
// Anne rolls a 2, and could hold with a turn total of 7 points, but chooses to
// roll again.
// Anne rolls a 1, and must end her turn without scoring.
// The next player, Bob, rolls the sequence 4-5-3-5-5, after which he chooses
// to hold, and adds his turn total of 22 points to his score.
#include <chrono>
#include <iostream>
#include <memory>
#include <random>
#include <string>

class Giocatore {
public:
    std::string nome;
    Giocatore() = default;
    Giocatore(std::string nome_arg);
    Giocatore(std::string nome_arg, Giocatore * const altro_arg);
    void setAltro(Giocatore * const altro_arg);

    bool gioca();
    bool turno();
    int tiro();
private:
    const int TRAGUARDO { 100 };
    static std::mt19937 eng;
    int punteggio {};
    Giocatore * altro { nullptr };
// friend:
    friend std::ostream & operator<<(std::ostream & os, const Giocatore & rhs);
};


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


bool Giocatore::gioca()
{
    while(!turno()) {
        if(altro->turno()) {
            std::cout << *this << '\n' << *altro << '\n';
            return false;
        } else {
            std::cout << *this << '\n' << *altro << '\n';
        }
    }
    std::cout << *this << '\n' << *altro << '\n';
    return true;
}


bool Giocatore::turno()
{
    std::uniform_int_distribution<> dst(1, 4);
    int subtotale {};
    std::cout << nome << " --> ";
    for(int hold {}; hold != 1; hold = dst(eng)) { // il 25% delle volte 'hold'
        int lancio = tiro();
        std::cout << lancio << "; ";
        if(lancio == 1) {
            std::cout << "in questo turno: 0\n";
            return false;
        }
        subtotale += lancio;
        if(punteggio + subtotale > TRAGUARDO) {
            std::cout << "in questo turno: " << subtotale << '\n';
            punteggio += subtotale;
            return true;
        }
    }
    std::cout << "in questo turno: " << subtotale << '\n';
    punteggio += subtotale;
    return false;
}


/*! restituisce un intero da 1 a 6
 */
int Giocatore::tiro()
{
    std::uniform_int_distribution dst(1, 6);
    return dst(eng);
}


std::ostream & operator<<(std::ostream & os, const Giocatore & rhs)
{
    return ( os << rhs.nome << ": " << rhs.punteggio );
}


std::string chiediNome(int num);


int main()
{
    Giocatore uno(chiediNome(1));
    Giocatore due(chiediNome(2), &uno);
    uno.setAltro(&due);
    if(uno.gioca()) {
        std::cout << uno.nome << " vince!\n";
    } else {
        std::cout << due.nome << " vince!\n";
    }
}


std::string chiediNome(int num)
{
    std::cout << "nome giocatore " << num << "? ";
    std::string s;
    std::cin >> s;
    return s;
}