#include "LuogoGestore_02.h"
#include <sstream>
#include <vector>

namespace Robi {

LuogoGestore_02::LuogoGestore_02(std::string nome)
{
    while(nome.empty()) {
        std::cout << "Mi serve il nome del database: ";
        std::string line;
        std::getline(std::cin, line);
    }
    apri(nome);
    entra();
}

void LuogoGestore_02::apri(const std::string & nome) { db.open(nome); }

void Robi::LuogoGestore_02::leggiLuogo()
{
    db.query =   "SELECT * FROM \"main\".\"luogo\" WHERE \"IDluogo\" = "
               + std::to_string(qui);
    db.prepare();
    db.step();
    TabLuogo tl { db.column_int(0), db.column_text(1), db.column_text(2) };

    db.query =   "SELECT * FROM \"main\".\"entra_esci\" WHERE \"Provenienza\" = "
               + std::to_string(tl.idluogo);
    db.prepare();
    std::vector<TabEntraEsci> ts;
    while(SQLITE_DONE != db.step()) {
        ts.emplace_back(db.column_int(0), db.column_int(1), db.column_text(2));
    }

    luogo = { tl, ts };
}

void LuogoGestore_02::mandaASchermo()
{
    std::cout << "\n\n" << std::string(80, '*')
              << "\n"
                 "\n        |    |                       |    |                       |    |"
                 "\n        |    |                       |    |                       |    |"
                 "\n        |    |                       |    |                       |    |"
                 "\n        |    |                       |    |                       |    |"
                 "\n        |    |                       |    |                       |    |"
                 "\n        \\    /                       \\    /                       \\    /"
                 "\n         \\  /                         \\  /                         \\  /"
                 "\n          \\/                           \\/                           \\/"
                 "\n\n"
              << luogo.print() << '\n';
}

void LuogoGestore_02::entra()
{
    while(qui != 0) {
        leggiLuogo();
        mandaASchermo();
        std::cout << ">>> ";
        for(std::string line; std::getline(std::cin, line); /**/) {
            std::istringstream iss(line);
            char ch {};
            iss >> ch;
            try {
                int i { luogo.tees.at(ch - 'a').dest };
                qui = i;
                break;
            } catch (std::out_of_range& e) {
                std::cout << ">>> ";
            }
        }
    }
}

} // fine namespace Robi
