const booksrow=document.getElementById('booksrow')

const getbooks=async () =>{
try{
    const result =await fetch('https://striveschool-api.herokuapp.com/books')
const data =await result.json()
displaybooks(data);

}

catch(error){
    console.log(error);
    
}
}



getbooks()





const createbookcard=({title,img,price,category})=>{
    const col =document.createElement('div')
    col.classList.add('col-3')
  

   const card=document.createElement('div')
   card.classList.add('card')
   col.appendChild(card)

   const bookcover=document.createElement('img')
   bookcover.classList.add('card-img-top')
   bookcover.src=img
   bookcover.alt=title
   card.appendChild(bookcover)

   const cardbody=document.createElement('div')
   cardbody.classList.add('card-body')
   card.appendChild(cardbody)

   const booktitle=document.createElement('h5')
   booktitle.classList.add('card-title')
   booktitle.innerText=title
   cardbody.appendChild(booktitle)


    const bookcategory=document.createElement('p')
bookcategory.classList.add('card-text')
bookcategory.innerText=category
cardbody.appendChild(bookcategory)


   const bookprice=document.createElement('p')
bookprice.classList.add('card-text')
bookprice.innerText=price
cardbody.appendChild(bookprice)



 const addtocard=document.createElement('a')
 addtocard.classList.add('card-link')
addtocard.innerText="aggiungi al carello"
cardbody.appendChild(addtocard)




 const jumpbutton=document.createElement('a')
 jumpbutton.classList.add('card-link')
jumpbutton.innerText="salta"
cardbody.appendChild(jumpbutton)


return col
}

const displayBooks = (books) => {
    booksRow.innerHTML=''
    const cardBook = books.map(book => createBookCard(book))
    cardBook.forEach(card => booksRow.appendChild(card))
}
 

