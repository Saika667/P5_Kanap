/* ------------------------------------Variables et constantes------------------------------------ */
let cartItem = document.getElementById('cart__items');
let cart = localStorage.getItem('products');
let totalQuantityElt = document.getElementById('totalQuantity');
let totalPriceElt = document.getElementById('totalPrice');
let totalQuantity = 0;
let totalPrice = 0;
let deleteButton = document.getElementsByClassName('deleteItem');
let inputQuantity = document.getElementsByClassName('itemQuantity');
let inputFirstName = document.getElementById('firstName');
let inputLastName = document.getElementById('lastName');
let inputAddress = document.getElementById('address');
let inputCity = document.getElementById('city');
let inputEmail = document.getElementById('email');
let submitButton = document.getElementById('order');

/* -----------------------------------Regex---------------------------------- */
//string @ string . string (2 à 3 lettres)
let regexEmail = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
//uniquement des lettres et minimum 2
let regexNamesAndCity = new RegExp(/^[A-Za-z]{2,}$/);
//lettre et chiffres uniquement et minimum 10
let regexAddress = new RegExp(/^[0-9A-Za-z]{10,}$/);
/* -----------------------------------FIN Regex---------------------------------- */

/* ------------------------------------FIN Variables et constantes------------------------------------ */

//récupération des éléments dans le local storage et transformation de la string en objet (JSON.parse)
cart = JSON.parse(cart);

if (cart === null) {
    cartItem.innerHTML = `<h2>Le panier est vide !</h2>`;
}

for (let item of cart) {
    fetch("http://localhost:3000/api/products/" + item.id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        //création de l'élément HTML pour chaque article (id et couleur identique)
        .then(function(product) {
            let price = product.price;
            totalQuantity += item.quantity;
            //ou totalPrice = totalPrice + price * item.quantity;
            totalPrice += price * item.quantity;

            let element = `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                <div class="cart__item__img">
                    <img src="${item.image}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${item.title}</h2>
                        <p>${item.color}</p>
                        <p>${price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" data-old-value="${item.quantity}" value="${item.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
            cartItem.innerHTML += element;
            /*calcul quantité tot & calcul prix tot:
            à l'intérieur du "then" car "then" asynchrone, si on met à l'extéieur c'est 0
            car ça n'attend pas le retour du "then" pour retourner la valeur*/
            totalQuantityElt.innerText = totalQuantity;
            totalPriceElt.innerText = totalPrice;
        })
        .then(function() {
            //suppression de l'article si appuie sur bouton supprimer
            //boucle for car deleteButton est un tableau (getElementsByClassName)
            for (let i = 0; i < deleteButton.length; i++) {
                deleteButton[i].addEventListener('click', function() {
                    deleteProductFromCart(this);
                });
            }

            //modification de la quantité à partir du panier
            for (let i = 0; i < inputQuantity.length; i++) {
                inputQuantity[i].addEventListener('change', function(event) {
                    modifyQuantity(this, event);
                });
            }
        });
}

//permet de supprimer l'article dans le local storage et element HTML de la page panier
function deleteProductFromCart(element) {
    //permet de récupérer l'article du bloc de code "let element" dont fait partie le bouton supprimer
    let article = element.closest('article');
    /*dataset permet de réccupérer l'attribut custom type "data-id"
    on remplace "data-" de l'HTML par "dataset" dans le JS*/
    let productId = article.dataset.id;
    let productColor = article.dataset.color;

    /*Il faut récupérer l'input car l'élément html ciblé pour cette fonction est le bouton supprimé
    mais pour calculateTotal on a besoin de l'input contenant la quantité
    closest permet de remonter aux parentsen direction de la racine seulement, 
    utilisation de querySelector car itemQuantity est un enfant d'un des parents*/
    let input = element.closest('article').querySelector('.itemQuantity');
    console.log(input);
    let oldValue = input.dataset.oldValue;
    //parametre newQuantity = 0 car on supprime l'élément donc la valeur sera forcement 0
    calculateTotal(productId, oldValue, 0);

    //suppression de l'élément dans le local storage
    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].color === productColor) {
            cart.splice(j, 1);
            localStorage.setItem('products', JSON.stringify(cart));
        }
    }
    //suppression élément HTML
    article.remove();
}

//permet de modifier la quantité
function modifyQuantity(element, event) {
    let article = element.closest('article');
    let newQuantity = event.target.value;
    let productId = article.dataset.id;
    let productColor = article.dataset.color;

    //récupère l'attribut custom "data-old-value" de l'élément html
    let oldValue = element.dataset.oldValue;
    //mise à jour de oldValue
    element.dataset.oldValue = newQuantity;
    console.log(oldValue, newQuantity);
    calculateTotal(productId, oldValue, newQuantity);

    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].color === productColor) {
            cart[j].quantity = parseInt(newQuantity);
            localStorage.setItem('products', JSON.stringify(cart));
        }
    }
}

//permet de recalculer le nb d'article total et le prix total
function calculateTotal(productId, oldQuantity, newQuantity) {
    fetch("http://localhost:3000/api/products/" + productId)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(product) {
        let quantityDifference = newQuantity - oldQuantity;
        let price = product.price;
        let priceDifference = quantityDifference * price;
        
        totalQuantityElt.innerText = parseInt(totalQuantityElt.innerText) + quantityDifference;
        totalPriceElt.innerText = parseInt(totalPriceElt.innerText) + priceDifference;
    })
}
//permet de confirmer la commande
submitButton.addEventListener('click', function(evt) {
    //evite le chargement de la page au click du bouton
    evt.preventDefault();
    //récupère les valeurs des inputs
    let firstName = inputFirstName.value;
    let lastName = inputLastName.value;
    let address = inputAddress.value;
    let city = inputCity.value;
    let email = inputEmail.value;

    //création de l'objet contact
    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    };

    let products = JSON.parse(localStorage.getItem('products'));
    let productsIds = [];

    for (let product of products) {
        productsIds.push(product.id);
    }

    // création de l'objet body avec à l'intérieur l'objet contact et le tableau des id produits
    let body = {
        contact: contact,
        products: productsIds
    };

    /*POST permet d'envoyer des données à l'API
    headers permet de donner de l'information sur les données
    body est un objet mais on le transforme en string car API attend une string*/
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //JSON.stringify car l'API attend un array de string products-ID
        body: JSON.stringify(body)
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(order) {
        let orderId = order.orderId;
        /*permet de mettre orderId dans l'URL */
        document.location.href = "./confirmation.html?orderId=" + orderId;
    });
});

/*---------------------------------- Validation de donnée ---------------------------------*/
//focusout : lorsque le champs perd le focus
inputEmail.addEventListener('focusout', function() {
    let errorElement = document.getElementById('emailErrorMsg');
    // ! sert à la négation
    if (!regexEmail.test(this.value)) {
        errorElement.innerText = "Email erroné, merci de corriger.";
    } else {
        errorElement.innerText = "";
    }
});

inputFirstName.addEventListener('focusout', function() {
    let errorElement = document.getElementById('firstNameErrorMsg');
    if (!regexNamesAndCity.test(this.value)) {
        errorElement.innerText = "Prénom erroné, merci de corriger.";
    } else {
        errorElement.innerHTML = "";
    }
});

inputLastName.addEventListener('focusout', function() {
    let errorElement = document.getElementById('lastNameErrorMsg');
    if (!regexNamesAndCity.test(this.value)) {
        errorElement.innerText = "Nom erroné, merci de corriger.";
    } else {
        errorElement.innerHTML = "";
    }
});

inputCity.addEventListener('focusout', function() {
    let errorElement = document.getElementById('cityErrorMsg');
    if (!regexNamesAndCity.test(this.value)) {
        errorElement.innerText = "Ville erronée, merci de corriger.";
    } else {
        errorElement.innerText = "";
    }
});

inputAddress.addEventListener('focusout', function() {
    let errorElement = document.getElementById('addressErrorMsg');
    if (!regexAddress.test(this.value)) {
        errorElement.innerText = "Adresse erronée, merci de corriger.";
    } else {
        errorElement.innerText = "";
    }
});
/*---------------------------------- Validation de donnée ---------------------------------*/