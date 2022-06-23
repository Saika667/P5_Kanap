let orderElement = document.getElementById('orderId');

/* récupération de la valeur de l'orderId dans l'URL */
let url = window.location.href;
url = new URL(url);
let orderId = url.searchParams.get("orderId");
/* FIN récupération de la valeur de l'orderId dans l'URL */

console.log(orderId);

orderElement.innerText = orderId;