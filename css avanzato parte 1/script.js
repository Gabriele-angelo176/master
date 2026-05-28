
const twitterToRemove =document.querySelector('div.p-4:nth-of-type(3) li:nth-of-type(2) a')
twitterToRemove.remove()



const deleteLinks = document.querySelectorAll('.stretched-link')




for (const link of deleteLinks){
    link.addEventListener("click",()=>{
        link.parentElement.parentElement.remove()
    })
}



const authors = document.querySelectorAll('p.blog-post-meta a');

for (const author of authors){
    author.addEventListener("mouseover", ()=>{
        showAlert(author.innerText)
    })
}

function showAlert(text) {
    alert(text)
}