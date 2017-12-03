#include "RSQLite3_02.h"
#include <iostream>

namespace Robi {

RSQLite3_02::RSQLite3_02() : db { nullptr }, stm { nullptr }, status {} {}

/*
 * restituisce una combinazione dei seguenti stati:
 *      1 se il file non esiste o non e' stato possibile aprirlo;
 *      2 se il file esiste;
 *      4 se è stato appena creato;
 *      8 è stato aperto;
 */
int RSQLite3_02::open(const std::string& name_arg, const bool non_creare)
{
    if(name_arg.empty()) {
        if(name.empty()) {
            std::cout << "Un nome di file mi e' indispensabile.\n";
            return 1;
        }
    } else { name = name_arg; }

    if(non_creare) {
        status = sqlite3_open_v2(name.c_str(),
                                 &db,
                                 SQLITE_OPEN_READWRITE,
                                 0);
        if(status == SQLITE_OK) { return 2 + 8; }
    } else {
        status = sqlite3_open_v2(name.c_str(),
                                 &db,
                                 SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE,
                                 0);
        if(status == SQLITE_OK) { return 4 + 8; }
    }
    std::cout << "Impossibile aprire il database " << name << ".\nIl messaggio "
                  "d'errore e': " << sqlite3_errmsg(db) << '\n';
    return 1;
}

int RSQLite3_02::prepare()
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
    return status;
}

int RSQLite3_02::step()
{
    status = sqlite3_step(stm);
    if(status != SQLITE_ROW) {
        if(status == SQLITE_DONE)  {
//            std::cout << "No further rows to return.\n";
            return status;
        }
        if(status == SQLITE_ERROR) {
            std::cout << "Error in obtaining data.\n";
            return status;
        }
        std::cout << "RSQLite3_02::step(): Non posso procedere (oltre) lungo il "
                     "comando.\nError message is: " << sqlite3_errmsg(db) << '\n';
    }
    return status;
}

std::string RSQLite3_02::column_text(const int index)
{
    if(status != SQLITE_ROW) { return ""; }
    return reinterpret_cast<const char*>(sqlite3_column_text(stm, index));
}

int RSQLite3_02::column_int(const int index)
{
    if(status != SQLITE_ROW) { return status; }
    return (sqlite3_column_int(stm, index));
}

void RSQLite3_02::reset() { int sqlite3_reset(sqlite3_stmt *stm); }

void RSQLite3_02::close() { sqlite3_close_v2(db); }

void RSQLite3_02::bind_text(int parnum, std::string value)
{
    status = sqlite3_bind_text(stm, parnum, value.c_str(),
                                static_cast<int>(value.size()),
                                SQLITE_TRANSIENT);
    if(status != SQLITE_OK) {
        std::cout << "Cannot bind text parameter to the statement.\n"
                     "Error message is: " << sqlite3_errmsg(db) << '\n';
    }
}

void RSQLite3_02::bind_int(int parnum, int value)
{
    status = sqlite3_bind_int(stm, parnum, value);
    if(status != SQLITE_OK) {
        std::cout << "Cannot bind integer parameter to the statement.\n"
                     "Error message is: " << sqlite3_errmsg(db) << '\n';
    }
}

void RSQLite3_02::bind_double(int parnum, double value)
{
    status = sqlite3_bind_double(stm, parnum, value);
    if(status != SQLITE_OK) {
        std::cout << "Cannot bind floating number parameter to the statement.\n"
                     "Error message is: " << sqlite3_errmsg(db) << '\n';
    }
}

RSQLite3_02::~RSQLite3_02() { sqlite3_close_v2(db); }
} // fine namespace Robi
