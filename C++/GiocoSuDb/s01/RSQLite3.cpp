#include "RSQLite3.h"
#include <iostream>

namespace Robi {
RSQLite3::RSQLite3() : db { nullptr }, stm { nullptr }, status {} {}

void RSQLite3::open(const std::string& name_arg)
{
    if(!name_arg.empty()) { name = name_arg; }
    status = sqlite3_open_v2(name.c_str(),
                             &db,
                             SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE,
                             0);
    if(status != SQLITE_OK) {
        std::cout << "Can't open database " << name << ".\nError "
                      "message is: " << sqlite3_errmsg(db) << '\n';
    }
}

void RSQLite3::prepare()
{
    // int sqlite3_prepare_v2(
    // sqlite3 *db,            /* Database handle */
    // const char *zSql,       /* SQL statement, UTF-8 encoded */
    // int nByte,              /* Maximum length of zSql in bytes. */
    // sqlite3_stmt **ppStmt,  /* OUT: Statement handle */
    // const char **pzTail     /* OUT: Pointer to unused portion of zSql */
    status = sqlite3_prepare_v2(db, query.c_str(),
                                static_cast<int>(query.size()),
                                &stm, NULL);
    if(status != SQLITE_OK) {
        std::cout << "Can't prepare statement '" << query
                  << ".\nError message is: " << sqlite3_errmsg(db) << '\n';
    }
}

void RSQLite3::step()
{
    status = sqlite3_step(stm);
    if(status != SQLITE_ROW) {
        std::cout << "Can't step through the statement.\n"
                  << "Error message is: " << sqlite3_errmsg(db) << '\n';
        if(status == SQLITE_DONE) { std::cout << "No further rows to return.\n"; }
        if(status == SQLITE_ERROR) { std::cout << "Error in obtaining data.\n"; }
    }
}

std::string RSQLite3::column_text(const int index)
{
    if(status != SQLITE_ROW) { return ""; }
    return reinterpret_cast<const char*>(sqlite3_column_text(stm, index));
}

int RSQLite3::column_int(const int index)
{
    if(status != SQLITE_ROW) { return status; }
    return (sqlite3_column_int(stm, index));
}

void RSQLite3::reset() { int sqlite3_reset(sqlite3_stmt *stm); }

void RSQLite3::close() { sqlite3_close_v2(db); }

void RSQLite3::bind_text(int parnum, std::string value)
{
    status = sqlite3_bind_text(stm, parnum, value.c_str(),
                                static_cast<int>(value.size()),
                                SQLITE_TRANSIENT);
    if(status != SQLITE_OK) {
        std::cout << "Cannot bind text parameter to the statement.\n"
                  << "Error message is: " << sqlite3_errmsg(db) << '\n';
    }
}

void RSQLite3::bind_int(int parnum, int value)
{
    status = sqlite3_bind_int(stm, parnum, value);
    if(status != SQLITE_OK) {
        std::cout << "Cannot bind integer parameter to the statement.\n"
                  << "Error message is: " << sqlite3_errmsg(db) << '\n';
    }
}

RSQLite3::~RSQLite3() { sqlite3_close_v2(db); }
} // fine namespace Robi
