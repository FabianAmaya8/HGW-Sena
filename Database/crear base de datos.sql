-- Elimina la base de datos si existe
DROP DATABASE IF EXISTS HGW_database;
CREATE DATABASE HGW_database;
USE HGW_database;

-- Tabla de roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50)
);

-- Tabla de medios de pago
CREATE TABLE medios_pago (
    id_medio INT PRIMARY KEY AUTO_INCREMENT,
    nombre_medio VARCHAR(50)
);

-- Tabla unificada de ubicaciones (países y ciudades)
CREATE TABLE ubicaciones (
    id_ubicacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('pais', 'ciudad') NOT NULL,
    ubicacion_padre INT,
    FOREIGN KEY (ubicacion_padre) REFERENCES ubicaciones(id_ubicacion) ON DELETE CASCADE
);

-- Tabla de membresías
CREATE TABLE membresias (
    id_membresia INT PRIMARY KEY AUTO_INCREMENT,
    nombre_membresia VARCHAR(50),
    bv INT,
    precio_membresia FLOAT
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    pss VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL UNIQUE,
    numero_telefono VARCHAR(50),
    url_foto_perfil VARCHAR(255),
    patrocinador VARCHAR(50),
    membresia INT NOT NULL,
    medio_pago INT,
    rol INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rol) REFERENCES roles(id_rol),
    FOREIGN KEY (membresia) REFERENCES membresias(id_membresia),
    FOREIGN KEY (medio_pago) REFERENCES medios_pago(id_medio)
);

-- Tabla de direcciones
CREATE TABLE direcciones (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    direccion TEXT NOT NULL,
    codigo_postal VARCHAR(50),
    id_ubicacion INT NOT NULL,
    lugar_entrega ENUM('Casa', 'Apartamento', 'Hotel', 'Oficina', 'Otro'),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion)
);

-- Tabla de categorías
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(40),
    img_categoria TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de subcategorías
CREATE TABLE subcategoria (
    id_subcategoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_subcategoria VARCHAR(50),
    categoria INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    categoria INT NOT NULL,
    subcategoria INT NOT NULL,
    nombre_producto VARCHAR(50) NOT NULL UNIQUE,
    precio_producto FLOAT NOT NULL,
    imagen_producto TEXT NOT NULL,
    imgs_publicidad TEXT,
    descripcion TEXT NOT NULL,
    stock INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (subcategoria) REFERENCES subcategoria(id_subcategoria) ON DELETE CASCADE
);

-- Carrito de compras y productos en el carrito
CREATE TABLE carrito_compras (
    id_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE productos_carrito (
    producto INT,
    cantidad_producto INT,
    carrito INT NOT NULL,
    FOREIGN KEY (producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (carrito) REFERENCES carrito_compras(id_carrito) ON DELETE CASCADE
);

ALTER TABLE productos_carrito
ADD CONSTRAINT unique_producto_carrito UNIQUE (producto, carrito);

-- Tabla de bonos
CREATE TABLE bonos (
    id_bono INT PRIMARY KEY AUTO_INCREMENT,
    nombre_bono VARCHAR(50) NOT NULL,
    porcentaje FLOAT(5,2),
    tipo VARCHAR(50),
    costo_activacion INT
);

-- Historial de bonos por usuario
CREATE TABLE bonos_usuarios (
    id_bono_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_bono INT NOT NULL,
    fecha DATE NOT NULL,
    detalle TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_bono) REFERENCES bonos(id_bono) ON DELETE CASCADE
);

-- Tabla de educación y contenido educativo
CREATE TABLE educacion (
    id_tema INT PRIMARY KEY AUTO_INCREMENT,
    tema VARCHAR(50) NOT NULL
);

CREATE TABLE contenido_tema (
    id_contenido INT PRIMARY KEY AUTO_INCREMENT,
    url_documentos TEXT,
    url_videos TEXT,
    tema INT NOT NULL,
    FOREIGN KEY (tema) REFERENCES educacion(id_tema) ON DELETE CASCADE
);
CREATE TABLE retiros(
    id_retiro INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT not null,
    saldo_disponible DOUBLE NOT NULL,
    banco VARCHAR(100),
    numero_cuenta_celular VARCHAR(100),
    monto_retiro DOUBLE NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
CREATE TABLE transacciones (
    id_transaccion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario_emisor VARCHAR(50) NOT NULL,   -- Usuario que realiza la transacción
    nombre_usuario_receptor VARCHAR(50) NOT NULL, -- Usuario receptor de la transacción
    monto DOUBLE NOT NULL,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (nombre_usuario_emisor) REFERENCES usuarios(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (nombre_usuario_receptor) REFERENCES usuarios(nombre_usuario) ON DELETE CASCADE
);

-- Tabla principal de órdenes
CREATE TABLE ordenes (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_direccion INT NOT NULL,
    id_medio_pago INT NOT NULL,
    total DOUBLE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion) ON DELETE CASCADE,
    FOREIGN KEY (id_medio_pago) REFERENCES medios_pago(id_medio)
);

-- Tabla intermedia productos por orden
CREATE TABLE ordenes_productos (
    id_orden_producto INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Inserción inicial de datos  ---
-- ------------------------------------------------

-- Membresías
INSERT INTO membresias (nombre_membresia, bv, precio_membresia) VALUES
    ('Cliente',0, 10000.0),
    ('Pre Junior',50, 20000.0),
    ('Junior',100, 30000.0),
    ('Senior',300, 40000.0),
    ('Master',600, 50000.0);

-- Medios de pago
INSERT INTO medios_pago (nombre_medio) VALUES
    ('tarjeta');

-- Roles
INSERT INTO roles (nombre_rol) VALUES
    ('Admin'),
    ('Moderador'),
    ('Usuario');

-- Ubicaciones: países
INSERT INTO ubicaciones (nombre, tipo, ubicacion_padre) VALUES
    ('Colombia', 'pais', NULL),
    ('México',   'pais', NULL);

-- Capturar IDs de países para luego insertar ciudades
SET @id_colombia = (SELECT id_ubicacion FROM ubicaciones WHERE nombre = 'Colombia');
SET @id_mexico   = (SELECT id_ubicacion FROM ubicaciones WHERE nombre = 'México');

-- Ciudades de Colombia
INSERT INTO ubicaciones (nombre, tipo, ubicacion_padre) VALUES
    ('Bogotá',       'ciudad', @id_colombia),
    ('Medellín',     'ciudad', @id_colombia),
    ('Cali',         'ciudad', @id_colombia),
    ('Barranquilla','ciudad', @id_colombia),
    ('Cartagena',    'ciudad', @id_colombia),
    ('Cúcuta',       'ciudad', @id_colombia),
    ('Bucaramanga',  'ciudad', @id_colombia),
    ('Pereira',      'ciudad', @id_colombia),
    ('Santa Marta',  'ciudad', @id_colombia),
    ('Ibagué',       'ciudad', @id_colombia);

-- Ciudades de México
INSERT INTO ubicaciones (nombre, tipo, ubicacion_padre) VALUES
    ('Ciudad de México','ciudad', @id_mexico),
    ('Guadalajara',     'ciudad', @id_mexico),
    ('Monterrey',       'ciudad', @id_mexico),
    ('Puebla',          'ciudad', @id_mexico),
    ('Tijuana',         'ciudad', @id_mexico),
    ('León',            'ciudad', @id_mexico),
    ('Ciudad Juárez',   'ciudad', @id_mexico),
    ('Zapopan',         'ciudad', @id_mexico),
    ('Mérida',          'ciudad', @id_mexico),
    ('Toluca',          'ciudad', @id_mexico);

