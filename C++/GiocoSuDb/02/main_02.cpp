#include "CheckInitDb_02.h"
#include "LuogoGestore_02.h"
#include <iostream>
#include <limits>
#include <string>

void waitForEnter();

int main()
{
    Robi::CheckInitDb_02 cdb { "prova_02.sqlite3", "CreaBaseDb_02.sql" };
    cdb.check();
    cdb.aggDatiDiProva("Istr_Luogo_02.sql", "Dati_Luogo_02.dat");
    cdb.aggDatiDiProva("Instr_Entra_Esci_02.sql", "Dati_Entra_Esci_02.dat", true);
    cdb.chiudi();
    Robi::LuogoGestore_02 lg("prova_02.sqlite3");
    std::cout << "Uscita\n";
    waitForEnter();
    return 0;
}

void waitForEnter()
{
    std::cout << "\nPress ENTER to continue...\n";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}
