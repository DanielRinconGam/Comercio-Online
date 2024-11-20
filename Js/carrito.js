const btnLogin = document.getElementById("btnLogin"); // Boton de inicio de sesion. 
const btnCar = document.getElementById("btnCar"); // Boton de carrito.
const url_products = "http://127.0.0.1:5000/productos"; // URL de la API para obtener


document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); //Obtener valor segun estado de sesion.
    const idRol = localStorage.getItem("userRole"); //Obtener valor segun rol del usuario.

    UserContent(idRol);
    
    if(isLoggedIn === "true" && idRol === "2"){
        btnLogin.textContent = "Cerrar Sesión";
        btnLogin.style.color = "red";

        // si esta log
        window.onload = obtenerCarrito;
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


// Función para obtener los datos del carrito del usuario
function obtenerCarrito() {
    const idUsuario = localStorage.getItem('userId');

    fetch(`http://127.0.0.1:5000/ver_carrito/${idUsuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.productos && data.productos.length > 0) {
                // Llenar el contenedor con los productos del carrito
                llenarCarrito(data.productos);

                // Mostrar el total del carrito
                document.getElementById('total-carrito').innerText = `Total: $${parseFloat(data.total_carrito)}`;
            } else {
                // Mostrar mensaje si el carrito está vacío
                document.getElementById('productos-container').innerHTML = `
                    <p>El carrito está vacío</p>`;

                document.getElementById('total-carrito').innerText = `Total: $0`;
            }
        })
        .catch(error => console.error('Error al obtener el carrito:', error));
}

// Función para llenar el contenedor con los productos del carrito
function llenarCarrito(productos) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = ''; // Limpiar el contenido anterior

    productos.forEach(producto => {
        // Verificar que PrecioProducto sea un número válido
        const precioProducto = parseFloat(producto.PrecioProducto);
        const precioTotal = parseFloat(producto.PrecioTotal);

        // Crear el contenedor de cada producto
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        // Crear y añadir la imagen
        const img = document.createElement("img");
        img.src = "./Assets/Galeria/" + producto.ImagenProducto;
        img.alt = producto.NombreProducto;
        productItem.appendChild(img);

        // Crear y añadir los detalles del producto
        const details = document.createElement("div");
        details.classList.add("product-details");
        details.innerHTML = `
            <h4>${producto.NombreProducto}</h4>
            <p>Precio: $${precioProducto.toFixed(2)}</p>
            <p>Total: $${precioTotal.toFixed(2)}</p>
        `;
        productItem.appendChild(details);

        // Crear el contenedor de acciones (botones para cantidad y eliminar)
        const actions = document.createElement("div");
        actions.classList.add("product-actions");

        // Botón para disminuir cantidad
        const btnMinus = document.createElement("button");
        btnMinus.classList.add("quantity-btn");
        btnMinus.innerText = '-';
        btnMinus.onclick = () => actualizarCantidad(producto.IdProducto, -1);
        actions.appendChild(btnMinus);

        // Mostrar la cantidad actual
        const quantity = document.createElement("span");
        quantity.innerText = producto.CantidadProducto;
        actions.appendChild(quantity);

        // Botón para aumentar cantidad
        const btnPlus = document.createElement("button");
        btnPlus.classList.add("quantity-btn");
        btnPlus.innerText = '+';
        btnPlus.onclick = () => actualizarCantidad(producto.IdProducto, 1);
        actions.appendChild(btnPlus);

        // Botón para eliminar el producto del carrito
        const deleteBtn = document.createElement("span");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerText = 'Eliminar';
        deleteBtn.onclick = () => eliminarProducto(producto.IdProducto);
        actions.appendChild(deleteBtn);

        productItem.appendChild(actions);

        // Añadir el producto al contenedor principal
        productosContainer.appendChild(productItem);
    });
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidad(idProducto, cantidad) {
    const idUsuario = localStorage.getItem('userId');

    fetch(`http://127.0.0.1:5000/actualizar_carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ IdUsuario: idUsuario, IdProducto: idProducto, CantidadProducto: cantidad })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Verifica la respuesta del backend
        if (data.message === 'Cantidad actualizada correctamente') {
            obtenerCarrito(); // Refrescar el carrito después de la actualización
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al actualizar la cantidad:', error));
}

// Función para eliminar un producto del carrito
function eliminarProducto(idProducto) {
    const idUsuario = localStorage.getItem('userId');

    fetch(`http://127.0.0.1:5000/eliminar_carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, id_producto: idProducto })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Producto eliminado correctamente') {
            obtenerCarrito(); // Refrescar el carrito después de eliminar

        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al eliminar el producto:', error));
}
