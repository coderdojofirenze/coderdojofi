#include "Luogo_02.h"

namespace Robi {

Luogo_02::Luogo_02(TabLuogo tl_arg, std::vector<TabEntraEsci> tees_arg)
    : tl { tl_arg }, tees { tees_arg }
{}

std::string Luogo_02::print()
{
    std::string s { tl.nome };
    if(margine > s.length()) {
        int spazi = (margine - s.length()) / 2;
        s = std::string(spazi, ' ') + s + std::string(spazi, ' ');
    }
    s += '\n' + spezzaRighe(tl.descr) + '\n';
    char ch = 'a';
    for(const auto& t : tees) {
        s += ch;
        s += ") " + t.descr + '\n';
        ++ch;
    }
    return s;
}

std::string Luogo_02::spezzaRighe(std::string s)
{
    size_t slen = s.length();
    std::string::size_type pos {};
    while(slen-pos > margine) {
        pos = s.find_last_of(' ', pos + margine);
        if(std::string::npos != pos) { s.at(pos) = '\n'; }
    }
    return s;
}

} // fine namespace Robi
