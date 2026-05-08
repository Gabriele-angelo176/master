/* ESERCIZIO 1
 Scrivi una funzione chiamata "crazySum" che riceve due numeri interi come parametri.
 La funzione deve ritornare la somma di quei due valori, ma se il loro valore è lo stesso allora deve ritornare la loro somma moltiplicata per 3.
*/

let n1=2
let n2=2
function crazySum() {
    if(n1==n2){
 return (n1+n2)*3;
}else{
    return n1+n2
} 
}
console.log(crazySum(n1,n2));


/* ESERCIZIO 2
 Scrivi una funzione chiamata "boundary", che accetta un numero intero come parametro e ritorna true se tale parametro è incluso tra 20 e 100 (incluso) o se è esattamente uguale a 400.
*/
let n=5
function boundary(n) {
    if((n>=20 && n<= 100) || 
    n===400){
return true

    }else{
     return false
    }
}
console.log(boundary(20))




/* ESERCIZIO 3
 Scrivi una funzione chiamata "reverseString", che accetta una stringa come parametro e la ritorna invertita (es.: EPICODE => EDOCIPE).
*/

function reverse(s){
return s.split("").reverse().join("");
}
console.log(reverse("epicode"));


/* ESERCIZIO 4
 Scrivi una funzione chiamata "upperFirst", che accetta una stringa come parametro e la ritorna rendendo maiuscola ogni lettera iniziale di ogni parola.
*/

function upperFirst(m) {
    return m.toUpperCase()
}
console.log(upperFirst("pallone"))


/* ESERCIZIO 5
 Scrivi una funzione chiamata "giveMeRandom", che accetta come parametro un numero chiamato n e ritorna un array contenente n numeri random contenuti tra 0 e 10.
*/

 
function giveMeRandom(n){
    let numeri =[];
    for (let i = 0; i < n; i++) {
        const random = Math.floor(Math.random()*11);
        numeri.push(random);
    }
     return numeri
    
}
 console.log(giveMeRandom(4));

//EXTRA:
/* ESERCIZIO 1
 Scrivi una funzione chiamata "area" che riceve due parametri (l1, l2) e calcola l'area del rettangolo associato.
*/
 l1=4
 l2=4
function area(l1,l2) {
    let calcolo=(l1*l2)
    return 
    }
console.log(l1*l2);



/* ESERCIZIO 2
 Scrivi una funzione chiamata "crazyDiff" che calcola la differenza assoluta tra un numero fornito e 19.
 Se il valore calcolato è più grande di 19, la funzione deve tornare tale risultato moltiplicato per 3.
*/

function crazyDiff(n2,n1) {
    if (n2>n1){
       let calcolo=(n2-n1)*3
return calcolo
}
}
console.log(crazyDiff (25,19));


/* ESERCIZIO 3
 Scrivi una funzione chiamata "codify" che accetta una stringa come parametro.
 La funzione deve aggiungere la parola "code" all'inizio della stringa fornita e ritornare il risultato, ma se la stringa fornita comincia proprio con "code" allora deve ritornarla senza modifiche.
*/
let code=["code"]
function codify(code) {
     code.add("code")
return code
}
console.log(codify(code));
/* non mi ricordo */

/* ESERCIZIO 4
 Scrivi una funzione chiamata "check3and7" la quale accetta un numero intero positivo come parametro.
 La funzione deve controllare che tale parametro sia un multiplo di 3 o di 7, e in tal caso tornare true; altrimenti deve tornare false.
 SUGGERIMENTO: operatore modulo
*/

function check3and7(numero) {
if (numero%3|| numero%7) {
    return true
}else{
    return false
}     
    }
    console.log(check3and7(3));
    


/* ESERCIZIO 5
 Scrivi una funzione chiamata "cutString", che accetta una stringa come parametro e la ritorna senza il primo e l'ultimo carattere.
*/

let cane="cane"
function cutString(cane) {
let senza=cane.slice(1,3)   
return senza 
}
console.log(cutString(cane))