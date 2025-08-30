DROP DATABASE IF EXISTS HGW_database;
CREATE DATABASE HGW_database
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;
USE HGW_database;


-- Tabla de roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de medios de pago
CREATE TABLE medios_pago (
    id_medio INT PRIMARY KEY AUTO_INCREMENT,
    nombre_medio VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla unificada de ubicaciones (países y ciudades)
CREATE TABLE ubicaciones (
    id_ubicacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('pais', 'ciudad') NOT NULL,
    ubicacion_padre INT,
    FOREIGN KEY (ubicacion_padre)
      REFERENCES ubicaciones(id_ubicacion)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de membresías
CREATE TABLE membresias (
    id_membresia INT PRIMARY KEY AUTO_INCREMENT,
    nombre_membresia VARCHAR(50),
    bv INT,
    precio_membresia FLOAT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    FOREIGN KEY (rol)
      REFERENCES roles(id_rol),
    FOREIGN KEY (membresia)
      REFERENCES membresias(id_membresia),
    FOREIGN KEY (medio_pago)
      REFERENCES medios_pago(id_medio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de direcciones
CREATE TABLE direcciones (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    direccion TEXT NOT NULL,
    codigo_postal VARCHAR(50),
    id_ubicacion INT NOT NULL,
    lugar_entrega ENUM('Casa', 'Apartamento', 'Hotel', 'Oficina', 'Otro'),
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON DELETE CASCADE,
    FOREIGN KEY (id_ubicacion)
      REFERENCES ubicaciones(id_ubicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de categorías
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(40),
    img_categoria TEXT,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de subcategorías
CREATE TABLE subcategoria (
    id_subcategoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_subcategoria VARCHAR(50),
    categoria INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria)
      REFERENCES categorias(id_categoria)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    FOREIGN KEY (categoria)
      REFERENCES categorias(id_categoria)
      ON DELETE CASCADE,
    FOREIGN KEY (subcategoria)
      REFERENCES subcategoria(id_subcategoria)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Carrito de compras y productos en el carrito

CREATE TABLE carrito_compras (
    id_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE productos_carrito (
    producto INT,
    cantidad_producto INT,
    carrito INT NOT NULL,
    FOREIGN KEY (producto)
      REFERENCES productos(id_producto)
      ON DELETE CASCADE,
    FOREIGN KEY (carrito)
      REFERENCES carrito_compras(id_carrito)
      ON DELETE CASCADE,
    CONSTRAINT unique_producto_carrito UNIQUE (producto, carrito)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bonos y su historial

CREATE TABLE bonos (
    id_bono INT PRIMARY KEY AUTO_INCREMENT,
    nombre_bono VARCHAR(50) NOT NULL,
    porcentaje FLOAT(5,2),
    tipo VARCHAR(50),
    costo_activacion INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bonos_usuarios (
    id_bono_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_bono INT NOT NULL,
    fecha DATE NOT NULL,
    detalle TEXT,
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON DELETE CASCADE,
    FOREIGN KEY (id_bono)
      REFERENCES bonos(id_bono)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Educación y contenido

CREATE TABLE educacion (
    id_tema INT PRIMARY KEY AUTO_INCREMENT,
    tema VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contenido_tema (
    id_contenido INT PRIMARY KEY AUTO_INCREMENT,
    url_documentos TEXT,
    url_videos TEXT,
    tema INT NOT NULL,
    FOREIGN KEY (tema)
      REFERENCES educacion(id_tema)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Retiros y transacciones

CREATE TABLE retiros (
    id_retiro INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    saldo_disponible DOUBLE NOT NULL,
    banco VARCHAR(100),
    numero_cuenta_celular VARCHAR(100),
    monto_retiro DOUBLE NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transacciones (
    id_transaccion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario_emisor VARCHAR(50) NOT NULL,
    nombre_usuario_receptor VARCHAR(50) NOT NULL,
    monto DOUBLE NOT NULL,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (nombre_usuario_emisor)
      REFERENCES usuarios(nombre_usuario)
      ON DELETE CASCADE,
    FOREIGN KEY (nombre_usuario_receptor)
      REFERENCES usuarios(nombre_usuario)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE modulosAdmin(id int primary key auto_increment, 
	navbar text, vistas text
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

-- Tabla principal de órdenes
CREATE TABLE ordenes (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_direccion INT NOT NULL,
    id_medio_pago INT NOT NULL,
    total DOUBLE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (id_direccion)
        REFERENCES direcciones(id_direccion)
        ON DELETE CASCADE,
    FOREIGN KEY (id_medio_pago)
        REFERENCES medios_pago(id_medio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla intermedia productos por orden
CREATE TABLE ordenes_productos (
    id_orden_producto INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    FOREIGN KEY (id_orden)
        REFERENCES ordenes(id_orden)
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------
-- Inserción inicial de datos  ---
-- ------------------------------------------------

-- Modulos

insert into modulosAdmin(navbar, vistas) values(
	'[
  [
    {
      "title": ["Editar Categoria", "Crear Categoria"],
      "req": { "table": "categorias" },
      "path": "Categorias"
    },
    {
      "id": "nombre_categoria",
      "type": "input",
      "label": "Nombre Categoria",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "img_categoria",
      "type": "img",
      "label": "",
      "dependency": "",
      "childs": ["anoche", "ayer", "hoy"],
      "requirements": { "minLength": 0 }
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear Categoria",
      "click": "",
      "submit": "categorias"
    }
  ],
  [
    {
      "title": ["Editar Subcategoria", "Crear Subcategoria"],
      "req": { "table": "subcategoria" },
      "tableC": [{ "table": "categorias" }],
      "path": "Categorias/Subcategorias"
    },
    {
      "id": "nombre_subcategoria",
      "type": "input",
      "label": "Nombre Subcategoria",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "categoria",
      "type": "select",
      "label": "Eliga la Categoria",
      "dependency": "",
      "childs": { "table": "categorias" },
      "requirements": {}
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear Categoria",
      "click": "",
      "submit": "subcategoria"
    }
  ],
  [
    {
      "title": ["Editar Producto", "Crear Producto"],
      "req": { "table": "productos" },
      "tableC": [{ "table": "categorias" }, { "table": "subcategoria" }],
      "path": "Productos"
    },
    {
      "id": "nombre_producto",
      "type": "input",
      "label": "Nombre Producto",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "precio_producto",
      "typeOf": "number",
      "type": "input",
      "label": "Precio Producto",
      "dependency": "",
      "requirements": {
        "maxLength": 19,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "stock",
      "type": "input",
      "label": "Stock",
      "dependency": "",
      "requirements": {
        "maxLength": 100,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "descripcion",
      "typeOf": "string",
      "type": "input",
      "label": "Descripción",
      "dependency": "",
      "requirements": {
        "maxLength": 19,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "imagen_producto",
      "type": "img",
      "label": "",
      "dependency": "",
      "childs": [],
      "requirements": { "minLength": 0 }
    },
    {
      "id": "categoria",
      "type": "select",
      "label": "Eliga la Categoria",
      "changeTable": { "table": "subcategoria", "columnDependency": "categoria" },
      "childs": { "table": "categorias" },
      "requirements": {}
    },
    {
      "id": "subcategoria",
      "type": "select",
      "label": "Eliga la Subcategoria",
      "dependency": { "elemento": "categoria" },
      "childs": { "table": "subcategoria" },
      "requirements": {}
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear Producto",
      "click": "",
      "submit": "productos"
    }
  ],
  [
    {
      "title": ["Editar Usuario", "Crear Usuario"],
      "req": { "table": "usuarios" },
      "tableC": [{ "table": "membresias" }, { "table": "roles" }],
      "path": "Usuarios"
    },
    {
      "id": "nombre",
      "type": "input",
      "label": "ingrese el nombre",
      "dependency": "",
      "requirements": {
        "maxLength": 25,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "apellido",
      "type": "input",
      "label": "ingrese el apellido",
      "dependency": "",
      "requirements": {
        "maxLength": 25,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "nombre_usuario",
      "type": "input",
      "label": "ingrese el nombre de usuario",
      "dependency": "",
      "requirements": {
        "maxLength": 20,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "pss",
      "typeOf": "password",
      "type": "input",
      "label": "ingrese su contraseña",
      "dependency": "",
      "requirements": {
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "rol",
      "type": "select",
      "label": "Eliga el rol",
      "dependency": "",
      "childs": { "table": "roles" },
      "requirements": {
		"minLength": 1
      }
    },
    {
      "id": "correo_electronico",
      "type": "input",
      "label": "ingrese el correo electronico",
      "dependency": "",
      "requirements": {
        "maxLength": 30,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "numero_telefono",
      "typeOf": "number",
      "type": "input",
      "label": "ingrese el numero de telefono",
      "dependency": "",
      "requirements": {
        "maxLength": 12,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "url_foto_perfil",
      "type": "img",
      "label": "",
      "dependency": "",
      "childs": ["anoche", "ayer", "hoy"],
      "requirements": { "minLength": 0 }
    },
    {
      "id": "patrocinador",
      "typeOf": "string",
      "type": "input",
      "label": "ingrese el patrocinador",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "membresia",
      "type": "select",
      "label": "Eliga la membresia",
      "dependency": "",
      "childs": { "table": "membresias" },
      "requirements": {
		"minLength": 1
      }
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear Usuario",
      "click": "",
      "submit": "usuarios"
    }
  ],
  [
    {
      "title": ["Editar Membresia", "Crear Membresia"],
      "req": { "table": "membresias" },
      "path": "Membresias"
    },
    {
      "id": "nombre_membresia",
      "type": "input",
      "label": "Nombre Membresia",
      "dependency": "",
      "requirements": {
        "maxLength": 50,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "precio_membresia",
      "typeOf": "number",
      "type": "input",
      "label": "precio membresia",
      "dependency": "",
      "childs": ["anoche", "ayer", "hoy"],
      "requirements": { "minLength": 5 }
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear Membresia",
      "click": "",
      "submit": "membresias"
    }
  ],
  [
    {
      "title": ["Editar bono", "Crear bono"],
      "req": { "table": "bonos" },
      "path": "Bonos"
    },
    {
      "id": "nombre_bono",
      "type": "input",
      "label": "Nombre Bono",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "porcentaje",
      "typeOf": "number",
      "type": "input",
      "label": "Porcentaje Bono",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "tipo",
      "type": "input",
      "label": "Tipo",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "id": "costo_activacion",
      "typeOf": "number",
      "type": "input",
      "label": "Costo Activación",
      "dependency": "",
      "requirements": {
        "maxLength": 9,
        "minLength": 1,
        "value": []
      }
    },
    {
      "variant": "contained",
      "type": "submit",
      "label": "Crear bono",
      "click": "",
      "submit": "bonos"
    }
  ]
]
', '
[
  {
    "id": 1,
    "value": "Categorias",
    "icon": "<CategoryIcon />",
    "colorText": "white",
    "childs": [
      {
        "id": 2,
        "value": "Crear",
        "colorText": "white",
        "click": "/Administrador/Categorias/Crear"
      },
      {
        "id": 3,
        "value": "Ver Lista",
        "colorText": "white",
        "click": "/Administrador/Categorias/Lista"
      },
      {
        "id": 30,
        "value": "Subcategorias",
        "colorText": "white",
        "childs": [
          {
            "id": 31,
            "value": "Crear",
            "colorText": "white",
            "click": "/Administrador/Categorias/Subcategorias/Crear"
          },
          {
            "id": 32,
            "value": "Ver Lista",
            "colorText": "white",
            "click": "/Administrador/Categorias/Subcategorias/Lista"
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "value": "Productos",
    "icon": "<Inventory2Icon />",
    "colorText": "white",
    "childs": [
      {
        "id": 5,
        "value": "Crear",
        "colorText": "white",
        "click": "/Administrador/Productos/Crear"
      },
      {
        "id": 6,
        "value": "Ver Lista",
        "colorText": "white",
        "click": "/Administrador/Productos/Lista"
      }
    ]
  },
  {
    "id": 7,
    "value": "Usuarios",
    "icon": "<PeopleIcon />",
    "colorText": "white",
    "childs": [
      {
        "id": 8,
        "value": "Crear",
        "colorText": "white",
        "click": "/Administrador/Usuarios/Crear"
      },
      {
        "id": 9,
        "value": "Ver Lista",
        "colorText": "white",
        "click": "/Administrador/Usuarios/Lista"
      }
    ]
  },
  {
    "id": 10,
    "value": "Membresias",
    "icon": "<CardMembershipIcon />",
    "colorText": "white",
    "childs": [
      {
        "id": 11,
        "value": "Crear",
        "colorText": "white",
        "click": "/Administrador/Membresias/Crear"
      },
      {
        "id": 12,
        "value": "Ver Lista",
        "colorText": "white",
        "click": "/Administrador/Membresias/Lista"
      }
    ]
  },
  {
    "id": 13,
    "value": "Bonos",
    "icon": "<CardGiftcardIcon />",
    "colorText": "white",
    "childs": [
      {
        "id": 14,
        "value": "Crear",
        "colorText": "white",
        "click": "/Administrador/Bonos/Crear"
      },
      {
        "id": 15,
        "value": "Ver Lista",
        "colorText": "white",
        "click": "/Administrador/Bonos/Lista"
      }
    ]
  }
]'
);

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
