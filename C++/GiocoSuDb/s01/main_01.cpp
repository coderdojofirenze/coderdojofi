#include "CheckInitDb.h"
#include "LuogoGestore.h"
#include <iostream>
#include <limits>

void waitForEnter();

int main()
{
    std::cout << "\nPartenza!\n";
    std::string stddb { "prova_01.sqlite3" };
    Robi::CheckInitDb cdb;
    cdb.check(stddb);
    cdb.chiudi();
    Robi::LuogoGestore lg;
    lg.apri();
    lg.leggiTuttiLuoghi();
//    lg.tuttiASchermo();
    lg.entra();
    std::cout << "Uscita\n";
    waitForEnter();
    return 0;
}

void waitForEnter()
{
    std::cout << "\nPress ENTER to continue...\n";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}
