-- Insertar categorías
INSERT INTO categorias (id_categoria, nombre_categoria, img_categoria, activo) VALUES
  (1, 'frutas',   'static/uploads/category_imagens/frutas.png',  1),
  (2, 'bebidas',  'static/uploads/category_imagens/bebidas.png', 1);

-- Insertar subcategorías
INSERT INTO subcategoria (id_subcategoria, nombre_subcategoria, categoria, activo) VALUES
  (1, 'manzanas',     1, 1),
  (2, 'tomates',      1, 1),
  (3, 'energisantes', 2, 1),
  (4, 'cerveza',      2, 1),
  (5, 'gaseosas',     2, 1);

-- Subcategoría 1: manzanas
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock)
VALUES
  (1, 1, 'Manzana Roja',        3000,
    'static/uploads/product_images/manzana_roja.jpg',
    'static/uploads/product_images/manzana_roja1.jpg,static/uploads/product_images/manzana_roja2.jpg,static/uploads/product_images/manzana_roja3.jpg',
    'Manzanas rojas frescas', 100),
  (1, 1, 'Manzana Verde',       3200,
    'static/uploads/product_images/manzana_verde.jpg',
    'static/uploads/product_images/manzana_verde1.jpg,static/uploads/product_images/manzana_verde2.jpg,static/uploads/product_images/manzana_verde3.jpg',
    'Manzanas verdes crocantes',  90),
  (1, 1, 'Manzana Fuji',        3500,
    'static/uploads/product_images/manzana_fuji.jpg',
    'static/uploads/product_images/manzana_fuji1.jpg,static/uploads/product_images/manzana_fuji2.jpg,static/uploads/product_images/manzana_fuji3.jpg',
    'Manzanas Fuji dulces',  80),
  (1, 1, 'Manzana Golden',      3300,
    'static/uploads/product_images/manzana_golden.jpg',
    'static/uploads/product_images/manzana_golden1.jpg,static/uploads/product_images/manzana_golden2.jpg,static/uploads/product_images/manzana_golden3.jpg',
    'Manzanas golden premium', 70),
  (1, 1, 'Manzana en Rodajas',  2000,
    'static/uploads/product_images/rodajas_manzana.jpg',
    'static/uploads/product_images/rodajas1.jpg,static/uploads/product_images/rodajas2.jpg,static/uploads/product_images/rodajas3.jpg',
    'Rodajas de manzana listas para comer', 60);

-- Subcategoría 2: tomates
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock)
VALUES
  (1, 2, 'Tomate Cherry',   2500,
    'static/uploads/product_images/tomate_cherry.jpg',
    'static/uploads/product_images/tomate_cherry1.jpg,static/uploads/product_images/tomate_cherry2.jpg,static/uploads/product_images/tomate_cherry3.jpg',
    'Tomates cherry frescos', 100),
  (1, 2, 'Tomate Perita',   2200,
    'static/uploads/product_images/tomate_perita.jpg',
    'static/uploads/product_images/tomate_perita1.jpg,static/uploads/product_images/tomate_perita2.jpg,static/uploads/product_images/tomate_perita3.jpg',
    'Tomates perita ideales para salsa', 90),
  (1, 2, 'Tomate Roma',     2000,
    'static/uploads/product_images/tomate_roma.jpg',
    'static/uploads/product_images/tomate_roma1.jpg,static/uploads/product_images/tomate_roma2.jpg,static/uploads/product_images/tomate_roma3.jpg',
    'Tomate Roma carnoso', 85),
  (1, 2, 'Tomate en Cubos', 2700,
    'static/uploads/product_images/tomate_cubos.jpg',
    'static/uploads/product_images/tomate_cubos1.jpg,static/uploads/product_images/tomate_cubos2.jpg,static/uploads/product_images/tomate_cubos3.jpg',
    'Tomate en cubos envasado', 75),
  (1, 2, 'Tomate Seco',     5000,
    'static/uploads/product_images/tomate_seco.jpg',
    'static/uploads/product_images/tomate_seco1.jpg,static/uploads/product_images/tomate_seco2.jpg,static/uploads/product_images/tomate_seco3.jpg',
    'Tomate seco al sol', 50);

-- Subcategoría 3: energizantes
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock)
VALUES
  (2, 3, 'Vive100 Original', 4500,
    'static/uploads/product_images/vive100.jpg',
    'static/uploads/product_images/vive100_1.jpg,static/uploads/product_images/vive100_2.jpg,static/uploads/product_images/vive100_3.jpg',
    'Bebida energizante colombiana con cafeína y vitaminas', 200),
  (2, 3, 'Volt Max',        4500,
    'static/uploads/product_images/volt.jpg',
    'static/uploads/product_images/volt1.jpg,static/uploads/product_images/volt2.jpg,static/uploads/product_images/volt3.jpg',
    'Energizante con sabor a frutas tropicales', 180),
  (2, 3, 'Red Bull',        8000,
    'static/uploads/product_images/redbull.jpg',
    'static/uploads/product_images/redbull1.jpg,static/uploads/product_images/redbull2.jpg,static/uploads/product_images/redbull3.jpg',
    'Energizante internacional muy consumido en Colombia', 160),
  (2, 3, 'Monster Energy',   9000,
    'static/uploads/product_images/monster.jpg',
    'static/uploads/product_images/monster1.jpg,static/uploads/product_images/monster2.jpg,static/uploads/product_images/monster3.jpg',
    'Alta dosis de energía con sabor intenso', 150),
  (2, 3, 'Spidmax',       4000,
    'static/uploads/product_images/spidmax.jpg',
    'static/uploads/product_images/spidmax1.jpg,static/uploads/product_images/spidmax2.jpg,static/uploads/product_images/spidmax.jpg',
    'Energizante con esencia cítrica', 140);

-- Subcategoría 4: cerveza
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock)
VALUES
  (2, 4, 'Cerveza Poker',            3000,
    'static/uploads/product_images/poker.jpg',
    'static/uploads/product_images/poker1.jpg,static/uploads/product_images/poker2.jpg,static/uploads/product_images/poker3.jpg',
    'Cerveza popular colombiana tipo Lager', 300),
  (2, 4, 'Cerveza Águila',           3300,
    'static/uploads/product_images/aguila.jpg',
    'static/uploads/product_images/aguila1.jpg,static/uploads/product_images/aguila2.jpg,static/uploads/product_images/aguila3.jpg',
    'Refrescante y suave, muy tradicional en Colombia', 280),
  (2, 4, 'Club Colombia Dorada',     3500,
    'static/uploads/product_images/club_colombia.jpg',
    'static/uploads/product_images/club1.jpg,static/uploads/product_images/club2.jpg,static/uploads/product_images/club3.jpg',
    'Cerveza premium dorada con sabor equilibrado', 260),
  (2, 4, 'Cerveza Costeña',          3200,
    'static/uploads/product_images/costena.jpg',
    'static/uploads/product_images/costena1.jpg,static/uploads/product_images/costena2.jpg,static/uploads/product_images/costena3.jpg',
    'Cerveza costeña con sabor tradicional', 240),
  (2, 4, 'Corona',                   6000,
    'static/uploads/product_images/corona.jpg',
    'static/uploads/product_images/corona1.jpg,static/uploads/product_images/corona2.jpg,static/uploads/product_images/corona3.jpg',
    'Cerveza importada, muy consumida en Colombia', 220);

-- Subcategoría 5: gaseosas
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock)
VALUES
  (2, 5, 'Postobón Colombiana', 1800,
    'static/uploads/product_images/colombiana.jpg',
    'static/uploads/product_images/colombiana1.jpg,static/uploads/product_images/colombiana2.jpg,static/uploads/product_images/colombiana3.jpg',
    'Gaseosa con sabor tradicional colombiano', 500),
  (2, 5, 'Manzana Postobón',    1800,
    'static/uploads/product_images/manzana.jpg',
    'static/uploads/product_images/manzana1.jpg,static/uploads/product_images/manzana2.jpg,static/uploads/product_images/manzana3.jpg',
    'Refresco dulce con sabor a manzana', 480),
  (2, 5, 'Uva Postobón',        1800,
    'static/uploads/product_images/uva_postobon.jpg',
    'static/uploads/product_images/uva1.jpg,static/uploads/product_images/uva2.jpg,static/uploads/product_images/uva3.jpg',
    'Gaseosa sabor uva intensa', 460),
  (2, 5, 'Naranja Postobón',    1800,
    'static/uploads/product_images/naranja_postobon.jpg',
    'static/uploads/product_images/naranja1.jpg,static/uploads/product_images/naranja2.jpg,static/uploads/product_images/naranja3.jpg',
    'Refresco de naranja artificial', 440),
  (2, 5, 'H2O Limónata',        2000,
    'static/uploads/product_images/h2o_limonata.jpg',
    'static/uploads/product_images/h2o_limonata1.jpg,static/uploads/product_images/h2o_limonata2.jpg,static/uploads/product_images/h2o_limonata3.jpg',
    'Refresco de limón con gas', 420);
