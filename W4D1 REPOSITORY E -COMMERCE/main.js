const API_URL = "https://fakestoreapi.com/products";
const API_TOKEN = localStorage.getItem("apiToken") || "INSERISCI_IL_TOKEN";

const getApiHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`
});

/* Queste funzioni trasformano i dati dell’API in valori usabili dal codice.
Servono perché diverse API possono chiamare i campi in modo diverso (title vs name, image vs imageUrl).
In questo modo il resto del codice non deve controllare sempre ogni possibile nome di campo. */

const getProductId = (item) => item._id || item.id || item?.productId || "";
const getProductName = (item) => item.name || item.title || "Prodotto";
const getProductImage = (item) => item.imageUrl || item.image || "https://via.placeholder.com/400x300?text=Prodotto";
const getProductDescription = (item) => item.description || item.body || "Descrizione non disponibile.";
const getProductPrice = (item) => typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;


/* renderProducts prende un array di items (prodotti).
Cerca l’elemento HTML con id="products-container".
Costruisce l’HTML di ogni prodotto con map() e lo inserisce dentro container.innerHTML. */

const renderProducts = (items) => {
    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = items.map((item) => {
        const productId = getProductId(item);
        const imageUrl = getProductImage(item);
        const description = getProductDescription(item).slice(0, 100);
        const name = getProductName(item);
        const price = getProductPrice(item).toFixed(2);


/* col-12 col-md-6 col-lg-4: Bootstrap responsive. In una riga:
su mobile prende tutta la larghezza,
su tablet prende metà,
su desktop prende un terzo.
La card è il contenitore di ogni prodotto.
mt-auto spinge il pulsante in basso, mantenendo le card alte uguali.
Il link detail.html?id=${productId} è fondamentale:
passa l’id del prodotto alla pagina di dettaglio,
poi detail.js lo legge e mostra il prodotto giusto.
 */
        return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card product-card h-100 shadow-sm">
                    <img src="${imageUrl}" class="card-img-top" alt="${name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}${getProductDescription(item).length > 100 ? '...' : ''}</p>
                        <div class="mt-auto">
                            <p class="fw-bold mb-3">€${price}</p>
                            <a href="detail.html?id=${productId}" class="btn btn-primary w-100">Vedi dettagli</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
};

/* Salva l’elenco in memoria del browser come stringa JSON.
Serve per avere i dati anche se la chiamata API fallisce dopo il primo caricamento. */

const saveProducts = (items) => {
    try {
        localStorage.setItem("products", JSON.stringify(items));
    } catch (error) {
        console.warn("Impossibile salvare i prodotti in localStorage.", error);
    }
};

/* Legge i prodotti salvati.
Se non ci sono o c’è un errore, torna un array vuoto.
 */
const loadStoredProducts = () => {
    try {
        const stored = localStorage.getItem("products");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};



/* fetch(API_URL) chiede i prodotti.

Se la risposta è OK, prende i dati con response.json().

Poi:

salva i prodotti in localStorage,
chiama renderProducts(data) per mostrarli.
Se la fetch fallisce:

tenta di usare i prodotti salvati (fallbackData);
se anche quelli mancano, mostra un messaggio di errore. */

const getProducts = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();
        saveProducts(data);
        renderProducts(data);
    } catch (error) {
        console.error(error);
        const fallbackData = loadStoredProducts();
        if (fallbackData.length) {
            renderProducts(fallbackData);
        } else {
            document.getElementById("products-container").innerHTML = "<p>Impossibile caricare i prodotti. Riprova più tardi.</p>";
        }
    }
};


/* Il codice parte quando la pagina è pronta.
Non serve cliccare nulla: appena index.html viene caricata, chiama getProducts(). */

window.addEventListener("DOMContentLoaded", getProducts);