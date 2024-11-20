# Despliegue del Proyecto

## Requisitos previos

Antes de proceder con el despliegue, asegúrate de tener instalado lo siguiente:

- **XAMPP**
- **Python**
- **MySQL**
- **Flask**

## Instrucciones de despliegue

### Paso 1: Clonar el repositorio

1. Clona el repositorio en tu máquina local en la carpeta **htdocs** de XAMPP. Para hacer esto, abre una terminal y ejecuta:

   ```bash
   cd c:/xampp/htdocs
   git clone https://github.com/DanielRinconGam/Comercio-Online.git
   ```
   
### Paso 2: Subir la base de datos

1. Dentro de la carpeta del proyecto, busca la carpeta llamada **Base de datos** que contiene el archivo sql.

2. Crea una nueva base de datos en MySQL. llamada **tiendavirtual**.

3. haz clic en la opción Importar y selecciona el archivo sql.

### Paso 3: Configuración de Flask

1. Si no tienes las dependencias usa el siguiente comando.

  ```bash
  pip install flask flask-cors mysql-connector
  ```

### Paso 4: Ejecutar la API

1. Ejecuta el archivo API.py para iniciar el servidor de Flask.

### Paso 5: Abrir el archivo home.html

1. En tu navegador, abre http://localhost/Comercio-Online/home.html.

2. Los usuarios válidos son los siguientes:

  | Correo               | Contraseña |
  |----------------------|------------|
  | admin@admin.com      | admin      |
  | user@user.com        | user       |


