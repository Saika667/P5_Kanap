let orderElement = document.getElementById('orderId');

/* récupération de l'id dans l'URL */
let url = window.location.href;
url = new URL(url);
let orderId = url.searchParams.get("orderId");

console.log(orderId);

orderElement.innerText = orderId;