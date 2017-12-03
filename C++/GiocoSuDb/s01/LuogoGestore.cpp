#include "LuogoGestore.h"
#include <sstream>

namespace Robi {
void LuogoGestore::apri() { db.open("prova_01.sqlite3"); }
void LuogoGestore::leggiTuttiLuoghi()
{
    db.query = "SELECT * FROM \"main\".\"luogo\"";
    db.prepare();
    db.step();
    while(db.status == SQLITE_ROW) {
        luoghi.emplace(std::make_pair(db.column_int(0),                     // id
                                      Luogo_01 { db.column_text(1),         // str
                                                 db.column_int(2),          // sa
                                                 db.column_int(3)   } ) );  // sb
        db.step();
    }
}

void LuogoGestore::mandaASchermo()
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
              << spezzaRighe(luoghi.at(qui).str) << '\n';
}

void LuogoGestore::entra()
{
    while(qui != -1) {
        mandaASchermo();
        std::cout << ">>> ";
        for(std::string line; std::getline(std::cin, line); /**/) {
            std::istringstream iss(line);
            char ch {};
            iss >> ch;
            if(ch != 'a' and ch != 'b') { std::cout << ">>> "; continue; }
            qui = ( ch == 'a' ? luoghi.at(qui).sa
                              : luoghi.at(qui).sb );
            break;
        }
    }
}

void LuogoGestore::tuttiASchermo()
{
    for(const auto& l : luoghi) { std::cout << l.second << '\n'; }
                 std::cout << '\n';
}

std::string LuogoGestore::spezzaRighe(std::string s, size_t st)
{
//    s = formPerWin(s);
    size_t slen = s.length();
    std::string::size_type pos {};
    while(slen-pos > st) {
        pos = s.find_last_of(' ', pos + st);
        if(std::string::npos != pos) { s.at(pos) = '\n'; }
    }
    return s;
}

std::string LuogoGestore::formPerWin(std::string s)
{
//    for(auto& c : s) {
//        switch (c) {
//        case '’':
//            c = '\'';
//            break;
//        case 'à':
//            c = '\x85';
//            break;
//        case 'é':
//            c = '\x82';
//            break;
//        case 'è':
//            c = '\x8A';
//            break;
//        case 'ò':
//            c = '\x95';
//            break;
//        case 'ì':
//            c = '\8D';
//            break;
//        case 'ù':
//            c = '\97';
//            break;
//        }
//    }
    return s;
}

} // fine namespace Robi
