const loginBtn = document.getElementById("loginBtn");
const url = 'http://127.0.0.1:5000/login'; // Url de la API

loginBtn.addEventListener('click', function(event) { 
    event.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        console.log("No se ha podido iniciar sesión. Faltan datos.");
    } else {
        loginCustomer(email, password).then(resultado => {
            console.log("Respuesta de la API:", resultado);
            if (resultado.message === 'Inicio de sesión exitoso') {

                localStorage.setItem("isLoggedIn", "true"); // Estado inicio de sesión
                localStorage.setItem("userId", resultado.user.IdUsuario); // Id del usuario
                localStorage.setItem("userRole", resultado.user.IdRol); // Rol del usuario
                
                // redirigir al usuario
                window.location.href = "./home.html";
            } else {
                const mensaje = "Credenciales incorrectas. Inténtalo de nuevo.";
                document.getElementById("error_login").textContent = mensaje;
            }
        }).catch(error => {
            const mensaje = "Usuario o contraseña incorrectos";
            document.getElementById("error_login").textContent = mensaje;
        });
    }
});

async function loginCustomer(mail, pw) {
    const datos = {
        CorreoUsuario: mail,
        ContrasenaUsuario: pw
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Verificar si el usuario ya ha iniciado sesion
document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        window.location.href = "./home.html"; 
    }
});