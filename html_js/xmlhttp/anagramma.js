function verifica(){
	var p1=document.getElementById("parola1").value;
	var p2=document.getElementById("parola2").value;
	p1=p1.split("");
	p2=p2.split("");
	p1=p1.sort();
	p2=p2.sort();
	p1=p1.join();
	p2=p2.join();
	if (p1==p2) alert ("Esatto");
	else alert ("Sbagliato");
}
