
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Prendo gli elementi dall'HTML
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    // 2. Gestisco il click sul bottone per mostrare/nascondere il menu
    profileBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // 3. Chiudo il menu se l'utente clicca da un'altra parte della pagina
    window.addEventListener('click', function() {
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
    });

});
