const btnLogin = document.getElementById("btnLogin"); // Boton de inicio de sesion. 
const url_products = "http://127.0.0.1:5000/productos"; // URL de la API para obtener


document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); //Obtener valor segun estado de sesion.
    const idRol = localStorage.getItem("userRole"); //Obtener valor segun rol del usuario.

    UserContent(idRol);
    
    if(isLoggedIn === "true" && idRol === "1"){
        btnLogin.textContent = "Cerrar Sesión";
        btnLogin.style.color = "red";
        
        // si esta log
        cargar_productos(idRol);
    }else{
        btnLogin.textContent = "Iniciar Sesión";
        btnLogin.style.color = "green";

        // Si no esta log
        window.location.href = "./login.html"; 
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

// Contenido de rol
function UserContent(idRol) {
    const btnInventory = document.getElementById("btnInventory"); // Boton de inventario.
    const btnCar = document.getElementById("btnCar"); // Boton de usuarios.

    if (idRol === "1") {
        btnInventory.style.display = "block";
        btnCar.style.display = "none";
    } else {
        btnInventory.style.display = "none";
        btnCar.style.display = "block";
    }
}

// Cargar productos
async function cargar_productos(idRol) {
    try {

        // Realizar la petición
        const respuesta = await fetch(url_products, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (respuesta.ok) {
            const data = await respuesta.json();

            // Verificar si la respuesta contiene productos
            if (data["productos"] && Array.isArray(data["productos"]) && data["productos"].length > 0) {
                const productos = data["productos"];
                const productList = document.getElementById("productos-container");

                // Limpiar la lista de productos
                productList.innerHTML = "";

                productos.forEach(producto => {
                    // Crear el contenedor de cada producto
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");
                
                    // Crear y añadir la imagen 
                    const img = document.createElement("img");
                    img.src = "./Assets/Galeria/" + producto.ImagenProducto;
                    img.alt = producto.NombreProducto;
                    productItem.appendChild(img);
                
                    // Crear y añadir el nombre del producto
                    const productName = document.createElement("p");
                    productName.textContent = `Nombre: ${producto.NombreProducto}`;
                    productName.classList.add("name-text");
                    productItem.appendChild(productName);
                
                    // Crear y añadir la categoría
                    const categoryName = document.createElement("p");
                    categoryName.textContent = `Nombre: ${producto.NombreCategoria}`;
                    categoryName.classList.add("category-text");
                    productItem.appendChild(categoryName);
                
                    // Crear y añadir la descripción
                    const description = document.createElement("p");
                    description.textContent = `Descripción: ${producto.DescripcionProducto}`;
                    description.classList.add("description-text");
                    productItem.appendChild(description);
                
                    // Crear y añadir el precio
                    const price = document.createElement("p");
                    price.textContent = `Precio: $${parseFloat(producto.PrecioProducto).toFixed(2)}`;
                    price.classList.add("price-text");
                    productItem.appendChild(price);
                
                    // Crear y añadir el stock
                    const stock = document.createElement("p");
                    stock.textContent = `Stock: ${producto.StockProducto}`;
                    stock.classList.add("stock-text");
                    productItem.appendChild(stock);
                
                    // Crear y añadir las ventas
                    const sales = document.createElement("p");
                    sales.textContent = `Ventas: ${producto.VentasProducto}`;
                    sales.classList.add("sales-text");
                    productItem.appendChild(sales);
                
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
        console.error('Error al cargar los productos', error);
    }
}