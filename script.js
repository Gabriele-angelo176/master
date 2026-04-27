
/* ESERCIZIO 1
 Elenca e descrivi i principali datatype in JavaScript. Prova a spiegarli come se volessi farli comprendere a un bambino.
*/


/* SCRIVI QUI LA TUA RISPOSTA */
/* NUMBER:SONO I NUMERI 
STRING:SONO LETTERE,FRASI,O SEMPLICI PAROLE 
BOOLEAN: E UNA LOGICA CHE TI AIUTA A CAPIRE SE DIRE SI  O NO
UNDEFINED:IN PRATICA SAI COSA C'è DENTRO MA NON SAI COSA 
NULL: CHE NO C'è DENTRO NULLA  */

/* ESERCIZIO 2
 Descrivi cos'è un oggetto in JavaScript, con parole tue.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
/* e un contenitore dove metti piu informazioni possibili */

/* ESERCIZIO 3
 Scriti il codice necessario ad effettuare un addizione (una somma) dei numeri 12 e 20.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
n1=10
n2=20
somma=n1+n2
console.log(somma);

/* ESERCIZIO 4
 Crea una variable di nome "x" e assegna ad essa il numero 12.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
const x=12

/* ESERCIZIO 5
 Crea una variable chiamata "name" e assegna ad essa il tuo nome, sotto forma di stringa.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
const name="gabrieleangelo"
console.log(somma,name)

/* ESERCIZIO 6
 Esegui una sottrazione tra i numeri 4 e la variable "x" appena dichiarata (che contiene il numero 12).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
y=4
sotrazzione=x-y
console.log(sotrazzione)

/* ESERCIZIO 7
 Crea due variabili: "name1" e "name2". Assegna a name1 la stringa "john", e assegna a name2 la stringa "John" (con la J maiuscola!).
 Verifica che name1 sia diversa da name2 (suggerimento: è la stessa cosa di verificare che la loro uguaglianza sia falsa).
 Infine, verifica che la loro uguaglianza diventi true se entrambe vengono trasformate in lowercase (senza cambiare il valore di name2!).
 NON HAI BISOGNO DI UN BLOCCO IF/ELSE. E' sufficiente utilizzare console.log().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
io={"name":"gabriele angelo",
"cognome":"cannata",
"hobby":"palestra,beatbox"
}
console.log(io.name,io.cognome,io.hobby)

const name1= "Jhon"
const name2= "jhon"
const comparioson=name1===name2
console.log(name1===name2)
console.log(name1.toLowerCase() ===name2.toLowerCase())


