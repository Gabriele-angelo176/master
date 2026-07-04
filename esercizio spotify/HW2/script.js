//creare una funzioneche fa la fetch dal api 
//creare una funzione che fa il ciclo dei risultati ricevendo come parametro un array di canzoni
//creare una funzione che dato un canzone come parametro crea la card nel html
const searchbox=document.getElementById('searchResults')
function getsongs(){
fetch('https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem')
.then(result=>result.json())
.then(songs=> listsongs(songs.data))
.catch(error=> console.log(error))
}
getsongs()

function listsongs(songs){
    for(const song of songs){
        const card=cardsongs(song)
        console.log(card);
       searchbox.appendChild(card) 
    }

}

function cardsongs(song){
const col=document.createElement('div')
col.classList.add('col-3')
const card=document.createElement('div')
card.classList.add('card')
col.appendChild(card)
const img=document.createElement('img')
img.classList.add('card-img-top')
img.src=song.album.cover_small
card.appendChild(img)
const cardbody=document.createElement('div')
cardbody.classList.add('card-body')
card.appendChild(cardbody)
const h5=document.createElement('h5')
h5.classList.add('card-title','text-dark')
h5.innerText=song.title
cardbody.appendChild(h5)
const p=document.createElement('p')
p.classList.add('card-text','text-dark')
p.innerText=song.artist.name
cardbody.appendChild(p)
const a=document.createElement('a')
a.classList.add('btn','btn-primary')
a.innerText='Link'
a.href=song.link
cardbody.appendChild(a)
return col
}
