#ifndef RSQLITE3_H
#define RSQLITE3_H

#include "sqlite3.h"
#include <string>

namespace Robi {
class RSQLite3 {
public:
    sqlite3* db;
    sqlite3_stmt* stm;
    std::string name,
                query;
    int status;
    RSQLite3();
    void open(const std::string& name_arg = "");
    void prepare();
    void step();
    std::string column_text(const int index);
    int column_int(const int index);
    void reset();
    void close();
    void bind_text(int parnum, std::string value);
    void bind_int(int parnum, int value);
    ~RSQLite3();
};
} // fine namespace Robi

#endif // RSQLITE3_H
