#ifndef CHECKINITDB_H
#define CHECKINITDB_H

#include "RSQLite3_02.h"
#include "Luogo_02.h"
#include <fstream>
#include <iostream>
#include <iterator>
#include <string>
#include <vector>

namespace Robi {

enum INIDBST {
                SCONOSCIUTO     =  -1,
                CREATO          =   1,
                APERTO          =   2,
                TABELLE_CREATE  =   4,
                DATI_OK         =   8
            };

class CheckInitDb_02 {
public:
    std::string dbname,
                instr;
    INIDBST inidbst;
    std::vector<std::string> cmds;

    CheckInitDb_02(std::string dbname_arg = {}, std::string instr_arg = {});
    int aggDatiDiProva(std::string finstr, std::string fdati, bool ultimo = false);
    int check( const std::string& dbname_arg = {},
               const std::string& instr_arg = {}   );
    void chiudi();
    void dichiaraDbCompleto();
    int esegIstrCreazione();
    int readSqlCmds();
    bool seCompleto();
private:
    RSQLite3_02 db;

    std::vector<int> estraiIntDaString(const std::string& line);
    std::vector<std::string> estraiPezziDaString(const std::string& line);
};

} // fine namespace Robi

#endif // CHECKINITDB_H
