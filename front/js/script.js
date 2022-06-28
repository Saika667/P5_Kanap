/* Variables et constantes */
let itemsContainer = document.getElementById('items');

/* FIN Variables et constantes */

//cette fonction sert à récupérer les produits depuis l'API
function getProductList() {
    fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(products) {
            for (let product of products) { 
                insertProductInHtml(product);
            }
        });
}
getProductList();

// cette fonction sert à ajouter l'élément HTML pour chaque produit
function insertProductInHtml(product) {
    let anchor = document.createElement('a');
    anchor.href = "./product.html?id=" + product._id;

    let article = document.createElement('article');
    let image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.altTxt;

    let title = document.createElement('h3');
    title.classList.add("productName");
    title.innerText = product.name;

    let paragraph = document.createElement('p');
    paragraph.classList.add("productDescription");
    paragraph.innerText = product.description;

    let price = document.createElement('p');
    price.classList.add("price");
    price.innerText = "Prix = " + product.price + "€";

    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(paragraph);
    article.appendChild(price);
    anchor.appendChild(article);

    itemsContainer.appendChild(anchor);
}

/*<section class="items" id="items"> 
    <!--<a href="./product.html?id=42">
        <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
    </a> -->
</section>*/