const API_URL = "https://fakestoreapi.com/products";
const API_TOKEN = localStorage.getItem("apiToken") || "INSERISCI_IL_TOKEN";

const getApiHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`
});

const getQueryId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

const getProductId = (item) => item._id || item.id || item?.productId || "";
const getProductName = (item) => item.name || item.title || "Prodotto";
const getProductImage = (item) => item.imageUrl || item.image || "https://via.placeholder.com/600x400?text=Immagine+prodotto";
const getProductDescription = (item) => item.description || item.body || "Descrizione non disponibile.";
const getProductCategory = (item) => item.category || item.brand || "Categoria non disponibile";
const getProductPrice = (item) => typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;

const renderProductDetail = (item) => {
    const container = document.getElementById("product-detail");
    if (!container) return;

    const imageUrl = getProductImage(item);
    const name = getProductName(item);
    const category = getProductCategory(item);
    const description = getProductDescription(item);
    const price = getProductPrice(item).toFixed(2);

    container.innerHTML = `
        <div class="col-12 col-lg-6">
            <img src="${imageUrl}" alt="${name}" class="img-fluid rounded shadow-sm">
        </div>
        <div class="col-12 col-lg-6">
            <div class="card border-0">
                <div class="card-body p-0">
                    <h2 class="card-title">${name}</h2>
                    <p class="text-muted mb-1">${category}</p>
                    <h3 class="text-primary">€${price}</h3>
                    <p class="mt-4">${description}</p>
                    <ul class="list-group list-group-flush mb-4">
                        <li class="list-group-item"><strong>ID:</strong> ${getProductId(item)}</li>
                        <li class="list-group-item"><strong>Prezzo:</strong> €${price}</li>
                    </ul>
                    <a href="index.html" class="btn btn-secondary">Torna indietro</a>
                </div>
            </div>
        </div>
    `;
};

const renderError = (message) => {
    const container = document.getElementById("product-detail");
    if (!container) return;
    container.innerHTML = `<div class="col-12"><div class="alert alert-danger" role="alert">${message}</div></div>`;
};

const loadStoredProducts = () => {
    try {
        const stored = localStorage.getItem("products");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const fetchProductById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: getApiHeaders()
    });
    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
    }
    return response.json();
};

const showDetail = async () => {
    const id = getQueryId();
    if (!id) {
        renderError("ID prodotto mancante nella query string.");
        return;
    }

    const products = loadStoredProducts();
    const storedProduct = products.find((product) => {
        const productId = String(product._id || product.id || product.localId || "");
        return productId === String(id);
    });

    if (storedProduct) {
        renderProductDetail(storedProduct);
        return;
    }

    try {
        const item = await fetchProductById(id);
        renderProductDetail(item);
    } catch (error) {
        console.error(error);
        renderError("Impossibile trovare il prodotto. Ricarica la pagina dal catalogo o riprova più tardi.");
    }
};

window.addEventListener("DOMContentLoaded", showDetail);
