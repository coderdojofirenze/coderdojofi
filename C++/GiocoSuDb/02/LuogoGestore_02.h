#ifndef LUOGOGESTORE_02_H
#define LUOGOGESTORE_02_H

#include "Luogo_02.h"
#include "RSQLite3_02.h"

namespace Robi {

/**
   In questa fase, LuogoGestore gestisce sia il database che le risposte
   dell'utente. Puo' darsi che in un secondo momento questo design venga
   considerato incompatibile con il single responsability principle.
 */
// La classe LuogoGestore dev'essere costruita su misura per il database.
class LuogoGestore_02 {
public:
    LuogoGestore_02(std::string nome = {});
    void apri(const std::string& nome);
    void entra();
private:
    Luogo_02 luogo;
    RSQLite3_02 db;
    int qui { 1 };

    void leggiLuogo();
    void mandaASchermo();
};

} // fine namespace Robi

#endif // LUOGOGESTORE_H
