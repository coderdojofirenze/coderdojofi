#include "CheckInitDb.h"
#include <fstream>
#include <iostream>
#include <iterator>
#include <string>
#include <vector>

namespace Robi {
void CheckInitDb::addFieldsToLuogo()
{
    std::ifstream fin("Luogo_01.txt");
    if(!fin) {
        std::cout << "Can't open \"Luogo_01.txt\".\n";
    }
    db.query = "INSERT INTO \"main\".\"luogo\" (\"Descrizione\", "
                  "\"Scelta_A\", \"Scelta_B\") VALUES (?1, ?2, ?3)";
    std::cout << db.query << '\n';
    for(std::string line; std::getline(fin, line); /**/) {
        std::string::size_type pos = line.find('|');
        Luogo_01 l { line.substr(0, pos),
                     std::stoi(line.substr(pos+1)),
                     std::stoi(line.substr(line.find_last_of("|")+1)) };
        db.prepare();
        db.bind_text(1, l.str);
        db.bind_int(2, l.sa);
        db.bind_int(3, l.sb);
        db.step();
    }
}

void CheckInitDb::chiudi() { db.close(); }

void CheckInitDb::check(const std::string& name_arg)
{
    if(!name_arg.empty()) { name = name_arg; }
    db.open(name);
    readSqlCmds();
    db.query = cmds.at(0);
    db.prepare();
    db.step();
    if(db.status == SQLITE_DONE) {
        std::cout << "No tables in the database yet. Creating now.\n";
        createTableScheme();
        addFieldsToLuogo();
    }
}

void CheckInitDb::createTableScheme()
{
    db.query = cmds.at(1);
    db.prepare();
    db.step();
}

void CheckInitDb::readSqlCmds()
{
    std::ifstream fin("CreaBaseDb.txt");
    if(!fin) {
        std::cout << "Can't open \"CreaBaseDb.txt\".\n";
    }
    for(std::string line; std::getline(fin, line); cmds.push_back(line));
}
} // fine namespace Robi
