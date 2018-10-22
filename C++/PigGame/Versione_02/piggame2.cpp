// Istruzioni compilazione:
// g++ -std=gnu++17 -Wall -Wextra -pedantic-errors Giocatore.cpp Robot.cpp Umano.cpp piggame2.cpp -o piggame2.exe

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
#include "Robot.hpp"
#include "Umano.hpp"
#include <functional>
#include <string>

std::string chiediNome();


int main()
{
    robi::Robot robot("Computer");
    robi::Umano umano(chiediNome(), &robot);
    robot.setAltro(&umano);

    for(;;) {
        std::cout << "Tocca a " << umano.nome << " giocare.\n";
        if(umano.gioca()) {
            std::cout << umano << '\n' << umano.nome << " vince!\n";
            break;
        }
        std::cout << "Tocca a " << robot.nome << " giocare.\n";
        if(robot.gioca()) {
            std::cout << robot << '\n' << robot.nome << " vince!\n";
            break;
        }
    }
}


std::string chiediNome()
{
    std::cout << "Come ti chiami? ";
    std::string s;
    std::cin >> s;
    return s;
}
