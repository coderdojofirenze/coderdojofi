#ifndef UMANO_HPP
#define UMANO_HPP

#include "Giocatore.hpp"
#include <iostream>
#include <functional>

namespace robi {


class Umano : public Giocatore {
public:
    Umano() = default;
    Umano(std::string nome_arg);
    Umano(std::string nome_arg, Giocatore * const altro_arg);

    int turno() override;

private:
// friend:
    friend std::ostream & operator<<(std::ostream & os, const Umano & rhs);
};


} // end namespace robi

#endif // UMANO_HPP
