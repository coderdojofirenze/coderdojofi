#ifndef LUOGO_02_H
#define LUOGO_02_H

#include <iostream>
#include <string>
#include <vector>

namespace Robi {

struct TabLuogo {
    int idluogo {};
    std::string nome,
                descr;
    TabLuogo() = default;
    TabLuogo(int idluogo_arg, std::string nome_arg, std::string descr_arg)
        : idluogo { idluogo_arg }, nome { nome_arg }, descr { descr_arg }
    {}
};

struct TabEntraEsci {
    int prov {},
        dest {};
    std::string descr;
    TabEntraEsci() = default;
    TabEntraEsci(int prov_arg, int dest_arg, std::string descr_arg)
        : prov { prov_arg }, dest { dest_arg }, descr { descr_arg }
    {}
};

struct Luogo_02 {
    TabLuogo tl;
    std::vector<TabEntraEsci> tees;
    size_t margine { 80 };

    Luogo_02() = default;
    Luogo_02(TabLuogo tl_arg, std::vector<TabEntraEsci> tees_arg);
    std::string print();
    std::string spezzaRighe(std::string s);

    friend std::ostream& operator<<(std::ostream& os, const Luogo_02& rhs)
    {
        os <<   "ID: " << rhs.tl.idluogo << "; nome: " << rhs.tl.nome
           << "\nDescrizione: " << rhs.tl.descr << '\n';
        char ch = 'a';
        for(const auto& t : rhs.tees) {
            os << ch << ") " << t.descr << '\n';
            ++ch;
        }
        return os;
    }
};

} // fine namespace Robi

#endif // LUOGO_02_H
