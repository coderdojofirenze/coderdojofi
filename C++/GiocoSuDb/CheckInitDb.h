#ifndef CHECKINITDB_H
#define CHECKINITDB_H

#include "RSQLite3.h"
#include "Luogo_01.h"
#include <fstream>
#include <iostream>
#include <iterator>
#include <string>
#include <vector>

namespace Robi {
class CheckInitDb {
public:
    RSQLite3 db;
    std::string name;
    std::vector<std::string> cmds;
    void addFieldsToLuogo();
    void check(const std::string& name_arg);
    void chiudi();
    void createTableScheme();
    void readSqlCmds();
};
} // fine namespace Robi

#endif // CHECKINITDB_H
