-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2024 a las 01:46:30
-- Versión del servidor: 10.4.32-MariaDB-log
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendavirtual`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `IdCarrito` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `CantidadProducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`IdCarrito`, `IdUsuario`, `IdProducto`, `CantidadProducto`) VALUES
(15, 2, 14, 4),
(16, 2, 15, 3),
(17, 2, 16, 2),
(19, 2, 13, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL,
  `NombreCategoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`IdCategoria`, `NombreCategoria`) VALUES
(1, 'Ropa y Accesorios'),
(2, 'Hogar y Oficina'),
(3, 'Salud y Bienestar'),
(4, 'Alimentos y Bebidas'),
(5, 'Tecnología y Gadgets'),
(6, 'Productos Ecológicos'),
(7, 'Hogar y Decoración');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion_envio`
--

CREATE TABLE `direccion_envio` (
  `IdEnvio` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `DireccionEnvio` varchar(255) NOT NULL,
  `CiudadEnvio` varchar(100) NOT NULL,
  `PaisEnvio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `IdOrden` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `IdDireccion` int(11) NOT NULL,
  `PagoTotalOrden` decimal(15,2) NOT NULL,
  `FechaOrden` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_producto`
--

CREATE TABLE `orden_producto` (
  `idOrdenProducto` int(11) NOT NULL,
  `IdOrden` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `CantidadOrdenProducto` int(11) NOT NULL,
  `PrecioOrdenProducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_usuario`
--

CREATE TABLE `pagos_usuario` (
  `IdPagos` int(11) NOT NULL,
  `IdUsuarios` int(11) NOT NULL,
  `MontoPago` decimal(10,2) NOT NULL,
  `FechaPago` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `IdProducto` int(11) NOT NULL,
  `IdCategoria` int(11) NOT NULL,
  `NombreProducto` varchar(255) NOT NULL,
  `DescripcionProducto` text DEFAULT NULL,
  `PrecioProducto` decimal(15,2) NOT NULL,
  `StockProducto` int(11) NOT NULL,
  `ImagenProducto` varchar(255) DEFAULT NULL,
  `VentasProducto` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`IdProducto`, `IdCategoria`, `NombreProducto`, `DescripcionProducto`, `PrecioProducto`, `StockProducto`, `ImagenProducto`, `VentasProducto`) VALUES
(1, 1, 'Camiseta de Algodón', 'Camiseta básica de algodón, disponible en varios colores.', 25000.00, 100, 'camiseta_algodon.jpg', 10),
(2, 1, 'Zapatillas Deportivas para Running', 'Zapatillas cómodas y ligeras para corredores.', 120000.00, 50, 'zapatillas_running.jpg', 5),
(3, 1, 'Bolsos de Cuero', 'Bolsos de cuero genuino, con diseño elegante y moderno.', 180000.00, 30, 'bolso_cuero.jpg', 24),
(4, 2, 'Cajón Organizacional para Oficina', 'Cajón organizador de escritorio, ideal para papelería y accesorios.', 45000.00, 75, 'cajon_oficina.jpg', 64),
(5, 2, 'Lámpara LED de Escritorio', 'Lámpara con luz regulable para oficina o estudio.', 70000.00, 60, 'lampara_led.jpg', 9),
(6, 2, 'Silla Ergonómica para Oficina', 'Silla ergonómica, ideal para largas horas de trabajo.', 250000.00, 20, 'silla_ergonomica.jpg', 3),
(7, 3, 'Aceite Esencial de Lavanda', 'Aceite esencial 100% natural, ideal para relajación.', 30000.00, 200, 'aceite_lavanda.jpg', 30),
(8, 3, 'Mascarillas Faciales Naturales', 'Mascarillas hidratantes con ingredientes naturales.', 20000.00, 150, 'mascarilla_natural.jpg', 24),
(9, 3, 'Suplemento de Proteínas en Polvo', 'Suplemento alimenticio de proteínas de alta calidad.', 90000.00, 100, 'proteina_polvo.png', 15),
(10, 4, 'Café Orgánico en Granos', 'Café 100% orgánico, de cultivo libre de químicos.', 35000.00, 80, 'cafe_organico.png', 48),
(11, 4, 'Chocolate Artesanal Sin Azúcar', 'Chocolate artesanal sin azúcar añadido, 100% natural.', 25000.00, 120, 'chocolate_artesanal.webp', 45),
(12, 4, 'Cerveza Artesanal Local', 'Cerveza artesanal de la región, con ingredientes locales.', 15000.00, 100, 'cerveza_artesanal.jpg', 15),
(13, 5, 'Reloj Inteligente', 'Reloj inteligente con monitoreo de salud y notificaciones.', 300000.00, 50, 'reloj_inteligente.webp', 47),
(14, 5, 'Auriculares Bluetooth Inalámbricos', 'Auriculares Bluetooth con cancelación de ruido.', 150000.00, 80, 'auriculares_bluetooth.webp', 87),
(15, 5, 'Smartphone de Alta Gama', 'Teléfono móvil con las últimas características tecnológicas.', 1500000.00, 30, 'smartphone_alta_gama.jpg', 32),
(16, 5, 'Cargador Solar Portátil', 'Cargador solar compacto para dispositivos móviles.', 120000.00, 40, 'cargador_solar.webp', 5),
(17, 6, 'Vasos Reutilizables de Acero Inoxidable', 'Vasos de acero inoxidable, ideales para mantener la temperatura de tus bebidas.', 35000.00, 200, 'vaso_inoxidable.webp', 26),
(18, 6, 'Bolsa de Tela Reutilizable para Compras', 'Bolsa ecológica reutilizable para hacer compras.', 15000.00, 300, 'bolsa_tela.webp', 12),
(19, 7, 'Manta de Lana', 'Manta suave y cálida de lana, ideal para invierno.', 180000.00, 50, 'manta_lana.jpg', 36),
(20, 7, 'Alfombra Antideslizante para Sala', 'Alfombra moderna y antideslizante para cualquier sala de tu hogar.', 90000.00, 60, 'alfombra_antideslizante.webp', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL,
  `NombreRol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`IdRol`, `NombreRol`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IdUsuario` int(11) NOT NULL,
  `IdRol` int(11) NOT NULL,
  `NombreUsuario` varchar(50) NOT NULL,
  `ApellidoUsuario` varchar(50) NOT NULL,
  `CorreoUsuario` varchar(100) NOT NULL,
  `ContrasenaUsuario` varchar(255) NOT NULL,
  `FechaCreacionUsuario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IdUsuario`, `IdRol`, `NombreUsuario`, `ApellidoUsuario`, `CorreoUsuario`, `ContrasenaUsuario`, `FechaCreacionUsuario`) VALUES
(1, 1, 'Admin', 'Daniel', 'admin@admin.com', 'admin', '2024-11-11 00:15:57'),
(2, 2, 'Usuario', 'Daniel', 'user@user.com', 'user', '2024-11-11 00:15:57');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`IdCarrito`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `IdProducto` (`IdProducto`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`IdCategoria`);

--
-- Indices de la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  ADD PRIMARY KEY (`IdEnvio`),
  ADD KEY `IdUsuario` (`IdUsuario`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`IdOrden`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `IdDireccion` (`IdDireccion`);

--
-- Indices de la tabla `orden_producto`
--
ALTER TABLE `orden_producto`
  ADD PRIMARY KEY (`idOrdenProducto`),
  ADD KEY `IdOrden` (`IdOrden`),
  ADD KEY `IdProducto` (`IdProducto`);

--
-- Indices de la tabla `pagos_usuario`
--
ALTER TABLE `pagos_usuario`
  ADD PRIMARY KEY (`IdPagos`),
  ADD KEY `IdUsuarios` (`IdUsuarios`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`IdProducto`),
  ADD KEY `IdCategoria` (`IdCategoria`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`IdRol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD UNIQUE KEY `CorreoUsuario` (`CorreoUsuario`),
  ADD KEY `IdRol` (`IdRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `IdCarrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  MODIFY `IdEnvio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `IdOrden` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden_producto`
--
ALTER TABLE `orden_producto`
  MODIFY `idOrdenProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos_usuario`
--
ALTER TABLE `pagos_usuario`
  MODIFY `IdPagos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `IdProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `IdRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `producto` (`IdProducto`);

--
-- Filtros para la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  ADD CONSTRAINT `direccion_envio_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`);

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`),
  ADD CONSTRAINT `orden_ibfk_2` FOREIGN KEY (`IdDireccion`) REFERENCES `direccion_envio` (`IdEnvio`);

--
-- Filtros para la tabla `orden_producto`
--
ALTER TABLE `orden_producto`
  ADD CONSTRAINT `orden_producto_ibfk_1` FOREIGN KEY (`IdOrden`) REFERENCES `orden` (`IdOrden`),
  ADD CONSTRAINT `orden_producto_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `producto` (`IdProducto`);

--
-- Filtros para la tabla `pagos_usuario`
--
ALTER TABLE `pagos_usuario`
  ADD CONSTRAINT `pagos_usuario_ibfk_1` FOREIGN KEY (`IdUsuarios`) REFERENCES `usuario` (`IdUsuario`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
