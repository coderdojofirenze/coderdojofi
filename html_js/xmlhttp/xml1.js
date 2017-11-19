function preleva(url)
{
 var xhr= new XMLHttpRequest();
 xhr.open("GET", url ,false);
 xhr.send();
 return xhr.responseText;
}
// return JSON.parse(xhr.responseText);

function imposta(id,url){
	var tag=document.getElementById(id);
	tag.innerHTML=preleva(url);
}
