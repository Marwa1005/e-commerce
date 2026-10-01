
// ==========================================
// VARIABLES
// ==========================================

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];

const cartBtn = document.getElementById("cartBtn");
const cart = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


// ==========================================
// MENU MOBILE
// ==========================================

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });

});


// ==========================================
// SEARCH
// ==========================================

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {

    searchBox.classList.add("active");

    searchInput.focus();

});

closeSearch.addEventListener("click", () => {

    searchBox.classList.remove("active");

    searchInput.value = "";

    showAllProducts();

});


searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll(".product").forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        if (name.includes(value)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

});


// ==========================================
// FILTRE PRODUITS
// ==========================================

const filters = document.querySelectorAll(".filter");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        const category = filter.dataset.filter;

        document.querySelectorAll(".product").forEach(product => {

            if (
                category === "all" ||
                product.dataset.category === category
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});


function showAllProducts() {

    document.querySelectorAll(".product").forEach(product => {
        product.style.display = "block";
    });

}


// ==========================================
// CATEGORIES
// ==========================================

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        document.querySelectorAll(".filter").forEach(filter => {

            filter.classList.remove("active");

            if (filter.dataset.filter === category) {
                filter.classList.add("active");
            }

        });

        document.querySelectorAll(".product").forEach(product => {

            if (product.dataset.category === category) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }

        });

        document
            .getElementById("boutique")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ==========================================
// FAVORIS
// ==========================================

document.querySelectorAll(".favorite").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        if (button.classList.contains("active")) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});


// ==========================================
// AJOUTER AU PANIER
// ==========================================

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existingProduct =
            cart.find(product => product.id === id);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });

        }

        saveCart();
        updateCart();

        openCart();

    });

});


// ==========================================
// SAUVEGARDER PANIER
// ==========================================

function saveCart() {

    localStorage.setItem(
        "novaCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// AFFICHER PANIER
// ==========================================

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <p>Votre panier est vide.</p>
            </div>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0 DH";

        return;

    }


    let total = 0;
    let count = 0;


    cart.forEach(product => {

        total += product.price * product.quantity;
        count += product.quantity;


        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div>

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ${product.price} DH
                </p>

                <div class="quantity">

                    <button
                        class="decrease"
                        data-id="${product.id}"
                    >
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        class="increase"
                        data-id="${product.id}"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-id="${product.id}"
            >
                Supprimer
            </button>

        `;

        cartItems.appendChild(item);

    });


    cartCount.textContent = count;

    cartTotal.textContent =
        `${total.toLocaleString("fr-FR")} DH`;


    addCartControls();

}


// ==========================================
// CONTROLES PANIER
// ==========================================

function addCartControls() {

    document.querySelectorAll(".increase").forEach(button => {

        button.addEventListener("click", () => {

            const product =
                cart.find(item => item.id === button.dataset.id);

            product.quantity++;

            saveCart();
            updateCart();

        });

    });


    document.querySelectorAll(".decrease").forEach(button => {

        button.addEventListener("click", () => {

            const product =
                cart.find(item => item.id === button.dataset.id);

            product.quantity--;

            if (product.quantity <= 0) {

                cart = cart.filter(
                    item => item.id !== button.dataset.id
                );

            }

            saveCart();
            updateCart();

        });

    });


    document.querySelectorAll(".remove-item").forEach(button => {

        button.addEventListener("click", () => {

            cart = cart.filter(
                item => item.id !== button.dataset.id
            );

            saveCart();
            updateCart();

        });

    });

}


// ==========================================
// OUVRIR / FERMER PANIER
// ==========================================

function openCart() {

    cart.classList.add("active");
    cartOverlay.classList.add("active");

}

function closeCartPanel() {

    cart.classList.remove("active");
    cartOverlay.classList.remove("active");

}

cartBtn.addEventListener("click", openCart);

closeCart.addEventListener(
    "click",
    closeCartPanel
);

cartOverlay.addEventListener(
    "click",
    closeCartPanel
);


// ==========================================
// CHECKOUT
// ==========================================

const checkoutBtn =
    document.getElementById("checkoutBtn");

const modalOverlay =
    document.getElementById("modalOverlay");

const closeModal =
    document.getElementById("closeModal");


checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Votre panier est vide.");

        return;

    }

    modalOverlay.classList.add("active");

});


closeModal.addEventListener("click", () => {

    modalOverlay.classList.remove("active");

});


// ==========================================
// CONFIRMATION COMMANDE
// ==========================================

const checkoutForm =
    document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", event => {

    event.preventDefault();

    alert(
        "Merci pour votre commande ! " +
        "Votre demande a bien été enregistrée."
    );

    cart = [];

    saveCart();
    updateCart();

    checkoutForm.reset();

    modalOverlay.classList.remove("active");

    closeCartPanel();

});


// ==========================================
// FORMULAIRE CONTACT
// ==========================================

const contactForm =
    document.getElementById("contactForm");

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    alert(
        "Merci ! Votre message a bien été envoyé."
    );

    contactForm.reset();

});


// ==========================================
// INITIALISATION
// ==========================================

updateCart();

