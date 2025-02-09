// ETAPA 4.1 initalizare prin npm init
// ETAPA 4.2 fisier index server

const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");

const app = express();

const PORT = 8080;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// Adăugăm conexiunea la PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Timewatch132021!@localhost:5432/postgres'
});

app.use(express.static(path.join(__dirname, "public")));

global.folderScss = path.join(__dirname, "public", "scss");
global.folderCss = path.join(__dirname, "public", "css");
global.folderBackup = path.join(__dirname, "backup");

app.use("/css", express.static(path.join(__dirname, "public", "css")));

const sharp = require("sharp");

const vect_foldere = [
  "temp", // Folder temporar (nu este utilizat în mod direct în cod, dar poate fi util).
  global.folderScss, // Folderul unde stocăm fișierele SCSS.
  global.folderCss, // Folderul unde vor fi salvate fișierele CSS compilate.
  global.folderBackup, // Folderul unde salvăm backup-uri CSS (copii de siguranță).
  path.join(__dirname, "public"), // Folderul "public" care conține resurse statice (imagini, CSS, JS, fonturi).
];

vect_foldere.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    // Dacă folderul NU există:
    fs.mkdirSync(folder, { recursive: true }); // Îl creăm automat.
  }
});

function compileazaScss(caleScss, caleCss) {
  try {
    const inputPath = path.isAbsolute(caleScss)
      ? caleScss
      : path.join(global.folderScss, caleScss);

    let outputPath;

    if (caleCss) {
      outputPath = path.isAbsolute(caleCss)
        ? caleCss
        : path.join(global.folderCss, caleCss);
    } else {
      const relativePath = path.relative(global.folderScss, inputPath);
      outputPath = path.join(
        global.folderCss,
        relativePath.replace(/\.scss$/, ".css")
      );
    }

    if (fs.existsSync(outputPath)) {
      const backupPath = path.join(
        global.folderBackup, // Salvăm backup-ul în folderul "backup"
        "public",
        "css",
        path.relative(global.folderCss, outputPath)
      );

      try {
        fs.mkdirSync(path.dirname(backupPath), { recursive: true }); // Creăm folderul backup, dacă nu există
        fs.copyFileSync(outputPath, backupPath); // Copiem fișierul CSS existent în backup
      } catch (err) {
        console.error(`Eroare backup ${outputPath}:`, err.message);
      }
    }

    const result = sass.compile(inputPath, {
      loadPaths: [
        path.join(__dirname, "node_modules"), // Permite utilizarea bibliotecilor SCSS din "node_modules"
      ],
    });

    fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Creăm folderul CSS dacă nu există
    fs.writeFileSync(outputPath, result.css); // Salvăm conținutul CSS compilat

    console.log(`Compilat: ${inputPath} -> ${outputPath}`);
  } catch (err) {
    console.error(`Eroare compilare ${caleScss}:`, err.message);
  }
}

function compilareInitiala() {
  const customScssPath = path.join(global.folderScss, "custom.scss");

  if (fs.existsSync(customScssPath)) {
    compileazaScss("custom.scss", "custom.css");
  }

  function traverse(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (
        entry.isFile() &&
        path.extname(entry.name) === ".scss" &&
        entry.name !== "custom.scss"
      ) {
        const relativePath = path.relative(global.folderScss, fullPath);

        compileazaScss(relativePath);
      }
    });
  }

  traverse(global.folderScss);
}

function setupWatcher() {
  const watcher = fs.watch(
    global.folderScss,
    { recursive: true },
    (event, filename) => {
      if (!filename || !filename.endsWith(".scss")) return;

      const fullPath = path.join(global.folderScss, filename);

      setTimeout(() => {
        if (fs.existsSync(fullPath)) {
          if (filename === "custom.scss") {
            compileazaScss("custom.scss", "custom.css");
          } else {
            compileazaScss(fullPath);
          }
        }
      }, 100); // Așteptăm 100ms înainte de a începe compilarea.
    }
  );

  watcher.on("error", (err) => console.error("Eroare monitorizare:", err));
}

compilareInitiala();

setupWatcher();

const obGlobal = { obErori: null };

const initErori = () => {
  const eroriPath = path.join(__dirname, "erori.json");

  if (fs.existsSync(eroriPath)) {
    obGlobal.obErori = JSON.parse(fs.readFileSync(eroriPath, "utf8"));

    obGlobal.obErori.info_erori.forEach((err) => {
      err.imagine = path.join(obGlobal.obErori.cale_baza, err.imagine);
    });
  }
};

initErori();

// COD INITIAL
// const afisareEroare = (res, identificator, titlu, text, imagine) => {
//   let eroare = obGlobal.obErori.info_erori.find(
//     (e) => e.identificator === identificator
//   );

//   if (!eroare) eroare = obGlobal.obErori.eroare_default;

//   res.status(identificator || 500).render("pagini/eroare", {
//     title: titlu || eroare.titlu, // Titlul paginii de eroare (ex: "Pagina nu a fost găsită")
//     text: text || eroare.text, // Mesajul de eroare afișat utilizatorului
//     imagine: imagine || eroare.imagine, // Imaginea asociată erorii (ex: un simbol de avertizare)
//   });
// };

const afisareEroare = (res, identificator, titlu, text, imagine, url) => {
  // Căutăm eroarea corespunzătoare în obGlobal.obErori
  let eroare = obGlobal.obErori.info_erori.find(
    (e) => e.identificator === identificator
  );
  if (!eroare) eroare = obGlobal.obErori.eroare_default;

  // Apelăm res.render cu un callback
  res.status(identificator || 500).render("pagini/eroare", {
    title: `${titlu || eroare.titlu} - ${url || "URL necunoscut"}`,
    text: text || eroare.text,
    imagine: imagine || eroare.imagine,
  }, function(err, html) {
    if (err) {
      // Dacă eroarea începe cu "Failed to lookup view", afișăm pagina 404
      console.log("eroare...", err)
      if (err.message && err.message.startsWith("Failed to lookup view")) {
        res.status(404).render("pagini/404", { title: "Pagina nu a fost găsită Failed to lookup view" });
      } else {
        // Pentru alte erori, afișăm pagina de eroare generică
        res.status(500).render("pagini/eroare", {
          title: "Eroare server - Eroare generică",
          text: "A apărut o eroare neprevăzută. Vă rugăm încercați din nou mai târziu.",
          imagine: null
        });
      }
    } else {
      // Dacă nu există erori, trimitem rezultatul randării către client
      res.send(html);
    }
  });
};


// Rezolvare task cu eroare 403 la fisier .txt
app.use((req, res, next) => {
  if (req.path.endsWith(".txt")) {
    return afisareEroare(res, 403, "Acces interzis", "Fișierele .txt nu sunt accesibile.");
  }
  next();
});

app.use((req, res, next) => {
  res.locals.ip = req.ip;  // req.ip va returna, în mod local, "::1" pentru localhost
  next();
});


//------------------------------------------
// Adăugăm funcția pentru generarea imaginilor
//------------------------------------------
async function genereazaImaginedacaNuExista(caleOriginala, caleDestinatie, latime) {
  if (!fs.existsSync(caleDestinatie)) {
    // Creăm folderul părinte dacă nu există
    fs.mkdirSync(path.dirname(caleDestinatie), { recursive: true });
    // Generăm imaginea redimensionată
    await sharp(caleOriginala)
      .resize({ width: latime })
      .toFile(caleDestinatie);
  }
}

//------------------------------------------
// Modificăm ruta de start pentru a încărca galeria
//------------------------------------------
app.get(["/", "/index", "/home"], async (req, res) => {
  try {
    // 1. Citim fișierul JSON pentru galerie
    let obGalerie = JSON.parse(fs.readFileSync("galerie.json", "utf8"));

    // 2. Parcurgem imaginile și creăm subfoldere small/medium dacă nu există
    for (const img of obGalerie.imagini) {
      const caleOriginalAbs = path.join(__dirname, "public", obGalerie.cale_galerie, img.fisier_imagine);
      // Adăugăm "public" fix, la fel și pentru small, medium:
      const caleSmallAbs = path.join(__dirname, "public", obGalerie.cale_galerie, "small", img.fisier_imagine);
      const caleMediumAbs = path.join(__dirname, "public", obGalerie.cale_galerie, "medium", img.fisier_imagine);
      
      await genereazaImaginedacaNuExista(caleOriginalAbs, caleSmallAbs, 400);
      await genereazaImaginedacaNuExista(caleOriginalAbs, caleMediumAbs, 800);
    }

    // 3. Afișăm pagina principală, transmițând obGalerie la EJS
    res.render("pagini/index", { 
      title: "Acasă",
      obGalerie: obGalerie 
    });
  } catch (err) {
    console.error("Eroare la încărcarea galeriei:", err);
    // Dacă apare o problemă, afișăm o eroare generică
    afisareEroare(res, 500, "Eroare server", "Nu s-a putut încărca galeria.");
  }
});

app.get("/resurse/*", (req, res, next) => {
  const lastSegment = req.path.split("/").pop();
  if (lastSegment.indexOf('.') === -1) {
    return afisareEroare(
      res,
      403,
      "Acces interzis",
      "Accesul la acest director nu este permis.",
      null,
      req.originalUrl
    );
  }
  next();
});


app.get(["/galerie-statica"], async (req, res) => {
  try {
    // 1. Citim fișierul JSON pentru galerie
    let obGalerie = JSON.parse(fs.readFileSync("galerie.json", "utf8"));

    // 2. Parcurgem imaginile și creăm subfoldere small/medium dacă nu există
    for (const img of obGalerie.imagini) {
      const caleOriginalAbs = path.join(__dirname, "public", obGalerie.cale_galerie, img.fisier_imagine);
      // Adăugăm "public" fix, la fel și pentru small, medium:
      const caleSmallAbs = path.join(__dirname, "public", obGalerie.cale_galerie, "small", img.fisier_imagine);
      const caleMediumAbs = path.join(__dirname, "public", obGalerie.cale_galerie, "medium", img.fisier_imagine);
      
      await genereazaImaginedacaNuExista(caleOriginalAbs, caleSmallAbs, 400);
      await genereazaImaginedacaNuExista(caleOriginalAbs, caleMediumAbs, 800);
    }

    // 3. Afișăm pagina principală, transmițând obGalerie la EJS
    res.render("pagini/galerie-statica", { 
      title: "Galerie Produse",
      obGalerie: obGalerie 
    });
  } catch (err) {
    console.error("Eroare la încărcarea galeriei:", err);
    // Dacă apare o problemă, afișăm o eroare generică
    afisareEroare(res, 500, "Eroare server", "Nu s-a putut încărca galeria.");
  }
});

app.get("/contact", (req, res) => {
  res.render("pagini/contact", { title: "Contact" });
});

app.get("/istoric", (req, res) => {
  res.render("pagini/istoric", { title: "Istoric" });
});


// ********* Ruta /produse actualizată *********
app.get("/produse", async (req, res) => {
  try {
    // Verificăm dacă s-a dat filtrul pe categoria mare din query string (ex: ?categorie=...)
    let categorieSelectata = req.query.categorie || 'toate';

    // Construim interogarea SQL – dacă se dorește filtrarea pe categorie, adăugăm clauza WHERE
    let queryText = "SELECT * FROM produse";
    let queryParams = [];
    if (categorieSelectata !== 'toate') {
      queryText += " WHERE categorie_mare = $1";
      queryParams.push(categorieSelectata);
    }
    const result = await pool.query(queryText, queryParams);
    const produse = result.rows;

    // Preluăm valorile posibile ale categoriei din enumerație (presupunând că enum-ul se numește "categorie_mare_enum")
    let categorii = [];
    try {
      const enumResult = await pool.query("SELECT unnest(enum_range(NULL::categorie_mare_enum)) AS categorie");
      categorii = enumResult.rows.map(r => r.categorie);
    } catch (err) {
      // Dacă interogarea enum nu funcționează, folosim valorile distincte din tabel
      const catResult = await pool.query("SELECT DISTINCT categorie_mare FROM produse");
      categorii = catResult.rows.map(r => r.categorie_mare);
    }

    res.render("pagini/produse", { 
      title: "Produse", 
      produse: produse, 
      categorii: categorii,
      categorieSelectata: categorieSelectata
    });
  } catch (err) {
    console.error("Eroare la preluarea produselor:", err);
    afisareEroare(res, 500, "Eroare server", "Nu s-a putut prelua produsele.");
  }
});
// ********* Sfârșit ruta /produse actualizată *********

app.get("/promotii", (req, res) => {
  res.render("pagini/promotii", { title: "Promoții" });
});

app.get("/eroare", (req, res) => {
  res.render("pagini/eroare", { title: "Eroare" });
});

app.get("/404", (req, res) => {
  res.render("pagini/404", { title: "Pagina nu a fost găsită" });
});

app.get("/403", (req, res) => {
  res.render("pagini/403", { title: "Acces interzis" });
});

app.get("/400", (req, res) => {
  res.render("pagini/400", { title: "Cerere invalidă" });
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

app.get("/*.ejs", (req, res) => {
  afisareEroare(res, 400);
});

app.get("/public/*", (req, res, next) => {
  if (req.path.split("/").pop().indexOf(".") === -1) {
    return afisareEroare(res, 403); // Returnăm eroarea `403 - Acces interzis`
  }
  next(); // Dacă este un fișier valid, continuăm procesarea cererii.
});

// COD INITIAL
// app.get("/*", (req, res) => {
//   const pagina = req.params[0]; // Ex: "/despre" → "despre"
//   const filePath = path.join(__dirname, "views", "pagini", `${pagina}.ejs`);
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       afisareEroare(res, 404);
//     } else {
//       res.render(`pagini/${pagina}`, {
//         title: pagina.charAt(0).toUpperCase() + pagina.slice(1), // Setăm titlul cu literă mare
//       });
//     }
//   });
// });

app.get("/*", (req, res) => {
  const pagina = req.params[0]; 
  const filePath = path.join(__dirname, "views", "pagini", `${pagina}.ejs`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      afisareEroare(res, 404, "Pagina nu a fost găsită", `Pagina ${req.originalUrl} nu există.`, null, req.originalUrl);
    } else {
      res.render(`pagini/${pagina}`, {
        title: pagina.charAt(0).toUpperCase() + pagina.slice(1),
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serverul rulează la http://localhost:${PORT}`);
});
