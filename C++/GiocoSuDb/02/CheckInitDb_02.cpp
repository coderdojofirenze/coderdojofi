#include "CheckInitDb_02.h"
#include <fstream>
#include <iterator>
#include <sstream>
#include <string>
#include <vector>

namespace Robi {

CheckInitDb_02::CheckInitDb_02(std::string dbname_arg, std::string instr_arg)
    : dbname { dbname_arg }, instr { instr_arg }, inidbst { SCONOSCIUTO }
{}

/* Restituisce 0 se fallisce, altrimenti 1 */
int CheckInitDb_02::aggDatiDiProva(std::string finstr, std::string fdati, bool ultimo)
{
    if(inidbst == DATI_OK || seCompleto()) {
        std::cout << "Dati gia' esistenti.\n";
        return 1; // tutto ok
    }
    // Legge il file delle istruzioni che specifica in quale ordine i dati
    // vanno inseriti nella tabella.
    std::ifstream fins(finstr);
    if(!fins) {
        std::cout << "Il file " << finstr << " non si apre.\n";
        return 0;
    }
    std::getline(fins, db.query);
    // pars: parametri da legare.
    // 1 --> int
    // 2 --> double
    // 3 --> std::string
    std::string line;
    std::getline(fins, line);
    std::vector<int> pars = estraiIntDaString(line);
    fins.close();

    // Legge i dati e li inserisce nella tabella.
    std::ifstream fdat(fdati);
    if(!fdat) {
        std::cout << "Il file " << fdati << " non si apre.\n";
        return 0;
    }
    while(std::getline(fdat, line)) {
        db.prepare();
        std::vector<std::string> pezzi = estraiPezziDaString(line);
        // pars e pezzi devono avere la stessa lunghezza!!
        if(pars.size() != pezzi.size()) { std::cout << "Errore nei dati!\n"; }
        for(size_t i {}; i < pars.size(); ++i) {
//            std::cout << "pars.at("    << i << "): " << pars.at(i)
//                      << "; pezzi.at(" << i << "): " << pezzi.at(i) << '\n';
            switch (pars.at(i)) {
            case 1:
                db.bind_int(i+1, std::stoi(pezzi.at(i)));
                break;
            case 2:
                db.bind_double(i+1, std::stod(pezzi.at(i)));
                break;
            case 3:
                db.bind_text(i+1, pezzi.at(i).c_str());
                break;
            default:
                break;
            }
        }
        db.step();
    }
    if(ultimo) {
        inidbst = DATI_OK;
        dichiaraDbCompleto();
    }
    return 1;
}

void CheckInitDb_02::chiudi() { db.close(); }

void CheckInitDb_02::dichiaraDbCompleto()
{
    db.query = "CREATE TABLE IF NOT EXISTS \"main\".\"stato\" "
               "(\"IDstato\" INTEGER)";
    db.prepare();
    db.step();
    db.query = "INSERT INTO \"main\".\"stato\" (\"IDstato\") VALUES (1)";
    db.prepare();
    db.step();
}

/* Restituisce 0 se qualche operazione fallisce, altrimenti 1
 */
int CheckInitDb_02::esegIstrCreazione()
{
    for(const auto& s : cmds) {
        db.query = s;
        db.prepare();
        db.step();
        while(SQLITE_ERROR == db.status) { return 0; }
    }
    return 1;
}

std::vector<int> CheckInitDb_02::estraiIntDaString(const std::string& line)
{
    std::vector<int> nums;
    if(!line.empty()) {
        std::istringstream iss(line);
        for(int i {}; iss >> i; nums.push_back(i)) {}
    }
    return nums;
}

std::vector<std::string> CheckInitDb_02::estraiPezziDaString(const std::string& line)
{
    std::vector<std::string> pezzi;
    if(!line.empty()) {
        std::istringstream iss(line);
        for(std::string pezzo;
            std::getline(iss, pezzo, '|');
            pezzi.push_back(pezzo))
            {}
    }
    return pezzi;
}

/* Restituisce 0 se fallisce, 1 se il db passa tutte le verifiche.
 */
int CheckInitDb_02::check(const std::string& dbname_arg, const std::string& instr_arg)
{
    if(dbname_arg.empty()) {
        if(dbname.empty()) {
            std::cout << "Non posso verificare \"File Misterioso\".\n";
            return 0;
        }
    } else { dbname = dbname_arg; }

    // Primo passo: verificare se il file esiste e, nel caso, aprirlo.
    if( !(8 & db.open(dbname)) ) { return 0; }
    inidbst = APERTO;

    if(instr_arg.empty()) {
        if(instr.empty()) {
            std::cout << "Mancano istruzioni per la verifica.\n";
            return 0;
        }
    } else { instr = instr_arg; }

    // Tutte le istruzioni di verifica come query di testo
    if(!readSqlCmds()) {
        chiudi();
        inidbst = SCONOSCIUTO;
        return 0;
    }

    // Esegui tutte le istruzioni finche' non restituisce errore
    if(!esegIstrCreazione()) {
        chiudi();
        inidbst = SCONOSCIUTO;
        return 0;
    }
    inidbst = TABELLE_CREATE;
    return 1;
}

/* Restituisce 0 se fallisce, altrimenti 1 */
int CheckInitDb_02::readSqlCmds()
{
    std::ifstream fin(instr);
    if(!fin) {
        std::cout << "Can't open \"" << instr << "\".\n";
        return 0;
    }
    for(std::string line; std::getline(fin, line); cmds.push_back(line));
    return 1;
}

bool CheckInitDb_02::seCompleto()
{
    db.query = "SELECT * FROM \"main\".\"stato\"";
    if(SQLITE_OK != db.prepare()) { return false; }
    if(SQLITE_ROW == db.step()) { return true; }
    return false;
}

} // fine namespace Robi
