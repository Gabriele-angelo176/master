const n1 = 6
const n2 = 50
if (n2 > n1) {
    console.log("il numero piu grande è " + n2)
}
else {
    console.log("il numero maggiore è " + n1)
}






const mynumber = 21
if (mynumber < 5) {
    console.log("tiny")
} else if (mynumber < 10) {
    console.log("small")
}
else if (mynumber < 15) {
    console.log("medium")
} else if (mynumber < 20) {
    console.log("large")
} else if (mynumber >= 20) {
    console.log("huge")
}

for (let i = 0; i <= 10; i++) {
    if (i === 3 || i === 8) {
        continue
    }

    console.log(i)
}


for (let i = 0; i <= 15; i++) {
    if (i % 2 === 0) {
        console.log(i + "è pari")
    }
    if (i % 2 !== 0) {
        console.log(i + " è dispari")
    }
}

const int1 = 16
const int2 = 8
if (int1 === 8 || int2 === 8) {
    console.log("almeno uno dei due numeri e 8")

}
if (int1 + int2 === 8 || int1 - int2 === 8) {
    console.log("la somma o sottrazione dei due numeri è 8")
}

const totalShoppingCart = 49
let shippingcost = 10
if (totalShoppingCart > 50) {
    const discounted = (totalShoppingCart * 20) / 100
    shippingcost = 0
    console.log("il cliente deve pagare " + (discounted + shippingcost))
}
if (totalShoppingCart < 50) {
    const discounted = (totalShoppingCart * 20) / 100
    console.log("il cliente deve pagare" + (discounted + shippingcost))
}


let gender = ""

const isMale = 'male'
const isFemale = 'female'

isMale ? gender = 'male' : gender = 'female'

console.log(gender)

