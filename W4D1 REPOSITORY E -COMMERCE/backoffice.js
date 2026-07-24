const BACKOFFICE_STORAGE_KEY = "backofficeProducts";
const API_URL = "https://fakestoreapi.com/products"; // se hai un altro endpoint, sostituiscilo qui
const API_TOKEN = localStorage.getItem("apiToken") || "INSERISCI_IL_TOKEN";

const getApiHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`
});

const buildApiUrl = (id = null) => {
    if (id === null || id === undefined || id === "") return API_URL;
    return `${API_URL}/${encodeURIComponent(id)}`;
};

const getProductId = (item) => item._id || item.id || item?.productId || item?.localId || "";
const getProductName = (item) => item.name || item.title || item?.title || "Prodotto";
const getProductImage = (item) => item.imageUrl || item.image || item.image || "https://via.placeholder.com/100x80?text=Immagine";
const getProductDescription = (item) => item.description || item.body || "Nessuna descrizione.";
const getProductCategory = (item) => item.category || item.brand || "Categoria non disponibile";
const getProductPrice = (item) => typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;

const loadStoredProducts = () => {
    try {
        const stored = localStorage.getItem(BACKOFFICE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveStoredProducts = (items) => {
    try {
        localStorage.setItem(BACKOFFICE_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.warn("Impossibile salvare l'elenco backoffice.", error);
    }
};

const renderBackofficeList = (items) => {
    const list = document.getElementById("backoffice-list");
    if (!list) return;

    if (!items.length) {
        list.innerHTML = `<div class="list-group-item">Nessun articolo disponibile. Aggiungi un prodotto usando il form.</div>`;
        return;
    }

    list.innerHTML = items.map((item) => {
        const imageUrl = getProductImage(item);
        const name = getProductName(item);
        const category = getProductCategory(item);
        const price = getProductPrice(item).toFixed(2);
        const id = getProductId(item) || `local-${Date.now()}`;

        return `
            <div class="list-group-item d-flex align-items-start gap-3">
                <a href="detail.html?id=${id}" class="flex-grow-1 d-flex gap-3 text-decoration-none text-dark">
                    <img src="${imageUrl}" alt="${name}" class="rounded" style="width:100px;height:80px;object-fit:cover;">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="mb-1">${name}</h5>
                                <p class="mb-1 text-muted">${category}</p>
                            </div>
                            <span class="badge bg-primary rounded-pill">€${price}</span>
                        </div>
                        <p class="mb-0">${getProductDescription(item).slice(0, 120)}${getProductDescription(item).length > 120 ? '...' : ''}</p>
                    </div>
                </a>
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${id}">Modifica</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${id}">Elimina</button>
                </div>
            </div>
        `;
    }).join("");
};

const addProduct = (product) => {
    product.title = product.title || product.name;
    product.name = product.name || product.title;

    const storedProducts = loadStoredProducts();
    storedProducts.unshift(product);
    saveStoredProducts(storedProducts);

    try {
        const mainKey = 'products';
        const mainStored = JSON.parse(localStorage.getItem(mainKey) || '[]');
        mainStored.unshift(product);
        localStorage.setItem(mainKey, JSON.stringify(mainStored));
    } catch (e) {
        console.warn('Impossibile aggiornare products in localStorage', e);
    }

    renderBackofficeList(storedProducts);
};

const updateProduct = (id, updatedProduct) => {
    const storedProducts = loadStoredProducts();
    const updatedList = storedProducts.map((item) => {
        const currentId = String(getProductId(item) || item.localId || "");
        return currentId === String(id) ? { ...item, ...updatedProduct, id: currentId, title: updatedProduct.title || updatedProduct.name, name: updatedProduct.name || updatedProduct.title } : item;
    });
    saveStoredProducts(updatedList);

    try {
        const mainKey = 'products';
        const mainStored = JSON.parse(localStorage.getItem(mainKey) || '[]');
        const updatedMain = mainStored.map((item) => {
            const currentId = String(getProductId(item) || item.localId || "");
            return currentId === String(id) ? { ...item, ...updatedProduct, id: currentId, title: updatedProduct.title || updatedProduct.name, name: updatedProduct.name || updatedProduct.title } : item;
        });
        localStorage.setItem(mainKey, JSON.stringify(updatedMain));
    } catch (e) {
        console.warn('Impossibile aggiornare products in localStorage', e);
    }

    renderBackofficeList(updatedList);
};

const deleteProduct = async (id) => {
    try {
        await fetch(buildApiUrl(id), {
            method: "DELETE",
            headers: getApiHeaders()
        });
    } catch (error) {
        console.warn("Eliminazione remota fallita, uso il fallback locale.", error);
    }

    const storedProducts = loadStoredProducts().filter((item) => String(getProductId(item) || item.localId || "") !== String(id));
    saveStoredProducts(storedProducts);

    try {
        const mainKey = 'products';
        const mainStored = JSON.parse(localStorage.getItem(mainKey) || '[]').filter((item) => String(getProductId(item) || item.localId || "") !== String(id));
        localStorage.setItem(mainKey, JSON.stringify(mainStored));
    } catch (e) {
        console.warn('Impossibile aggiornare products in localStorage', e);
    }

    renderBackofficeList(storedProducts);
};

const showAlert = (message, type = 'success', timeout = 3000) => {
    const container = document.getElementById('backoffice-alert');
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    if (timeout) setTimeout(() => { container.innerHTML = ''; }, timeout);
};

const postProduct = async (payload) => {
    try {
        const response = await fetch(buildApiUrl(), {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`POST failed: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Post prodotto fallito', error);
        throw error;
    }
};

const putProduct = async (id, payload) => {
    try {
        const response = await fetch(buildApiUrl(id), {
            method: 'PUT',
            headers: getApiHeaders(),
            body: JSON.stringify({ ...payload, id })
        });

        if (!response.ok) {
            throw new Error(`PUT failed: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Put prodotto fallito', error);
        throw error;
    }
};

const fetchProducts = async () => {
    try {
        const response = await fetch(buildApiUrl(), {
            method: "GET",
            headers: getApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

const initBackoffice = async () => {
    const storedProducts = loadStoredProducts();
    const apiProducts = await fetchProducts();

    const listToShow = [...storedProducts, ...apiProducts].slice(0, 50);
    renderBackofficeList(listToShow);

    const form = document.getElementById("product-form");
    if (!form) return;

    let editingId = null;
    const submitBtn = document.getElementById('product-submit');

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const description = document.getElementById("description").value.trim();
        const brand = document.getElementById("brand").value.trim();
        const category = document.getElementById("category").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim();
        const price = parseFloat(document.getElementById("price").value);

        if (!name || Number.isNaN(price)) {
            alert("Compila almeno il nome e il prezzo del prodotto.");
            return;
        }

        const payload = {
            id: editingId || `local-${Date.now()}`,
            title: name,
            price,
            description,
            category: category || 'generale',
            image: imageUrl || "https://via.placeholder.com/400x300?text=Prodotto"
        };

        const spinner = document.getElementById('backoffice-spinner');
        if (spinner) spinner.classList.remove('d-none');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const saved = editingId ? await putProduct(editingId, payload) : await postProduct(payload);

            const savedProduct = {
                id: saved.id || saved._id || editingId || `remote-${Date.now()}`,
                title: saved.title || payload.title,
                name: saved.title || payload.title,
                price: saved.price || payload.price,
                description: saved.description || payload.description,
                category: saved.category || payload.category,
                image: saved.image || payload.image
            };

            if (editingId) {
                updateProduct(editingId, savedProduct);
                showAlert('Prodotto aggiornato.', 'success');
            } else {
                addProduct(savedProduct);
                showAlert('Prodotto salvato correttamente.', 'success');
            }
        } catch (e) {
            const localProduct = {
                id: editingId || `local-${Date.now()}`,
                title: payload.title,
                name: payload.title,
                price: payload.price,
                description: payload.description,
                category: payload.category,
                image: payload.image,
                localId: editingId || `local-${Date.now()}`
            };

            if (editingId) {
                updateProduct(editingId, localProduct);
                showAlert('Prodotto aggiornato in locale (fallback).', 'warning');
            } else {
                addProduct(localProduct);
                showAlert('Prodotto salvato in locale (fallback).', 'warning');
            }
        } finally {
            if (spinner) spinner.classList.add('d-none');
            if (submitBtn) submitBtn.disabled = false;
            editingId = null;
            form.reset();
            if (submitBtn) submitBtn.textContent = 'Aggiungi articolo';
        }
    });

    document.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-btn');
        const deleteButton = event.target.closest('.delete-btn');

        if (editButton) {
            const id = editButton.dataset.id;
            const products = loadStoredProducts();
            const product = products.find((item) => String(getProductId(item) || item.localId || "") === String(id));
            if (!product) return;

            editingId = id;
            document.getElementById('name').value = getProductName(product);
            document.getElementById('description').value = getProductDescription(product);
            document.getElementById('category').value = getProductCategory(product);
            document.getElementById('imageUrl').value = getProductImage(product);
            document.getElementById('price').value = getProductPrice(product);
            document.getElementById('brand').value = product.brand || '';
            if (submitBtn) submitBtn.textContent = 'Salva modifiche';
            showAlert('Modifica in corso. Completa il form e salva.', 'info', 2500);
        }

        if (deleteButton) {
            const id = deleteButton.dataset.id;
            deleteProduct(id);
            showAlert('Prodotto eliminato.', 'danger');
        }
    });
};

window.addEventListener("DOMContentLoaded", initBackoffice);

