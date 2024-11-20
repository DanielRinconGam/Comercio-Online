from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(app)


# Función para conectar a la base de datos
def db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="tiendavirtual"
        )
        return connection
    except:
        print("Error al conectar a la base de datos.")
        return None
    
# login usuario
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    correo = data.get('CorreoUsuario')
    contrasena = data.get('ContrasenaUsuario')
    
    # Validar que se recibieron los datos necesarios
    if not correo or not contrasena:
        return jsonify({'message': 'Faltan datos del usuario'}), 400

    # Conectar a la base de datos
    conn = db_connection()

    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500

    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM usuario WHERE CorreoUsuario = %s AND ContrasenaUsuario = %s", (correo, contrasena))
        user = cursor.fetchone()

        if user:
            return jsonify({'message': 'Inicio de sesión exitoso', 'user': user}), 200
        else:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
    except:

        return jsonify({'message': 'Error durante el inicio de sesión.'}), 500
    finally:
        cursor.close()
        conn.close()

# Obtener productos
@app.route('/productos', methods=['GET']) 
def obtener_productos():
    # Conectar a la base de datos
    conn = db_connection()

    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500
    
    cursor = conn.cursor(dictionary=True)

    # Parametros de la url
    categoria = request.args.get('categoria')
    precio_orden = request.args.get('precio_orden')
    ventas_orden = request.args.get('ventas_orden')

    # Base de la consulta
    query = """
    SELECT c.NombreCategoria, p.IdProducto, p.NombreProducto, p.DescripcionProducto, 
           p.PrecioProducto, p.StockProducto, p.ImagenProducto, p.VentasProducto 
    FROM producto p 
    JOIN categoria c ON p.IdCategoria = c.IdCategoria
    """

    # Filtrado por categoría
    if categoria:
        query += " WHERE c.NombreCategoria = %s"
        query_params = [categoria]
    else:
        query_params = []

    # Ordenar por precio o ventas
    if precio_orden:
        query += " ORDER BY p.PrecioProducto " + ("ASC" if precio_orden == 'asc' else "DESC")
    elif ventas_orden:
        query += " ORDER BY p.VentasProducto " + ("ASC" if ventas_orden == 'asc' else "DESC")


    try:
        cursor.execute(query, query_params)
        productos = cursor.fetchall()

        if productos:
            return jsonify({'message': 'Productos obtenidos', 'productos': productos}), 200
        else:
            return jsonify({'message': 'No se pudieron obtener los productos'}), 400
    except:

        return jsonify({'message': 'Error al obtener los productos.'}), 500
    finally:
        cursor.close()
        conn.close()

# Agregar al carro
@app.route('/agregar_carrito', methods=['POST'])
def agregar_al_carrito():
    # Conectar a la base de datos
    conn = db_connection()

    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500

    cursor = conn.cursor()

    try:
        # Obtener los datos enviados
        data = request.json
        IdUsuario = data.get('IdUsuario')
        IdProducto = data.get('IdProducto')
        CantidadProducto = data.get('CantidadProducto', 1)

        # Verificar si el producto ya está en el carrito
        query_check = """
        SELECT * FROM carrito WHERE IdUsuario = %s AND IdProducto = %s
        """
        cursor.execute(query_check, (IdUsuario, IdProducto))
        item_carro = cursor.fetchone()

        if item_carro:
            # Si ya está en el carrito, solo incrementamos la cantidad
            query_update = """
            UPDATE carrito SET CantidadProducto = CantidadProducto + %s WHERE IdUsuario = %s AND IdProducto = %s
            """
            cursor.execute(query_update, (CantidadProducto, IdUsuario, IdProducto))
        else:
            # Si no está en el carrito, lo agregamos
            query_insert = """
            INSERT INTO carrito (IdUsuario, IdProducto, CantidadProducto)
            VALUES (%s, %s, %s)
            """
            cursor.execute(query_insert, (IdUsuario, IdProducto, CantidadProducto))

        conn.commit()

        return jsonify({'message': 'Producto añadido al carrito correctamente'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error al agregar el producto al carrito'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/ver_carrito/<int:id_usuario>', methods=['GET'])
def ver_carrito(id_usuario):
    # Conectar a la base de datos
    conn = db_connection()

    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500

    cursor = conn.cursor()

    try:
        # Consultar los productos del carrito del usuario
        query = """
        SELECT c.IdProducto, p.NombreProducto, c.CantidadProducto, p.PrecioProducto, p.ImagenProducto
        FROM carrito c
        JOIN producto p ON c.IdProducto = p.IdProducto
        WHERE c.IdUsuario = %s
        """
        cursor.execute(query, (id_usuario,))
        carrito_items = cursor.fetchall()

        # Verificar si el carrito está vacío
        if not carrito_items:
            return jsonify({'message': 'El carrito está vacío'}), 200

        # Crear una lista con los productos del carrito
        carrito = []
        for item in carrito_items:
            producto = {
                'IdProducto': item[0],
                'NombreProducto': item[1],
                'CantidadProducto': item[2],
                'PrecioProducto': item[3],
                'PrecioTotal': item[2] * item[3],
                'ImagenProducto': item[4]
            }
            carrito.append(producto)

        # Calcular el total general del carrito
        total_carrito = sum(item['PrecioTotal'] for item in carrito)

        return jsonify({
            'productos': carrito,
            'total_carrito': total_carrito
        }), 200

    except Exception as e:
        print(e)
        print(f"Error: {str(e)}") 
        return jsonify({'message': 'Error al obtener el carrito'}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/actualizar_carrito', methods=['POST'])
def actualizar_carrito():
    conn = db_connection()
    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500

    cursor = conn.cursor()

    try:
        data = request.json
        IdUsuario = data.get('IdUsuario')
        IdProducto = data.get('IdProducto')
        Cantidad = data.get('CantidadProducto')

        # Verificar si el producto está en el carrito
        query_check = """
        SELECT CantidadProducto FROM carrito WHERE IdUsuario = %s AND IdProducto = %s
        """
        cursor.execute(query_check, (IdUsuario, IdProducto))
        item_carro = cursor.fetchone()

        if item_carro:
            nueva_cantidad = item_carro[0] + Cantidad

            if nueva_cantidad <= 0:
                # Si la cantidad es 0 o menor, eliminar el producto del carrito
                cursor.execute("DELETE FROM carrito WHERE IdUsuario = %s AND IdProducto = %s", (IdUsuario, IdProducto))
            else:
                # Actualizar la cantidad del producto en el carrito
                query_update = """
                UPDATE carrito SET CantidadProducto = %s WHERE IdUsuario = %s AND IdProducto = %s
                """
                cursor.execute(query_update, (nueva_cantidad, IdUsuario, IdProducto))

            conn.commit()
            return jsonify({'message': 'Cantidad actualizada correctamente'}), 200
        else:
            return jsonify({'message': 'Producto no encontrado en el carrito'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error al actualizar el carrito'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/eliminar_carrito', methods=['POST'])
def eliminar_carrito():
    # Conectar a la base de datos
    conn = db_connection()

    if conn is None:
        return jsonify({'message': 'Error al conectar con la base de datos'}), 500

    cursor = conn.cursor()

    try:
        # Obtener los datos enviados
        data = request.json
        IdUsuario = data.get('id_usuario')
        IdProducto = data.get('id_producto')

        # Eliminar el producto del carrito
        query_delete = """
        DELETE FROM carrito WHERE IdUsuario = %s AND IdProducto = %s
        """
        cursor.execute(query_delete, (IdUsuario, IdProducto))

        # Confirmar la eliminación
        conn.commit()

        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error al eliminar el producto del carrito'}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
