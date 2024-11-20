const btnLogin = document.getElementById("btnLogin"); // Boton de inicio de sesion. 
const btnCar = document.getElementById("btnCar"); // Boton de carrito.
const url_products = "http://127.0.0.1:5000/productos"; // URL de la API para obtener


document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); //Obtener valor segun estado de sesion.
    const idRol = localStorage.getItem("userRole"); //Obtener valor segun rol del usuario.

    UserContent(idRol);
    cargar_sugerencias(idRol);
    
    if(isLoggedIn === "true"){
        btnLogin.textContent = "Cerrar Sesión";
        btnLogin.style.color = "red";
    }else{
        btnLogin.textContent = "Iniciar Sesión";
        btnLogin.style.color = "green";
    }
});


//botn para sesion
btnLogin.addEventListener("click", function(){
    if(btnLogin.textContent== "Cerrar Sesión"){

        // cerrar sesion
        localStorage.removeItem("isLoggedIn");
        localStorage.setItem("isLoggedIn", "false");
        
        // remover rol
        localStorage.removeItem("userRole");
        localStorage.setItem("userRole", 2);
    }
});

//Boton para carrito
btnCar.addEventListener("click", function(event){
    event.preventDefault();
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === "true") {
        window.location.href = "./carrito.html";
    } else {
        verificarSesion(); 
    }
});


function UserContent(idRol){
    const btnInventory = document.getElementById("btnInventory"); //Boton de inventario.
    const btnCar = document.getElementById("btnCar"); //Boton de usuarios.

    if(idRol === "1"){
        btnInventory.style.display = "block";
        btnCar.style.display = "none";
    }else{
        btnInventory.style.display = "none";
        btnCar.style.display = "block";
    }

}

async function cargar_sugerencias(idRol) {
    try {
        const url_con_filtro = `${url_products}?ventas_orden=desc`;

        const respuesta = await fetch(url_con_filtro, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (respuesta.ok) {
            const data = await respuesta.json();

            // Verificar si la respuesta contiene productos
            if (data["productos"] && Array.isArray(data["productos"]) && data["productos"].length > 0) {
                const productos = data["productos"];

                const primerosProductos = productos.slice(0, 10);
                const productList = document.getElementById("products-list");
                
                productList.innerHTML = "";

                primerosProductos.forEach(producto => {
                    // Crear el contenedor de cada producto
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");

                    // Crear y añadir la imagen 
                    const img = document.createElement("img");
                    img.src = "./Assets/Galeria/" + producto.ImagenProducto;
                    img.alt = producto.NombreProducto;
                    productItem.appendChild(img);

                    // Crear y añadir el nombre del producto
                    const productName = document.createElement("h3");
                    productName.textContent = producto.NombreProducto;
                    productItem.appendChild(productName);

                    // Crear y añadir la categoría
                    const categoryName = document.createElement("p");
                    categoryName.textContent = producto.NombreCategoria;
                    categoryName.classList.add("category-text");
                    productItem.appendChild(categoryName);
                    
                    // Crear y añadir el precio
                    const price = document.createElement("p");
                    price.textContent = `$${parseFloat(producto.PrecioProducto)}`; 
                    price.classList.add("price-text");
                    productItem.appendChild(price);

                    if(idRol === "2"){
                        // Crear y añadir el botón de compra
                        const button = document.createElement("button");
                        button.classList.add("btn-primary");
                        button.innerHTML = `Añadir al Carrito <i class="fas fa-shopping-cart"></i>`;
                        productItem.appendChild(button);

                        button.addEventListener('click', function() {
                            agregarAlCarrito(producto.IdProducto, 1);
                        });
                    }

                    // Agregar el producto a la lista
                    productList.appendChild(productItem);
                });
            } else {
                console.log('No se encontraron productos');
            }
        } else {
            console.error('Error en la respuesta del servidor', respuesta.status);
        }
    } catch (error) {
        console.error('Error al cargar las sugerencias', error);
    }
}


// Función para agregar producto al carrito
async function agregarAlCarrito(idProducto, CantidadProducto) {
    try {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if(isLoggedIn === "true"){

            const idUsuario = localStorage.getItem('userId');

            const datos = {
                IdUsuario: idUsuario,
                IdProducto: idProducto,
                CantidadProducto: CantidadProducto
            };

            const respuesta = await fetch('http://127.0.0.1:5000/agregar_carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                console.log(data.message);
                alert("Producto añadido al carrito correctamente");
            } else {
                console.error('Error al agregar producto al carrito', respuesta.status);
            }
        }else{

            verificarSesion();
        }

        
    } catch (error) {
        console.error('Error en la solicitud de agregar al carrito', error);
    }
}

function verificarSesion() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        window.location.href = "./login.html";
    }
}
