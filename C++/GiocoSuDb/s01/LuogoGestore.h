#ifndef LUOGOGESTORE_H
#define LUOGOGESTORE_H

#include "Luogo_01.h"
#include "RSQLite3.h"
#include <map>

namespace Robi {

/**
   In questa fase, LuogoGestore gestisce sia il database che le risposte
   dell'utente. Puo' darsi che in un secondo momento questo design venga
   considerato incompatibile con il single responsability principle.
 */
class LuogoGestore {
public:
    std::map<int, Luogo_01> luoghi;
    RSQLite3 db;
    int qui { 1 };
    void apri();
    void leggiTuttiLuoghi();
    void mandaASchermo();
    // Funzioni non previste nella versione Release
    void entra();
    void tuttiASchermo();
    std::string spezzaRighe(std::string s, size_t st = 80);
    std::string formPerWin(std::string s);
};

} // fine namespace Robi

#endif // LUOGOGESTORE_H
