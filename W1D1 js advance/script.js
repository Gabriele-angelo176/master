function verificaCondizione(a,b){
    return(a===b||b===50) && (a+b)===50;
   
}
 console.log(verificaCondizione(25,25));











 function
 rimuovicarattere(str,pos){
    return  str.slice(0,pos)+str.slice(pos+1);
 }
 console.log(rimuovicarattere("ciao",1));
 









function verificaNumeri(a, b) {
    let range1 = (a >= 40 && a <= 60) && (b >= 40 && b <= 60);
    let range2 = (a >= 70 && a <= 100) && (b >= 70 && b <= 100);
    return range1 || range2;
}
console.log(verificaNumeri(50, 55)); // Ritorna true
console.log(verificaNumeri(80, 90)); // Ritorna true
console.log(verificaNumeri(30, 20)); // Ritorna false









function controllaCitta(citta) {
    if (citta.startsWith("Los") || citta.startsWith("New")) {
        return citta;
    }
    return false;
}

console.log(controllaCitta("Los Angeles")); // Ritorna "Los Angeles"
console.log(controllaCitta("New York")); // Ritorna "New York"
console.log(controllaCitta("Florence")); // Ritorna false









function calcolaSomma(array) {
    return array.reduce((accumulatore, elemento) => accumulatore + elemento, 0);
}
console.log(calcolaSomma([10, 20, 30]));








function controllaarray(arr){
    return !arr.includes(1)&&!arr.includes(3);
}
console.log(controllaarray([2,4,5]));//ritorna true
console.log(controllaarray([1,2,4]));// ritorna false









function trovaTipoAngolo(gradi) {
    if (gradi < 90) {
        return "acuto";
    } else if (gradi === 90) {
        return "retto";
    } else if (gradi > 90 && gradi < 180) {
        return "ottuso";
    } else if (gradi === 180) {
        return "piatto";
    } else {
        return "angolo non valido";
    }
}
console.log(trovaTipoAngolo(45));  // Ritorna "acuto"
console.log(trovaTipoAngolo(90));  // Ritorna "retto"
console.log(trovaTipoAngolo(120)); // Ritorna "ottuso"
console.log(trovaTipoAngolo(180)); // Ritorna "piatto"










function creaAcronimo(frase) {
    return frase
        .split(' ')
        .map(parola => parola.charAt(0).toUpperCase())
        .join('');
}

console.log(creaAcronimo("fabbrica italiana automobili Torino")); // Ritorna "FIAT"










function caratterePiuFrequente(testo) {
    if (!testo) return null;
    
    const frequenze = {};
    let carattereMax = '';
    let conteggioMax = 0;
    
    for (const char of testo.replace(/\s/g, '')) {
        frequenze[char] = (frequenze[char] || 0) + 1;
        if (frequenze[char] > conteggioMax) {
            conteggioMax = frequenze[char];
            carattereMax = char;
        }
    }
    
    return { carattere: carattereMax, occorrenze: conteggioMax };
}








const esempio = "supercalifragilistichespiralidoso";
console.log(caratterePiuFrequente(esempio));

function sonoAnagrammi(str1, str2) {
    const pulisciStringa = (str) => 
        str.replace(/[^\w]/g, '').toLowerCase().split('').sort().join('');
    
    return pulisciStringa(str1) === pulisciStringa(str2);
}

console.log(sonoAnagrammi("Ascoltare", "La corte")); 
console.log(sonoAnagrammi("Ciao", "Mondo"));







function filtraAnagrammi(listaPossibili, parola) {
    const pulisciStringa = (str) => 
        str.replace(/[^\w]/g, '').toLowerCase().split('').sort().join('');
    
    const parolaOrdinata = pulisciStringa(parola);
    
    return listaPossibili.filter(anagramma => pulisciStringa(anagramma) === parolaOrdinata);
}

const parole = ["carenti", "incerta", "espatrio"];
const parolaChiave = "cartine";

console.log(filtraAnagrammi(parole, parolaChiave));








function isPalindromo(str) {
    const pulita = str.replace(/[^\w]/g, '').toLowerCase();
    const invertita = pulita.split('').reverse().join('');
    return pulita === invertita;
}

console.log(isPalindromo("anna")); 
console.log(isPalindromo("radar")); 
console.log(isPalindromo("ciao"));









function invertiCifre(numero) {
    const stringaInvertita = numero
        .toString()
        .split('')
        .reverse()
        .join('');
    return parseInt(stringaInvertita, 10);
}

console.log(invertiCifre(189));









function stampaScala(x) {
    for (let i = 1; i <= x; i++) {
        console.log('#'.repeat(2 * i - 1));
    }
}





function invertiStringa(str) {
    return str.split('').reverse().join('');
}

console.log(invertiStringa("ciao"));





function dividiInSottoarray(array, y) {
    const risultato = [];
    for (let i = 0; i < array.length; i += y) {
        risultato.push(array.slice(i, i + y));
    }
    return risultato;
}

const esempio1 = dividiInSottoarray([1, 2, 3, 4], 2);
console.log(esempio1);

const esempio2 = dividiInSottoarray([1, 2, 3, 4, 5], 4);
console.log(esempio2);






function stampaPiramide(x) {
    for (let i = 1; i <= x; i++) {
        if (i < x) {
            console.log('#'.repeat(2 * i - 1));
        } else {
            console.log('#'.repeat(i + 1));
        }
    }
}




function creaMatriceSpirale(n) {
    const matrice = Array(n).fill(0).map(() => Array(n).fill(0));
    let valore = 1;
    let rigaInizio = 0, rigaFine = n - 1;
    let colonnaInizio = 0, colonnaFine = n - 1;

    while (rigaInizio <= rigaFine && colonnaInizio <= colonnaFine) {
        for (let i = colonnaInizio; i <= colonnaFine; i++) {
            matrice[rigaInizio][i] = valore++;
        }
        rigaInizio++;

        for (let i = rigaInizio; i <= rigaFine; i++) {
            matrice[i][colonnaFine] = valore++;
        }
        colonnaFine--;

        if (rigaInizio <= rigaFine) {
            for (let i = colonnaFine; i >= colonnaInizio; i--) {
                matrice[rigaFine][i] = valore++;
            }
            rigaFine--;
        }

        if (colonnaInizio <= colonnaFine) {
            for (let i = rigaFine; i >= rigaInizio; i--) {
                matrice[i][colonnaInizio] = valore++;
            }
            colonnaInizio++;
        }
    }
    return matrice;
}

const n = 3;
console.log(creaMatriceSpirale(n));
