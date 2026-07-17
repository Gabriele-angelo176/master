const search=document.getElementById('search')
const searchbtn=document.getElementById('searchbtn')
const row = document.getElementById('row')
let users=[]
const list = async () => {
    const result = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await result.json()
    users=data
    const usercard = data.map(user => tocard(user))
    row.append(...usercard)
}

list()

searchbtn.addEventListener('click',(e)=>{
    e.preventDefault()
   const searchvalue=search.value
    console.log(users);
    
})
/* <div class="card" style="width: 18rem;">
 
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */

function tocard(users) {
    const col = document.createElement('div')
    col.classList.add('col-3')

    const card = document.createElement('div')
    card.classList.add('card')
    col.appendChild(card)

    const cardbody = document.createElement('div')
    cardbody.classList.add('card-body')
    card.appendChild(cardbody)

    const h5 = document.createElement('div')
    h5.classList.add('card-title', 'text-dark')
    h5.innerText = users.name
    cardbody.appendChild(h5)

    const p = document.createElement('div')
    p.classList.add('card-text', 'text-dark')
    p.innerText = users.email
    cardbody.appendChild(p)


    const pnumber = document.createElement('div')
    pnumber.classList.add('card-text', 'text-dark')
    pnumber.innerText = users.phone
    cardbody.appendChild(pnumber)


    const paddress = document.createElement('div')
    paddress.classList.add('card-text', 'text-dark')
    paddress.innerText = users.address.street + ' ' + users.address.city
    cardbody.appendChild(paddress)

    return col
}