#include <Servo.h>

//HC-SR04 Sensore ultrasuoni
int triggerPort = 7;
int echoPort = 8;


Servo myservo;
int segno=10;
int angle=5;
long distanza;

void setup(){
  pinMode( triggerPort, OUTPUT );
  pinMode( echoPort, INPUT );
  Serial.begin(9600);
  myservo.attach(9);
}

void loop(){
  angle+=segno;
  if (angle >= 175) segno=-10;
  if (angle <= 5) segno=10;
 
  myservo.write(angle);

//porta bassa l'uscita del trigger
  digitalWrite( triggerPort, LOW );
 
//invia un impulso di 10microsec su trigger
  digitalWrite( triggerPort, HIGH );
  delayMicroseconds( 10 );
  digitalWrite( triggerPort, LOW );
 
  long duration = pulseIn( echoPort, HIGH ); //microsec

  if( duration > 38000 ) distanza=0;
  else distanza = 0.034 * duration / 2;  //cm

  Serial.print ("Angolo: "); 
  Serial.print (angle);
  Serial.print( " durata: " );
  Serial.print( duration );
  Serial.print( " " );
  Serial.print( "distanza: " );
  Serial.print( distanza );
  Serial.println( " " );
 
//aspetta 1.5 secondi
  delay( 1500 );

}
