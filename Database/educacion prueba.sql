-- Insertar temas en la tabla educacion
INSERT INTO educacion (id_tema, tema) VALUES 
(1 , 'Matemáticas'),
(2 , 'Historia'),
(3 , 'Ciencias Naturales'),
(4 , 'Lengua y Literatura'),
(5 , 'Tecnología');

-- Insertar contenidos relacionados en la tabla contenido_tema
INSERT INTO contenido_tema (url_documentos, url_videos, tema) VALUES
('https://docs.matematicas.com/algebra.pdf', 'https://youtu.be/efSKI1VijGA?si=sXkz-N9LRucWWXKj', 1),
('https://docs.matematicas.com/geometria.pdf', 'https://youtu.be/5jieyFFip5I?si=OXNMnfxfUJCq72B6', 1),

('https://docs.historia.com/edad_media.pdf', 'https://youtu.be/HZsvJ7D97Gc?si=BivigW_qg1ILHdcU', 2),
('https://docs.historia.com/revolucion_francesa.pdf', 'https://youtu.be/zHNNe9KbSHo?si=dFDewI7C-7lierLB', 2),

('https://docs.ciencias.com/biologia.pdf', 'https://youtu.be/vrjY4mTFulQ?si=L_FkybH4hhCy-unY', 3),
('https://docs.ciencias.com/fisica.pdf', 'https://youtu.be/ZJU69L9B9q0?si=Z2bHqeKJr7PHVRis', 3),

('https://docs.lengua.com/gramatica.pdf', 'https://youtu.be/Nv_pyMGYlx8?si=fsFUgp_R6K9A0hmb', 4),
('https://docs.lengua.com/literatura.pdf', 'https://youtu.be/cHPPuRCBC_U?si=zQ3yFL3Oj_4ePt7y', 4),

('https://docs.tecnologia.com/programacion.pdf', 'https://youtu.be/rvsZ4QHZyhk?si=-KsYJkXCwyFuUITt', 5),
('https://docs.tecnologia.com/robotica.pdf', 'https://youtu.be/gMbZplPJBAY?si=_-AaPC24IjF93T19', 5);
