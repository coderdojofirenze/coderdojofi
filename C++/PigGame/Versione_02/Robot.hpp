#ifndef ROBOT_HPP
#define ROBOT_HPP

#include "Giocatore.hpp"
#include <iostream>
#include <functional>

namespace robi {


class Robot : public Giocatore {
public:
    Robot() = default;
    Robot(std::string nome_arg);
    Robot(std::string nome_arg, Giocatore * altro_arg);

    int turno() override;

private:
// friend:
    friend std::ostream & operator<<(std::ostream & os, const Robot & rhs);
};


} // end namespace robi

#endif // ROBOT_HPP
