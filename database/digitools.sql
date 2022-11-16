-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-10-2022 a las 15:34:21
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `digitools`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `crearunidad` (IN `u_imei` INT(15), IN `u_nombre` VARCHAR(25), IN `u_usuario` VARCHAR(13))   BEGIN
	INSERT INTO unidades VALUES (u_imei, u_nombre);
    INSERT INTO tieneunidad(usuario, imei) VALUES (u_usuario, u_imei);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `privilegios`
--

CREATE TABLE `privilegios` (
  `idprivilegio` int(11) NOT NULL,
  `nombre` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `privilegios`
--

INSERT INTO `privilegios` (`idprivilegio`, `nombre`) VALUES
(1, 'barra nav admin'),
(2, 'agregar trabajo'),
(3, 'ver todos los tickets');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL,
  `nombre` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idrol`, `nombre`) VALUES
(1, 'admin'),
(2, 'empleado'),
(3, 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolesasignados`
--

CREATE TABLE `rolesasignados` (
  `idrol` int(11) NOT NULL,
  `usuario` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rolesasignados`
--

INSERT INTO `rolesasignados` (`idrol`, `usuario`) VALUES
(2, 'trabajador1'),
(3, 'cliente1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status`
--

CREATE TABLE `status` (
  `idstatus` int(11) NOT NULL,
  `nombre` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `status`
--

INSERT INTO `status` (`idstatus`, `nombre`) VALUES
(1, 'abierto'),
(2, 'en proceso'),
(3, 'cerrado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket`
--

CREATE TABLE `ticket` (
  `idticket` int(11) NOT NULL,
  `usuarioCliente` varchar(13) NOT NULL,
  `usuarioTrabajador` varchar(13) DEFAULT NULL,
  `imei` int(15) DEFAULT NULL,
  `idstatus` int(11) NOT NULL DEFAULT 1,
  `idtipodefalla` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `descripcion` varchar(500) NOT NULL,
  `secobra` tinyint(1) NOT NULL DEFAULT 0,
  `costo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ticket`
--

INSERT INTO `ticket` (`idticket`, `usuarioCliente`, `usuarioTrabajador`, `imei`, `idstatus`, `idtipodefalla`, `fecha`, `descripcion`, `secobra`, `costo`) VALUES
(1, 'cliente1', NULL, 5654611, 1, 1, '2022-10-13 15:42:48', 'Descripción de prueba para la primer falla.', 0, NULL),
(2, 'cliente1', NULL, 5654611, 1, 1, '2022-10-13 15:47:29', '', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tieneprivilegio`
--

CREATE TABLE `tieneprivilegio` (
  `idprivilegio` int(11) NOT NULL,
  `idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tieneprivilegio`
--

INSERT INTO `tieneprivilegio` (`idprivilegio`, `idrol`) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tieneunidad`
--

CREATE TABLE `tieneunidad` (
  `usuario` varchar(13) NOT NULL,
  `imei` int(15) NOT NULL,
  `fechainicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechafin` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tieneunidad`
--

INSERT INTO `tieneunidad` (`usuario`, `imei`, `fechainicio`, `fechafin`) VALUES
('cliente1', 5654611, '2022-10-12 14:37:44', NULL),
('cliente1', 65165165, '2022-10-12 14:34:53', NULL),
('otrocliente', 2147483647, '2022-10-18 15:23:22', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipodefalla`
--

CREATE TABLE `tipodefalla` (
  `idfalla` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipodefalla`
--

INSERT INTO `tipodefalla` (`idfalla`, `nombre`) VALUES
(1, 'falla 1'),
(2, 'falla 2'),
(3, 'falla 3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajo`
--

CREATE TABLE `trabajo` (
  `idtrabajo` int(11) NOT NULL,
  `idticket` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `costo` int(11) DEFAULT NULL,
  `descripcion` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `trabajo`
--

INSERT INTO `trabajo` (`idtrabajo`, `idticket`, `fecha`, `costo`, `descripcion`) VALUES
(1, 1, '2022-10-18 18:15:22', 100, 'Se le cambió x pieza debido a que se daño por mal manejo del operador, es por esto que se le cobrará.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades`
--

CREATE TABLE `unidades` (
  `imei` int(15) NOT NULL,
  `nombre` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `unidades`
--

INSERT INTO `unidades` (`imei`, `nombre`) VALUES
(5654611, 'unidad2'),
(65165165, 'unidad1'),
(2147483647, 'unidad3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario` varchar(13) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `razonsocial` varchar(50) DEFAULT NULL,
  `telefono` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario`, `contraseña`, `rfc`, `razonsocial`, `telefono`) VALUES
('admin', '$2a$12$0DBBrz5z008afIRCMCC/s.dXlnjBg2pKO0lwS7EhLlf0MXajuvNQ.', '', '', 0),
('cliente1', 'cliente1', 'cliente1rfc', 'Este es el primer cliente', 2147483647),
('otrocliente', '$2a$12$vvjdUaqJEQXWSB2PrSlRq.GiqHB5y4hvA3j02p1a/vQzrls3E2hX6', 'DSVVDS5161', 'cliente 2', 2147483647),
('trabajador1', 'trabajador1', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `privilegios`
--
ALTER TABLE `privilegios`
  ADD PRIMARY KEY (`idprivilegio`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`);

--
-- Indices de la tabla `rolesasignados`
--
ALTER TABLE `rolesasignados`
  ADD PRIMARY KEY (`idrol`,`usuario`),
  ADD KEY `usuario` (`usuario`);

--
-- Indices de la tabla `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`idstatus`);

--
-- Indices de la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`idticket`),
  ADD KEY `usuarioCliente` (`usuarioCliente`),
  ADD KEY `usuarioTrabajador` (`usuarioTrabajador`),
  ADD KEY `imei` (`imei`),
  ADD KEY `idstatus` (`idstatus`),
  ADD KEY `idtipodefalla` (`idtipodefalla`);

--
-- Indices de la tabla `tieneprivilegio`
--
ALTER TABLE `tieneprivilegio`
  ADD KEY `idprivilegioidrol` (`idprivilegio`,`idrol`),
  ADD KEY `idrol` (`idrol`);

--
-- Indices de la tabla `tieneunidad`
--
ALTER TABLE `tieneunidad`
  ADD PRIMARY KEY (`usuario`,`imei`),
  ADD KEY `imei` (`imei`);

--
-- Indices de la tabla `tipodefalla`
--
ALTER TABLE `tipodefalla`
  ADD PRIMARY KEY (`idfalla`);

--
-- Indices de la tabla `trabajo`
--
ALTER TABLE `trabajo`
  ADD PRIMARY KEY (`idtrabajo`),
  ADD KEY `idticket` (`idticket`);

--
-- Indices de la tabla `unidades`
--
ALTER TABLE `unidades`
  ADD PRIMARY KEY (`imei`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `privilegios`
--
ALTER TABLE `privilegios`
  MODIFY `idprivilegio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `status`
--
ALTER TABLE `status`
  MODIFY `idstatus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ticket`
--
ALTER TABLE `ticket`
  MODIFY `idticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipodefalla`
--
ALTER TABLE `tipodefalla`
  MODIFY `idfalla` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `trabajo`
--
ALTER TABLE `trabajo`
  MODIFY `idtrabajo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `rolesasignados`
--
ALTER TABLE `rolesasignados`
  ADD CONSTRAINT `rolesasignados_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `roles` (`idrol`),
  ADD CONSTRAINT `rolesasignados_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`usuario`);

--
-- Filtros para la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`usuarioCliente`) REFERENCES `usuarios` (`usuario`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`usuarioTrabajador`) REFERENCES `usuarios` (`usuario`),
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`idtipodefalla`) REFERENCES `tipodefalla` (`idfalla`),
  ADD CONSTRAINT `ticket_ibfk_4` FOREIGN KEY (`idstatus`) REFERENCES `status` (`idstatus`),
  ADD CONSTRAINT `ticket_ibfk_5` FOREIGN KEY (`imei`) REFERENCES `unidades` (`imei`);

--
-- Filtros para la tabla `tieneprivilegio`
--
ALTER TABLE `tieneprivilegio`
  ADD CONSTRAINT `tieneprivilegio_ibfk_1` FOREIGN KEY (`idprivilegio`) REFERENCES `privilegios` (`idprivilegio`),
  ADD CONSTRAINT `tieneprivilegio_ibfk_2` FOREIGN KEY (`idrol`) REFERENCES `roles` (`idrol`);

--
-- Filtros para la tabla `tieneunidad`
--
ALTER TABLE `tieneunidad`
  ADD CONSTRAINT `tieneunidad_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`usuario`),
  ADD CONSTRAINT `tieneunidad_ibfk_2` FOREIGN KEY (`imei`) REFERENCES `unidades` (`imei`);

--
-- Filtros para la tabla `trabajo`
--
ALTER TABLE `trabajo`
  ADD CONSTRAINT `trabajo_ibfk_1` FOREIGN KEY (`idticket`) REFERENCES `ticket` (`idticket`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
