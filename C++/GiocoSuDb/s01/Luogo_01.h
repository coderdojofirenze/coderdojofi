#ifndef LUOGO_01_H
#define LUOGO_01_H

#include <iostream>
#include <string>

namespace Robi {

struct Luogo_01 {
    std::string str;
    int sa {}, sb {};
    int id {};
    Luogo_01() = default;
    Luogo_01(std::string str_arg, int sa_arg, int sb_arg, int id_arg = 0);
    friend std::ostream& operator<<(std::ostream& os, const Luogo_01& rhs)
    {
        return os <<   "ID: " << rhs.id << '\n' << rhs.str
                  << "\nscelta A: " << rhs.sa << "\tscelta B: " << rhs.sb;
    }
};

} // fine namespace Robi

#endif // LUOGO_01_H
