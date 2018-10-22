#ifndef GIOCATORE_HPP
#define GIOCATORE_HPP

#include <chrono>
#include <functional>
#include <random>
#include <string>

namespace robi {


class Giocatore { // ABC!
public:
    const int TRAGUARDO { 100 };
    std::string nome;

    Giocatore() = default;
    Giocatore(std::string nome_arg);
    Giocatore(std::string nome_arg, Giocatore * const altro_arg);

    void setAltro(Giocatore * const altro_arg);
    const Giocatore * getAltro() const;
    int getPunteggio() const;
    // void setPunteggio(int punteggio_arg);

    bool gioca();
    virtual int turno() = 0;
    int tiro();

private:
    static std::mt19937 eng;
    int punteggio {};
    Giocatore * altro { nullptr };
// friend:
    friend std::ostream & operator<<(std::ostream & os, const Giocatore & rhs);
};


} // end namespace robi

#endif // GIOCATORE_HPP
