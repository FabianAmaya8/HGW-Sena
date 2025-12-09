-- Temas principales
INSERT INTO educacion (id_tema, tema) VALUES 
(1 , 'sobre nosotros'),
(2 , 'guia comercial'),
(3 , 'sistema de referidos'),
(4 , 'sistema de membresias'),
(5 , 'como contactarnos');

-- Contenidos por tema
INSERT INTO contenido_tema (titulo, url_contenido, tema) VALUES
-- Tema 1: Sobre nosotros
('Video presentación institucional', 'https://youtu.be/efSKI1VijGA?si=sXkz-N9LRucWWXKj', 1),
('Documento: Historia de la empresa', 'https://docs.matematicas.com/geometria.pdf', 1),

-- Tema 2: Guía comercial
('Video: Introducción a ventas', 'https://youtu.be/HZsvJ7D97Gc?si=BivigW_qg1ILHdcU', 2),
('Documento: Estrategias comerciales', 'https://docs.historia.com/revolucion_francesa.pdf', 2),

-- Tema 3: Sistema de referidos
('Video: Cómo funciona el sistema de referidos', 'https://youtu.be/vrjY4mTFulQ?si=L_FkybH4hhCy-unY', 3),
('Documento: Preguntas frecuentes de referidos', 'https://docs.ciencias.com/fisica.pdf', 3),

-- Tema 4: Sistema de membresías
('Video: Tipos de membresías', 'https://youtu.be/Nv_pyMGYlx8?si=fsFUgp_R6K9A0hmb', 4),
('Documento: Beneficios de las membresías', 'https://docs.lengua.com/literatura.pdf', 4),

-- Tema 5: Cómo contactarnos
('Video: Canales de atención', 'https://youtu.be/rvsZ4QHZyhk?si=-KsYJkXCwyFuUITt', 5),
('Documento: Manual de atención al cliente', 'https://docs.tecnologia.com/robotica.pdf', 5);
