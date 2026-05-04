

const marco = {
  name: "Marco",
  lastName: "Rossi",
  isAmbassador: true,
}

const paul = {
  name: "Paul",
  lastName: "Flynn",
  isAmbassador: false,
}

const amy = {
  name: "Amy",
  lastName: "Reed",
  isAmbassador: false,
}

const prices = [34, 5, 2]
const shippingCost = 50
let utenteCheEffettuaLAcquisto = marco//cambia il valore qui per provare se il tuo algoritmo funziona!



let somma=0
for(let i =0; i <prices.length;i++){
 somma+=prices[i]
}
 console.log("somma",somma)

/* calcolo di  tutto il  for
somma=somma+prices[0]
 somma=0+34=34
 somma=somma+prices[1]
  somma=34+5=39
  somma=somma+prices[2]
  somma=39+2=41
  somma=somma+prices[3]
  totale=41
 */


if(utenteCheEffettuaLAcquisto.isAmbassador){
    let totaleScontato =somma-(somma*30/100)+shippingCost
    console.log("Totale Scontato", totaleScontato)
}else{
    let totaleconspedizione=somma+shippingCost
console.log("totale con spedizione", totaleconspedizione)
}
/* questo blocco qua serve a differenziare abbasador o meno
in base alle proprieta del oggetto
oggetto=const amy */

if(somma>100){
    shippingCost=0
    totalesenzaspedizione=somma-shippingCost
    console.log("Totale senza spedizione")
}


let utente = utenteCheEffettuaLAcquisto.isAmbassador===true
let abbasador=[]
abbasador.push(utente)
console.log(utente.name,utente.lastName,abbasador,"è un abbasador")

for (let i= 0; i <abbasador.length; i++) {
    const element = abbasador[i];
    console.log(element)
 }
    


