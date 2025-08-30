-- Insertar categorías
INSERT INTO categorias (id_categoria, nombre_categoria, img_categoria, activo) VALUES
  (1, 'frutas',   'category_imagens/frutas.png',  1),
  (2, 'bebidas',  'category_imagens/bebidas.png', 1);

-- Insertar subcategorías
INSERT INTO subcategoria (id_subcategoria, nombre_subcategoria, categoria, activo) VALUES
  (1, 'manzanas',     1, 1),
  (2, 'tomates',      1, 1),
  (3, 'energisantes', 2, 1),
  (4, 'cerveza',      2, 1),
  (5, 'gaseosas',     2, 1);

-- Productos: Manzanas
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock) VALUES
  (1, 1, 'Manzana Roja',        4800, 'product_images/manzana_roja.jpg', 'product_images/manzana_roja1.jpg,product_images/manzana_roja2.jpg,product_images/manzana_roja3.jpg', 'Manzanas rojas frescas', 100),
  (1, 1, 'Manzana Verde',       5000, 'product_images/manzana_verde.jpg', 'product_images/manzana_verde1.jpg,product_images/manzana_verde2.jpg,product_images/manzana_verde3.jpg', 'Manzanas verdes crocantes', 90),
  (1, 1, 'Manzana Fuji',        5500, 'product_images/manzana_fuji.jpg', 'product_images/manzana_fuji1.jpg,product_images/manzana_fuji2.jpg,product_images/manzana_fuji3.jpg', 'Manzanas Fuji dulces', 80),
  (1, 1, 'Manzana Golden',      5200, 'product_images/manzana_golden.jpg', 'product_images/manzana_golden1.jpg,product_images/manzana_golden2.jpg,product_images/manzana_golden3.jpg', 'Manzanas golden premium', 70),
  (1, 1, 'Manzana en Rodajas',  2500, 'product_images/rodajas_manzana.jpg', 'product_images/rodajas1.jpg,product_images/rodajas2.jpg,product_images/rodajas3.jpg', 'Rodajas de manzana listas para comer', 60);

-- Productos: Tomates
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock) VALUES
  (1, 2, 'Tomate Cherry',   4200, 'product_images/tomate_cherry.jpg', 'product_images/tomate_cherry1.jpg,product_images/tomate_cherry2.jpg,product_images/tomate_cherry3.jpg', 'Tomates cherry frescos', 100),
  (1, 2, 'Tomate Perita',   3600, 'product_images/tomate_perita.jpg', 'product_images/tomate_perita1.jpg,product_images/tomate_perita2.jpg,product_images/tomate_perita3.jpg', 'Tomates perita ideales para salsa', 90),
  (1, 2, 'Tomate Roma',     3400, 'product_images/tomate_roma.jpg', 'product_images/tomate_roma1.jpg,product_images/tomate_roma2.jpg,product_images/tomate_roma3.jpg', 'Tomate Roma carnoso', 85),
  (1, 2, 'Tomate en Cubos', 5000, 'product_images/tomate_cubos.jpg', 'product_images/tomate_cubos1.jpg,product_images/tomate_cubos2.jpg,product_images/tomate_cubos3.jpg', 'Tomate en cubos envasado', 75),
  (1, 2, 'Tomate Seco',     8000, 'product_images/tomate_seco.jpg', 'product_images/tomate_seco1.jpg,product_images/tomate_seco2.jpg,product_images/tomate_seco3.jpg', 'Tomate seco al sol', 50);

-- Productos: Energizantes
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock) VALUES
  (2, 3, 'Vive100 Original', 2500, 'product_images/vive100.jpg', 'product_images/vive100_1.jpg,product_images/vive100_2.jpg,product_images/vive100_3.jpg', 'Bebida energizante colombiana con cafeína y vitaminas', 200),
  (2, 3, 'Volt Max',         3000, 'product_images/volt.jpg', 'product_images/volt1.jpg,product_images/volt2.jpg,product_images/volt3.jpg', 'Energizante con sabor a frutas tropicales', 180),
  (2, 3, 'Red Bull',         7500, 'product_images/redbull.jpg', 'product_images/redbull1.jpg,product_images/redbull2.jpg,product_images/redbull3.jpg', 'Energizante internacional muy consumido en Colombia', 160),
  (2, 3, 'Monster Energy',   8500, 'product_images/monster.jpg', 'product_images/monster1.jpg,product_images/monster2.jpg,product_images/monster3.jpg', 'Alta dosis de energía con sabor intenso', 150),
  (2, 3, 'Spidmax',          2800, 'product_images/spidmax.jpg', 'product_images/spidmax1.jpg,product_images/spidmax2.jpg,product_images/spidmax.jpg', 'Energizante con esencia cítrica', 140);

-- Productos: Cervezas
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock) VALUES
  (2, 4, 'Cerveza Poker',         2900, 'product_images/poker.jpg', 'product_images/poker1.jpg,product_images/poker2.jpg,product_images/poker3.jpg', 'Cerveza popular colombiana tipo Lager', 300),
  (2, 4, 'Cerveza Águila',        3000, 'product_images/aguila.jpg', 'product_images/aguila1.jpg,product_images/aguila2.jpg,product_images/aguila3.jpg', 'Refrescante y suave, muy tradicional en Colombia', 280),
  (2, 4, 'Club Colombia Dorada',  3800, 'product_images/club_colombia.jpg', 'product_images/club1.jpg,product_images/club2.jpg,product_images/club3.jpg', 'Cerveza premium dorada con sabor equilibrado', 260),
  (2, 4, 'Cerveza Costeña',       3100, 'product_images/costena.jpg', 'product_images/costena1.jpg,product_images/costena2.jpg,product_images/costena3.jpg', 'Cerveza costeña con sabor tradicional', 240),
  (2, 4, 'Corona',                6700, 'product_images/corona.jpg', 'product_images/corona1.jpg,product_images/corona2.jpg,product_images/corona3.jpg', 'Cerveza importada, muy consumida en Colombia', 220);

-- Productos: Gaseosas
INSERT INTO productos (categoria, subcategoria, nombre_producto, precio_producto, imagen_producto, imgs_publicidad, descripcion, stock) VALUES
  (2, 5, 'Postobón Colombiana', 2200, 'product_images/colombiana.jpg', 'product_images/colombiana1.jpg,product_images/colombiana2.jpg,product_images/colombiana3.jpg', 'Gaseosa con sabor tradicional colombiano', 500),
  (2, 5, 'Manzana Postobón',    2200, 'product_images/manzana.jpg', 'product_images/manzana1.jpg,product_images/manzana2.jpg,product_images/manzana3.jpg', 'Refresco dulce con sabor a manzana', 480),
  (2, 5, 'Uva Postobón',        2200, 'product_images/uva_postobon.jpg', 'product_images/uva1.jpg,product_images/uva2.jpg,product_images/uva3.jpg', 'Gaseosa sabor uva intensa', 460),
  (2, 5, 'Naranja Postobón',    2200, 'product_images/naranja_postobon.jpg', 'product_images/naranja1.jpg,product_images/naranja2.jpg,product_images/naranja3.jpg', 'Refresco de naranja artificial', 440),
  (2, 5, 'H2O Limónata',        2500, 'product_images/h2o_limonata.jpg', 'product_images/h2o_limonata1.jpg,product_images/h2o_limonata2.jpg,product_images/h2o_limonata3.jpg', 'Refresco de limón con gas', 420);
