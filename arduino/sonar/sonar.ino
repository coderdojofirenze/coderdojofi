import processing.serial.*;
Serial porta;
int r;
Integer Colore=0;

void setup(){
println ("seriali:");
println (Serial.list());
porta=new Serial(this,Serial.list()[0],9600);
size(600, 600);
//background(19, 64, 180);
stroke(19, 64, 180);
delay(500);
}
void draw(){
String val;
Integer a;
Integer d;
String s[];
if (porta.available()>0){
  val = porta.readStringUntil('\n'); 
  if (val != null){
    println(val);
    s=val.split(" ");
    d=Integer.valueOf(s[5]);
    a=Integer.valueOf(s[1]);
    fill(19, 64, 180);
    arc(300, 580,1000, 1000, PI+(a-5)*PI/180, PI+(a+5)*PI/180);
    fill(0);
    arc(300, 580, d*2, d*2, PI+(a-5)*PI/180, PI+(a+5)*PI/180);
  }
}
}
