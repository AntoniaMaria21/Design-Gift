-- 1. Crearea tipului ENUM pentru coloana categorie_mare (domeniul cadouri personalizate)
CREATE TYPE categorie_mare_enum AS ENUM ('papetarie', 'accesorii', 'vestimentar', 'decor', 'diverse');

-- 2. Crearea tabelului "produse"
CREATE TABLE produse (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    descriere TEXT,
    cale_imagine TEXT,  -- se salvează doar calea către imagine; se recomandă să înceapă cu "/imagini/galerie/"
    categorie_mare categorie_mare_enum NOT NULL,
    subcategorie VARCHAR(255),
    pret NUMERIC(10,2) NOT NULL,
    caracteristica_secundara NUMERIC(10,2),
    data_adaugare DATE,
    culoare VARCHAR(50),
    ingrediente TEXT,
    disponibil BOOLEAN
);

-- 3. Inserarea celor 15 entități pentru cadouri personalizate
INSERT INTO produse (nume, descriere, cale_imagine, categorie_mare, subcategorie, pret, caracteristica_secundara, data_adaugare, culoare, ingrediente, disponibil) VALUES
  -- 1. Jurnale personalizate
  (
    'Jurnale personalizate', 
    'Jurnale personalizate pentru ocazii speciale', 
    '/imagini/galerie/1.png', 
    'papetarie', 
    'jurnale', 
    20.00, 
    100, 
    '2023-01-01', 
    'albastru', 
    'hartie, copertă cartonată', 
    true
  ),
  -- 2. Felicitări personalizate
  (
    'Felicitari personalizate', 
    'Felicitari personalizate pentru ocazii speciale', 
    '/imagini/galerie/2.png', 
    'papetarie', 
    'felicitari', 
    15.00, 
    50, 
    '2023-01-02', 
    'rosu', 
    'hartie, cerneală', 
    true
  ),
  -- 3. Cutii împachetare
  (
    'Cutii împachetare', 
    'Cutii împachetare cadouri speciale', 
    '/imagini/galerie/3.png', 
    'papetarie', 
    'cutii', 
    10.00, 
    30, 
    '2023-01-03', 
    'verde', 
    'cardboard, bandă adezivă', 
    true
  ),
  -- 4. Cană personalizată de Crăciun
  (
    'Cană personalizata de Crăciun', 
    'Cană personalizata de Crăciun pentru a oferi cadouri unice', 
    '/imagini/galerie/4.png', 
    'accesorii', 
    'cantele', 
    12.00, 
    40, 
    '2023-01-04', 
    'rosu', 
    'ceramică', 
    true
  ),
  -- 5. Cană personalizată de Valentine''s Day
  (
    'Cană personalizata de Valentine''s Day', 
    'Cană personalizata de Valentine''s Day pentru a surprinde persoana iubită', 
    '/imagini/galerie/5.png', 
    'accesorii', 
    'cantele', 
    12.00, 
    45, 
    '2023-01-05', 
    'roz', 
    'ceramică', 
    true
  ),
  -- 6. Tricouri din bumbac organic
  (
    'Tricouri din bumbac organic', 
    'Tricouri personalizate din bumbac organic pentru cadouri unice', 
    '/imagini/galerie/6.png', 
    'vestimentar', 
    'tricouri', 
    25.00, 
    1, 
    '2023-01-06', 
    'alb', 
    'bumbac', 
    true
  ),
  -- 7. Tricou personalizat Coffee lover
  (
    'Tricou personalizat Coffee lover', 
    'Tricou personalizat pentru iubitorii de cafea', 
    '/imagini/galerie/7.png', 
    'vestimentar', 
    'tricouri', 
    30.00, 
    1, 
    '2023-01-07', 
    'maro', 
    'bumbac', 
    true
  ),
  -- 8. Tablou Never Give Up
  (
    'Tablou Never Give Up', 
    'Tablou motivațional, perfect pentru decorul casei sau biroului', 
    '/imagini/galerie/8.png', 
    'decor', 
    'tablouri', 
    50.00, 
    1, 
    '2023-01-08', 
    'multicolor', 
    'pictură', 
    true
  ),
  -- 9. Tablouri diverse
  (
    'Tablouri diverse', 
    'Tablouri personalizate pentru decor și inspirație', 
    '/imagini/galerie/9.png', 
    'decor', 
    'tablouri', 
    45.00, 
    1, 
    '2023-01-09', 
    'multicolor', 
    'pictură', 
    true
  ),
  -- 10. Produse Give Away
  (
    'Produse Give Away', 
    'Seturi de cadouri speciale pentru evenimente și promoții', 
    '/imagini/galerie/10.png', 
    'diverse', 
    'giveaway', 
    5.00, 
    1, 
    '2023-01-10', 
    'negru', 
    'diverse', 
    true
  ),
  -- 11. Căni personalizate pentru absolvire
  (
    'Cani personalizate pentru absolvire', 
    'Căni personalizate pentru a marca momentul absolviri', 
    '/imagini/galerie/11.png', 
    'accesorii', 
    'cantele', 
    8.00, 
    1, 
    '2023-01-11', 
    'albastru', 
    'plastic, ceramică', 
    true
  ),
  -- 12. Cană personalizată I love you
  (
    'Cană personalizată I love you', 
    'Cană personalizată cu mesajul "I love you" pentru cadouri romantice', 
    '/imagini/galerie/12.png', 
    'accesorii', 
    'cantele', 
    12.00, 
    1, 
    '2023-01-12', 
    'roz', 
    'ceramică', 
    true
  ),
  -- 13. Cană personalizată My favorite people call me DAD
  (
    'Cană personalizată My favorite people call me DAD', 
    'Cană personalizată cu mesaj amuzant pentru tați', 
    '/imagini/galerie/13.png', 
    'accesorii', 
    'cantele', 
    12.00, 
    1, 
    '2023-01-13', 
    'albastru', 
    'ceramică', 
    true
  ),
  -- 14. Cană personalizată Baby, it's cold outside!
  (
    'Cană personalizată Baby, it''s cold outside!', 
    'Cană personalizată cu design pentru sezonul rece', 
    '/imagini/galerie/14.png', 
    'accesorii', 
    'cantele', 
    12.00, 
    1, 
    '2023-01-14', 
    'albastru', 
    'ceramică', 
    true
  ),
  -- 15. Duplicate Jurnale personalizate (pentru test)
  (
    'Jurnale personalizate', 
    'Jurnale personalizate pentru ocazii speciale', 
    '/imagini/galerie/1.png', 
    'papetarie', 
    'jurnale', 
    20.00, 
    100, 
    '2023-01-15', 
    'albastru', 
    'hartie, copertă cartonată', 
    true
  );
