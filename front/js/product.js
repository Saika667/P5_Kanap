/* variables */
let image = document.getElementsByClassName('item__img');
let title = document.getElementById('title');
let description = document.getElementById('description');
let price = document.getElementById('price');
let colorInput = document.getElementById('colors');
let quantity = document.getElementById('quantity');
let button = document.getElementById('addToCart');
/* FIN variables */

/* récupération de l'id dans l'URL */
let url = window.location.href;
url = new URL(url);
let id = url.searchParams.get("id");
/* FIN récupération de l'id dans l'URL */

function getProduct(productId) {
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(product) {
            let imageElement = document.createElement('img');
            imageElement.src = product.imageUrl;
            imageElement.alt = product.altTxt;
            imageElement.id = "productImage";
            image[0].appendChild(imageElement);

            title.innerText = product.name;

            description.innerText = product.description;

            price.innerText = product.price;
            
            for (let color of product.colors) {
                let option = document.createElement('option');
                option.value = color;
                option.innerText = color;

                colorInput.appendChild(option);
            }
           console.log(product);
        })
}
getProduct(id);

// ajout au local storage à chaque click
button.addEventListener('click', function() {
    let color = colorInput.value;
    let quantityValue = parseInt(quantity.value);
    let element =  document.getElementsByClassName('item__content')[0];
    let statusMsg = document.getElementById('status-msg');

    
    /*----------Validation de donnée----------*/
    if (!statusMsg) {
        let h2 = document.createElement('h2');
        h2.id = "status-msg";
        element.appendChild(h2);
        statusMsg = document.getElementById('status-msg');
    }
    
    //vérification qu'une couleur est sélectionnée et que la quantité n'est pas égale à 0
    if (color === "" || quantityValue === 0) {
        statusMsg.innerText = "Sélectionner une couleur et une quantité avant d'ajouter l'article à votre panier.";
        return false;
    }

    //si un message de status est déjà présent, ce if permet de remettre à zéro le contenu
    if (statusMsg) {
        statusMsg.innerText = "";
    }
    /*----------FIN Validation de donnée----------*/

    //création d'un objet avec système de clé-valeur
    let productOrder = {
        id: id,
        //parseInt pour définir un entier et non pas une string
        quantity: quantityValue,
        image: document.getElementById('productImage').src,
        title: title.innerText,
        color : color
    };
    /* création de la variable cart
    getItem sert à récupérer une valeur stocké dans local storage
    "products" est la clé dans le local storage (local storage fonctionne avec un système de clé-valeur)
    on récupère d'abord car si on utilise juste setItem on écrase le premier objet dans le local storage
    */
    let cart = localStorage.getItem('products');

    /* création des cas particuliers :
    cart === null, on se situe dans le cas du premier click
    si on initie pas cart avec un tableau vide -> erreur car on récupère un objet vide
    else, on se situe dans le cas d'après le premier click (deuxième, troisième etc...)
    pour ajouter un objet dans un local storage il faut être sous forme de string sinon erreur
    si on est sous forme de string lors de l'ajout dans le tableau (push) ->erreur "is not a function"
    transformation de string en objet ->JSON.parse
    */
    if(cart === null) {
        cart = [];
    } else {
        cart = JSON.parse(cart);
    }
    // variable sert à savoir si on est entré on non dans le if de la boucle for
    let newItem = true;
    //sert à vérifier si le produit ajouter existe déjà dans le local storage si oui incrémentation de la quantité
    for (let produit of cart) {
        if (productOrder.title === produit.title && productOrder.color === produit.color) {
            produit.quantity += productOrder.quantity;
            newItem = false;
        }
    }

    if (newItem === true) {
        // on ajoute l'objet dans le tableau initier au premier click
        cart.push(productOrder);
    }

    /* setItem ajout d'un objet dans local storage
    objet transformé en string car local storage n'accepte que des strings
    */
    localStorage.setItem('products', JSON.stringify(cart));
    statusMsg.innerText = "L'article a bien été ajouté à votre panier.";
})


