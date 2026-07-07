// ecasxNTFhRSdgSureV69u6c2ulrNbQ9dmObMa4KkQOoGIyHBZFxjodfE


// http://api.pixels.com/v1/search?query=inserisciquery


/*
1  costruire funzione per fare la fecht
2 funzione per ciclare i risulatti e appenderli al  dom
3 fuinzione prendendo come parametro unn immagine andiamo a creare un dom necessario
*/

const row =document.getElementById('imagebox')
const srcbar=document.getElementById('srcbar')
const srcbtn=document.getElementById('srcbtn')

 srcbtn.addEventListener("click",(e)=>{
const srcstring=srcbar.value 
getimages(srcstring)

 })

const imagebox = document.getElementById('imagebox')
async function getimages(search="cane") {
    try {
        const result = await fetch('https://api.pexels.com/v1/search?query='+search, {
            headers: {
                Authorization: 'ecasxNTFhRSdgSureV69u6c2ulrNbQ9dmObMa4KkQOoGIyHBZFxjodfE'
            }
        })

        const data = await result.json()

        displayimages(data.photos)
    } catch (e) {
        console.log(e);
    }
}


getimages()


function displayimages(images) {
    row.innerHTML=""
    const imagescard = images.map(image => createimagecard(image))
    imagescard.forEach(imagescard => imagebox.appendChild(imagescard));

}



/*
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
  </div>
</div>
*/

const createimagecard = (image) => {
    const col = document.createElement('div')
    col.classList.add('col-3')
    const card = document.createElement('div')
    card.classList.add('card')
    col.appendChild(card)
    const img = document.createElement('img')
    img.classList.add(card - img - top)
    img.src = image.src.small
    img.alt = image.alt
    card.appendChild(img)
    const cardbody = document.createElement('div')
    cardbody.classList.add('card-body')
    card.appendChild(cardbody)
    const p = document.createElement('p')
    p.classList.add('cardbody')
    p.innerText=image.photographer
    cardbody.appendChild(p)
    return col

}

