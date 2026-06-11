  document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Evita il refresh della pagina

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const successMsg = document.getElementById('successMsg');
        const errorMsg = document.getElementById('errorMsg');

        // Reset messaggi
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        // Controllo campi
        if (name && email && message && email.includes('@')) {
            successMsg.style.display = 'block';
            // Qui potresti inviare i dati a un server con fetch/AJAX
            this.reset();
        } else {
            errorMsg.style.display = 'block';
        }
    }); 
    /* il bottone per collassare la sezione */
    const toggleSection = (btn) => {
  const content = btn.nextElementSibling; // Assumendo il contenuto sia dopo il bottone
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
};
/* contare il numero di vaiggi  */
const countViaggi = () => {
  const viaggi = document.querySelectorAll('.viaggio').length;
  console.log(`Ci sono ${viaggi} viaggi nella pagina.`);
  return viaggi;
};
/* vializza il click sul contattaci */
const countViaggi = () => {
  const viaggi = document.querySelectorAll('.viaggio').length;
  console.log(`Ci sono ${viaggi} viaggi nella pagina.`);
  return viaggi;
 
};
/* rimuore tutte le card */
const removeAllCards = () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.remove());
};
