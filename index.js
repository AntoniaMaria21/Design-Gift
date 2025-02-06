

// =================================================================
// 🔹 Importăm modulele necesare
// =================================================================

// Express.js este un framework care ne ajută să creăm un server web.
// require('express') înseamnă că importăm acest framework pentru a-l putea folosi.
const express = require('express');

// Path este un modul integrat în Node.js care ne ajută să lucrăm cu căile fișierelor
// (ex: să construim corect adrese pentru fișiere pe orice sistem de operare).
const path = require('path');

// FS (File System) este un modul din Node.js care ne permite să lucrăm cu fișierele
// (ex: să citim, scriem sau ștergem fișiere de pe disc).
const fs = require('fs');

// Sass este un compilator pentru fișiere SCSS (un stil mai avansat al CSS-ului).
// Ne ajută să transformăm fișierele SCSS în CSS normal, astfel încât browserul să le poată înțelege.
const sass = require('sass');

// =================================================================
// 🔹 Creăm serverul Express
// =================================================================

// "app" este obiectul principal care va gestiona tot serverul nostru.
// Cu acest obiect putem defini rutele, setările și comportamentul serverului.
const app = express();

// =================================================================
// 🔹 Definim portul pe care serverul va rula
// =================================================================

// Portul este ca o "ușă" prin care utilizatorii pot accesa serverul nostru.
// Aici, setăm serverul să asculte pe portul 8080.
// Asta înseamnă că utilizatorii vor putea accesa site-ul la adresa: http://localhost:8080
const PORT = 8080;


// =================================================================
// 🔹 Configurăm motorul de șabloane EJS și resursele statice
// =================================================================

// 📌 1️⃣ Setăm motorul de template-uri (șabloane) EJS
// "EJS" (Embedded JavaScript) este un sistem care ne permite să folosim cod JavaScript
// direct în paginile HTML pentru a genera conținut dinamic.
app.set('view engine', 'ejs');

// 📌 2️⃣ Specificăm folderul unde se află fișierele EJS (șabloanele paginilor).
// "__dirname" reprezintă directorul curent al fișierului index.js (adică unde este serverul nostru).
// "path.join(__dirname, 'views')" creează o cale corectă spre folderul "views" unde sunt fișierele EJS.
app.set('views', path.join(__dirname, 'views'));

// 📌 3️⃣ Permitem serverului să servească fișiere statice (CSS, imagini, JavaScript, fonturi).
// Folderul "public" conține toate aceste fișiere, iar utilizatorii le pot accesa direct din browser.
// "express.static()" permite accesul la acest folder fără să definim rute speciale pentru fiecare fișier.
app.use(express.static(path.join(__dirname, 'public')));


// =================================================================
// 🔹 Configurăm căi globale pentru folderele esențiale
// =================================================================

// 📌 1️⃣ Definim folderul unde vor fi stocate fișierele SCSS (fișierele sursă pentru stiluri).
// "__dirname" reprezintă directorul unde se află acest fișier (index.js).
// "path.join(__dirname, 'public', 'scss')" creează o cale corectă spre folderul "public/scss".
// Acest folder va conține toate fișierele SCSS care vor fi compilate în CSS.
global.folderScss = path.join(__dirname, 'public', 'scss');

// 📌 2️⃣ Definim folderul unde vor fi salvate fișierele CSS generate din SCSS.
// După ce fișierele SCSS sunt compilate, rezultatul (CSS) va fi salvat aici.
global.folderCss = path.join(__dirname, 'public', 'css');

// 📌 3️⃣ Definim folderul unde vom salva backup-urile fișierelor CSS existente.
// Înainte ca un fișier CSS să fie suprascris de un nou fișier compilat, vom face o copie de siguranță.
// Acest lucru este util pentru a evita pierderea stilurilor în cazul unei erori.
global.folderBackup = path.join(__dirname, 'backup');


// =================================================================
// 🔹 Middleware pentru servirea fișierelor CSS
// =================================================================

// 📌 Middleware-ul este o funcție care rulează înainte ca cererea să ajungă la server.
// Aici folosim "express.static()" pentru a permite accesul la fișierele CSS direct din browser.

// 📌 1️⃣ Setăm Express să servească fișierele CSS din folderul "public/css".
// "app.use('/css', ...)" înseamnă că orice cerere care începe cu "/css" va fi direcționată
// către fișierele care se află în folderul "public/css".

// 📌 2️⃣ Când un utilizator accesează, de exemplu, "http://localhost:8080/css/style.css",
// Express va căuta fișierul "style.css" în folderul "public/css" și îl va trimite utilizatorului.

app.use('/css', express.static(path.join(__dirname, 'public', 'css')));


// =================================================================
// 🔹 Creare automată a folderelor necesare
// =================================================================

// 📌 1️⃣ Definim o listă (array) care conține folderele esențiale pentru funcționarea serverului.
// Dacă aceste foldere nu există, le vom crea automat la pornirea serverului.
const vect_foldere = [
    'temp', // Folder temporar (nu este utilizat în mod direct în cod, dar poate fi util).
    global.folderScss, // Folderul unde stocăm fișierele SCSS.
    global.folderCss, // Folderul unde vor fi salvate fișierele CSS compilate.
    global.folderBackup, // Folderul unde salvăm backup-uri CSS (copii de siguranță).
    path.join(__dirname, 'public') // Folderul "public" care conține resurse statice (imagini, CSS, JS, fonturi).
];

// 📌 2️⃣ Parcurgem fiecare folder din listă și verificăm dacă există.
vect_foldere.forEach(folder => {
    if (!fs.existsSync(folder)) { // Dacă folderul NU există:
        fs.mkdirSync(folder, { recursive: true }); // Îl creăm automat.
        // 🔹 "recursive: true" permite crearea tuturor subfolderelor dacă nu există.
    }
});

// 📌 3️⃣ Ce înseamnă asta?
// - La prima rulare a serverului, dacă folderele SCSS, CSS sau Backup nu există, ele vor fi create automat.
// - Acest lucru asigură că serverul nu va întâmpina probleme din cauza lipsei acestor foldere.


// =================================================================
// 🔹 Funcția care compilează fișiere SCSS în CSS
// =================================================================

// 📌 1️⃣ Ce face această funcție?
// - Primește ca parametri un fișier SCSS (caleScss) și un fișier CSS rezultat (caleCss).
// - Transformă fișierul SCSS în CSS utilizând compilatorul SASS.
// - Creează automat backup pentru fișierul CSS dacă acesta există deja.
// - Salvează fișierul CSS compilat în folderul destinat stilurilor.

// =================================================================
function compileazaScss(caleScss, caleCss) {
    try {
        // 📌 2️⃣ Construim calea către fișierul SCSS de intrare.
        // Dacă "caleScss" este o cale absolută (ex: "C:/proiect/public/scss/style.scss"), o folosim direct.
        // Dacă nu, o construim relativ la folderul global de SCSS.
        const inputPath = path.isAbsolute(caleScss) 
            ? caleScss 
            : path.join(global.folderScss, caleScss);
        
        let outputPath;

        // 📌 3️⃣ Construim calea unde va fi salvat fișierul CSS.
        if (caleCss) {
            // Dacă avem un nume de fișier CSS specificat, îl folosim.
            outputPath = path.isAbsolute(caleCss)
                ? caleCss
                : path.join(global.folderCss, caleCss);
        } else {
            // Dacă nu avem un fișier CSS specificat, generăm automat numele.
            // Înlocuim extensia ".scss" cu ".css" pentru a obține un fișier CSS valid.
            const relativePath = path.relative(global.folderScss, inputPath);
            outputPath = path.join(
                global.folderCss, 
                relativePath.replace(/\.scss$/, '.css')
            );
        }

        // =================================================================
        // 🔹 4️⃣ Creăm un backup pentru fișierul CSS existent
        // =================================================================
        if (fs.existsSync(outputPath)) { // Verificăm dacă fișierul CSS deja există
            const backupPath = path.join(
                global.folderBackup, // Salvăm backup-ul în folderul "backup"
                'public',
                'css',
                path.relative(global.folderCss, outputPath)
            );
            
            try {
                fs.mkdirSync(path.dirname(backupPath), { recursive: true }); // Creăm folderul backup, dacă nu există
                fs.copyFileSync(outputPath, backupPath); // Copiem fișierul CSS existent în backup
            } catch (err) {
                console.error(`Eroare backup ${outputPath}:`, err.message);
            }
        }

        // =================================================================
        // 🔹 5️⃣ Compilarea propriu-zisă a fișierului SCSS în CSS
        // =================================================================
        const result = sass.compile(inputPath, {
            loadPaths: [
                path.join(__dirname, 'node_modules') // Permite utilizarea bibliotecilor SCSS din "node_modules"
            ]
        });

        // 📌 6️⃣ Salvăm fișierul CSS compilat
        fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Creăm folderul CSS dacă nu există
        fs.writeFileSync(outputPath, result.css); // Salvăm conținutul CSS compilat

        // 📌 7️⃣ Afișăm un mesaj în consolă pentru a confirma că fișierul a fost compilat cu succes
        console.log(`Compilat: ${inputPath} -> ${outputPath}`);

    } catch (err) {
        // 📌 8️⃣ Gestionăm eventualele erori și le afișăm în consolă.
        console.error(`Eroare compilare ${caleScss}:`, err.message);
    }
}


// =================================================================
// 🔹 Compilare inițială la pornirea serverului
// =================================================================

// 📌 1️⃣ Această funcție este apelată când serverul pornește.
// 📌 2️⃣ Ce face?
//    - Compilează **primul** fișierul `custom.scss` (dacă există).
//    - După aceea, caută și compilează **toate celelalte fișiere SCSS** din folderul SCSS.
// 📌 3️⃣ De ce e utilă?
//    - Ne asigurăm că toate stilurile SCSS sunt transformate în CSS **de la început**, 
//      astfel încât pagina web să aibă stilurile corecte încă de la primul acces.
// =================================================================

function compilareInitiala() {
    // =================================================================
    // 🔹 1️⃣ Compilăm fișierul principal `custom.scss` primul
    // =================================================================

    // 📌 Definim calea către `custom.scss`
    const customScssPath = path.join(global.folderScss, 'custom.scss');

    // 📌 Verificăm dacă fișierul `custom.scss` există
    if (fs.existsSync(customScssPath)) {
        // 📌 Dacă fișierul există, îl compilăm în `custom.css`
        compileazaScss('custom.scss', 'custom.css');
    }

    // =================================================================
    // 🔹 2️⃣ Procesăm și restul fișierelor SCSS din folderul SCSS
    // =================================================================

    // 📌 Funcție recursivă care parcurge toate fișierele dintr-un folder.
    function traverse(dir) {
        // 📌 `fs.readdirSync()` citește conținutul folderului curent.
        // `withFileTypes: true` ne permite să identificăm dacă fiecare element este fișier sau folder.
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            
            // 📌 Construim calea completă către elementul curent
            const fullPath = path.join(dir, entry.name);

            // 📌 Dacă elementul este un folder, apelăm recursiv funcția `traverse()`
            if (entry.isDirectory()) {
                traverse(fullPath);
            } 
            
            // 📌 Dacă elementul este un fișier SCSS și NU este `custom.scss`, îl compilăm
            else if (entry.isFile() && path.extname(entry.name) === '.scss' && entry.name !== 'custom.scss') {
                
                // 📌 Obținem calea relativă a fișierului față de folderul SCSS
                const relativePath = path.relative(global.folderScss, fullPath);
                
                // 📌 Compilăm fișierul SCSS
                compileazaScss(relativePath);
            }
        });
    }

    // 📌 Începem parcurgerea folderului SCSS
    traverse(global.folderScss);
}


// =================================================================
// 🔹 Funcția care monitorizează modificările fișierelor SCSS
// =================================================================

// 📌 1️⃣ Ce face această funcție?
//    - Verifică în timp real dacă vreun fișier SCSS a fost modificat.
//    - Dacă un fișier SCSS este modificat, este compilat automat în CSS.
//    - Permite dezvoltatorului să vadă schimbările **instant** fără a reporni serverul.

// 📌 2️⃣ Cum funcționează?
//    - Folosește `fs.watch()` pentru a monitoriza modificările în folderul `scss`.
//    - Dacă un fișier SCSS este modificat, funcția `compileazaScss()` este apelată automat.
// =================================================================

function setupWatcher() {
    // 📌 1️⃣ Creăm un "watcher" care monitorizează folderul SCSS.
    // 📌 `recursive: true` permite monitorizarea și a subfolderelor SCSS.
    const watcher = fs.watch(global.folderScss, { recursive: true }, (event, filename) => {
        
        // 📌 2️⃣ Dacă `filename` nu este definit sau nu este un fișier SCSS, ieșim din funcție.
        if (!filename || !filename.endsWith('.scss')) return;
        
        // 📌 3️⃣ Construim calea completă către fișierul modificat.
        const fullPath = path.join(global.folderScss, filename);

        // 📌 4️⃣ Folosim `setTimeout()` pentru a evita erorile legate de fișiere incomplete.
        //    - Uneori, sistemul de operare poate raporta modificări înainte ca fișierul să fie complet salvat.
        //    - O întârziere de 100ms asigură că fișierul este gata pentru compilare.
        setTimeout(() => {

            // 📌 5️⃣ Verificăm dacă fișierul există (în caz că a fost șters între timp).
            if (fs.existsSync(fullPath)) {
                
                // 📌 6️⃣ Dacă fișierul modificat este `custom.scss`, îl compilăm primul.
                if (filename === 'custom.scss') {
                    compileazaScss('custom.scss', 'custom.css');
                } 
                // 📌 7️⃣ Dacă este alt fișier SCSS, îl compilăm direct.
                else {
                    compileazaScss(fullPath);
                }
            }
        }, 100); // 🔹 Așteptăm 100ms înainte de a începe compilarea.
    });

    // 📌 8️⃣ Gestionăm erorile care pot apărea în timpul monitorizării.
    watcher.on('error', err => console.error('Eroare monitorizare:', err));
}


// =================================================================
// 🔹 Inițializare sistem SCSS
// =================================================================

// 📌 1️⃣ Apelăm funcția `compilareInitiala()` pentru a ne asigura că:
//    - Toate fișierele SCSS sunt **compilate în CSS** la pornirea serverului.
//    - Nu există stiluri lipsă la prima încărcare a paginii.
compilareInitiala();

// 📌 2️⃣ Apelăm funcția `setupWatcher()` pentru a **monitoriza** fișierele SCSS:
//    - Dacă un fișier SCSS este modificat, serverul **îl recompilează automat**.
//    - Permite dezvoltatorului să vadă modificările **fără a reporni serverul**.
setupWatcher();


// =================================================================
// 🔹 Inițializare sistem de gestionare a erorilor
// =================================================================

// 📌 1️⃣ Creăm un obiect global `obGlobal` în care vom stoca erorile.
//    - `obErori: null` înseamnă că inițial nu avem erori încărcate.
//    - Vom încărca erorile dintr-un fișier extern `erori.json` dacă acesta există.
const obGlobal = { obErori: null };

// 📌 2️⃣ Funcția `initErori()` citește și încarcă erorile din `erori.json`.
//    - Aceste erori vor fi folosite mai târziu pentru a afișa mesaje de eroare personalizate.
const initErori = () => {
    // 📌 Definim calea către fișierul `erori.json`
    const eroriPath = path.join(__dirname, 'erori.json');

    // 📌 3️⃣ Verificăm dacă fișierul `erori.json` există
    if (fs.existsSync(eroriPath)) {
        // 📌 4️⃣ Citim conținutul fișierului `erori.json` și îl transformăm în obiect JavaScript
        obGlobal.obErori = JSON.parse(fs.readFileSync(eroriPath, 'utf8'));

        // 📌 5️⃣ Pentru fiecare eroare definită în `erori.json`, construim calea către imaginea erorii
        obGlobal.obErori.info_erori.forEach(err => {
            err.imagine = path.join(obGlobal.obErori.cale_baza, err.imagine);
        });
    }
};

// 📌 6️⃣ Apelăm funcția `initErori()` pentru a încărca erorile la pornirea serverului.
initErori();

// =================================================================
// 🔹 Funcție pentru afișarea paginii de eroare
// =================================================================

// 📌 1️⃣ Această funcție este apelată atunci când apare o eroare în aplicație.
// 📌 2️⃣ Ce face?
//    - Primește un răspuns (`res`) și câteva informații despre eroare (identificator, titlu, text, imagine).
//    - Caută eroarea în obiectul `obGlobal.obErori` (care conține lista de erori din `erori.json`).
//    - Dacă eroarea există, o folosește; dacă nu, folosește eroarea implicită (`eroare_default`).
//    - Trimite un răspuns către utilizator, generând o pagină de eroare personalizată.
// =================================================================

const afisareEroare = (res, identificator, titlu, text, imagine) => {
    // 📌 1️⃣ Caută eroarea în lista de erori folosind identificatorul primit
    let eroare = obGlobal.obErori.info_erori.find(e => e.identificator === identificator);

    // 📌 2️⃣ Dacă eroarea nu este găsită, folosim eroarea implicită (eroare_default)
    if (!eroare) eroare = obGlobal.obErori.eroare_default;

    // 📌 3️⃣ Trimitem răspunsul către utilizator:
    //    - `res.status(identificator || 500)`: Setează codul HTTP al erorii (ex: 404, 500).
    //    - `.render('pagini/eroare', {...})`: Generează pagina de eroare folosind șablonul `eroare.ejs`.
    res.status(identificator || 500).render('pagini/eroare', {
        title: titlu || eroare.titlu, // Titlul paginii de eroare (ex: "Pagina nu a fost găsită")
        text: text || eroare.text, // Mesajul de eroare afișat utilizatorului
        imagine: imagine || eroare.imagine // Imaginea asociată erorii (ex: un simbol de avertizare)
    });
};


// =================================================================
// 🔹 Definirea rutelor principale ale serverului
// =================================================================

// 📌 1️⃣ Ce este o "rUTĂ" într-un server web?
//    - O rută este o adresă URL la care utilizatorii pot accesa o anumită pagină.
//    - De exemplu, dacă cineva accesează "http://localhost:8080/contact",
//      serverul trebuie să știe ce pagină să afișeze.
//    - Express.js ne permite să definim aceste rute cu `app.get()`.

// 📌 2️⃣ Ce face `res.render('pagini/index', { title: 'Acasă' })`?
//    - Generează o pagină HTML folosind un șablon EJS (Ex: `index.ejs`).
//    - `{ title: 'Acasă' }` trimite variabile către șablon (ex: titlul paginii).
// =================================================================

// 🔹 Ruta pentru pagina principală (Acasă)
// - Dacă un utilizator accesează "/", "/index" sau "/home",
//   serverul va trimite pagina "index.ejs" și va seta titlul "Acasă".
app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pagini/index', { title: 'Acasă' });
});

// 🔹 Ruta pentru pagina de contact
// - Dacă un utilizator accesează "/contact",
//   serverul va trimite pagina "contact.ejs" și va seta titlul "Contact".
app.get('/contact', (req, res) => {
    res.render('pagini/contact', { title: 'Contact' });
});

// 🔹 Ruta pentru pagina "Istoric"
// - Dacă un utilizator accesează "/istoric",
//   serverul va afișa pagina "istoric.ejs" cu titlul "Istoric".
app.get('/istoric', (req, res) => {
    res.render('pagini/istoric', { title: 'Istoric' });
});

// 🔹 Ruta pentru pagina "Produse"
// - Dacă un utilizator accesează "/produse",
//   serverul va afișa pagina "produse.ejs" cu titlul "Produse".
app.get('/produse', (req, res) => {
    res.render('pagini/produse', { title: 'Produse' });
});

// 🔹 Ruta pentru pagina "Promoții"
// - Dacă un utilizator accesează "/promotii",
//   serverul va afișa pagina "promotii.ejs" cu titlul "Promoții".
app.get('/promotii', (req, res) => {
    res.render('pagini/promotii', { title: 'Promoții' });
});


// =================================================================
// 🔹 Definirea rutelor pentru afișarea paginilor de eroare
// =================================================================

// 📌 1️⃣ Ce face fiecare rută?
//    - Dacă un utilizator accesează o anumită adresă URL, serverul returnează o pagină de eroare specifică.
//    - Paginile de eroare sunt șabloane EJS care oferă informații despre eroarea apărută.
//    - `{ title: '...' }` setează titlul paginii, care poate fi folosit în fișierul EJS pentru afișare.

// 📌 2️⃣ De ce avem pagini de eroare personalizate?
//    - În loc să afișăm un mesaj generic și neinteligibil al serverului, oferim o pagină prietenoasă cu utilizatorul.
//    - Aceste pagini pot conține explicații despre eroare, imagini și sugestii pentru utilizator.

// =================================================================

// 🔹 Ruta pentru afișarea unei pagini de eroare generică
// - Dacă un utilizator accesează "/eroare",
//   serverul va afișa pagina "eroare.ejs" cu titlul "Eroare".
app.get('/eroare', (req, res) => {
    res.render('pagini/eroare', { title: 'Eroare' });
});

// 🔹 Ruta pentru eroarea 404 (Pagina nu a fost găsită)
// - Dacă un utilizator accesează "/404",
//   serverul va afișa pagina "404.ejs" cu titlul "Pagina nu a fost găsită".
app.get('/404', (req, res) => {
    res.render('pagini/404', { title: 'Pagina nu a fost găsită' });
});

// 🔹 Ruta pentru eroarea 403 (Acces interzis)
// - Dacă un utilizator accesează "/403",
//   serverul va afișa pagina "403.ejs" cu titlul "Acces interzis".
app.get('/403', (req, res) => {
    res.render('pagini/403', { title: 'Acces interzis' });
});

// 🔹 Ruta pentru eroarea 400 (Cerere invalidă)
// - Dacă un utilizator accesează "/400",
//   serverul va afișa pagina "400.ejs" cu titlul "Cerere invalidă".
app.get('/400', (req, res) => {
    res.render('pagini/400', { title: 'Cerere invalidă' });
});


// =================================================================
// 🔹 Definirea unor rute speciale pentru server
// =================================================================

// 📌 1️⃣ Ce sunt rutele speciale?
//    - Sunt rute care nu afișează pagini obișnuite, ci gestionează fișiere speciale
//      sau protejează anumite resurse de acces neautorizat.
//    - Aceste rute ajută serverul să evite probleme de securitate și să ofere o funcționalitate corectă.

// =================================================================

// 🔹 Ruta pentru favicon.ico (iconița site-ului)
// - Când un browser încarcă un site, caută automat un fișier `favicon.ico` (iconița site-ului).
// - Această rută trimite browserului iconița stocată în `/public/favicon.ico`.
// - Dacă această rută nu este definită, serverul ar putea genera erori inutile.
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// =================================================================

// 🔹 Blocăm accesul direct la fișierele `.ejs`
// - Fișierele `.ejs` sunt șabloane folosite pentru a genera pagini HTML dinamic.
// - Ele nu trebuie să fie accesibile direct din browser, deoarece pot conține cod server-side.
// - Dacă cineva încearcă să acceseze un fișier `.ejs` (ex: `/pagini/index.ejs`), returnăm eroarea `400 - Cerere invalidă`.
app.get('/*.ejs', (req, res) => {
    afisareEroare(res, 400);
});

// =================================================================

// 🔹 Protejăm resursele statice din `/public/`
// - Verificăm dacă un utilizator încearcă să acceseze un director în `/public/` fără a specifica un fișier concret.
// - Exemplu: Dacă cineva accesează `/public/images/`, dar fără să specifice un fișier imagine, returnăm eroarea `403 - Acces interzis`.
// - Această protecție împiedică listarea fișierelor din server, îmbunătățind securitatea.
app.get('/public/*', (req, res, next) => {
    // 📌 Verificăm dacă ultima parte a adresei URL nu conține un punct (`.`).
    //    - Dacă nu există punct (`.`), înseamnă că nu este un fișier valid (ex: `.png`, `.css` etc.).
    if (req.path.split('/').pop().indexOf('.') === -1) {
        return afisareEroare(res, 403); // Returnăm eroarea `403 - Acces interzis`
    }
    
    next(); // Dacă este un fișier valid, continuăm procesarea cererii.
});


// =================================================================
// 🔹 Ruta generală - Gestionează orice pagină necunoscută
// =================================================================

// 📌 1️⃣ Ce face această rută?
//    - Captură **orice cerere** care nu se potrivește cu rutele definite anterior.
//    - Verifică dacă există un fișier `.ejs` corespunzător în `views/pagini/`.
//    - Dacă fișierul există, îl afișează ca o pagină validă.
//    - Dacă nu există, returnează eroarea `404 - Pagina nu a fost găsită`.

// =================================================================
app.get('/*', (req, res) => {
    // 📌 2️⃣ Extragem numele paginii din URL
    const pagina = req.params[0]; // Ex: "/despre" → "despre"
    
    // 📌 3️⃣ Construim calea către fișierul `.ejs` corespunzător
    const filePath = path.join(__dirname, 'views', 'pagini', `${pagina}.ejs`);

    // 📌 4️⃣ Verificăm dacă fișierul `.ejs` există pe server
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // 🔹 5️⃣ Dacă fișierul NU există, returnăm eroarea 404 (Pagina nu a fost găsită)
            afisareEroare(res, 404);
        } else {
            // 🔹 6️⃣ Dacă fișierul există, îl afișăm utilizatorului
            res.render(`pagini/${pagina}`, { 
                title: pagina.charAt(0).toUpperCase() + pagina.slice(1) // Setăm titlul cu literă mare
            });
        }
    });
});

// =================================================================
// 🔹 Pornirea serverului Express
// =================================================================

// 📌 7️⃣ Serverul începe să asculte pe portul definit (8080 în acest caz).
//    - `app.listen(PORT, () => { console.log(...) })` pornește serverul.
//    - Mesajul `Serverul rulează la http://localhost:8080` este afișat în consolă.
app.listen(PORT, () => {
    console.log(`Serverul rulează la http://localhost:${PORT}`);
});




// =================================================================
// 🔹 Ce face acest cod?
// =================================================================

// 1️⃣ Crează un server web folosind Express.js.
// 2️⃣ Rutează utilizatorii către paginile corespunzătoare.
// 3️⃣ Compilează automat fișiere SCSS în CSS.
// 4️⃣ Monitorizează fișiere SCSS pentru recompilare în timp real.
// 5️⃣ Gestionează erorile și afișează pagini de eroare personalizate.
// 6️⃣ Rulează un server pe portul 8080.

// =================================================================
// 1️⃣ Crează un server web folosind Express.js
// =================================================================
// Express.js este un framework pentru Node.js care facilitează crearea
// unui server web. Un server web este un program care primește cereri 
// HTTP și returnează răspunsuri (ex: afișarea unei pagini web).
// =================================================================

// =================================================================
// 2️⃣ Rutează utilizatorii către paginile corespunzătoare
// =================================================================
// Când un utilizator accesează un URL (ex: "/home"), serverul trebuie să știe
// ce pagină să returneze. Acest proces se numește rutare.
// Express.js permite crearea de rute pentru a direcționa utilizatorii
// către paginile corespunzătoare.
// =================================================================

// =================================================================
// 3️⃣ Compilează automat fișiere SCSS în CSS
// =================================================================
// SCSS este un preprocesor CSS care permite utilizarea variabilelor,
// funcțiilor și a unei structuri mai organizate pentru stiluri.
// Serverul conține o funcție care transformă automat fișierele SCSS 
// în fișiere CSS, astfel încât browserul să le poată folosi.
// =================================================================

// =================================================================
// 4️⃣ Monitorizează fișiere SCSS pentru recompilare în timp real
// =================================================================
// Dacă un fișier SCSS este modificat, serverul detectează schimbarea
// și îl recompilă automat în CSS. Acest proces ajută dezvoltatorii
// să vadă imediat efectele modificărilor în stiluri fără a reporni serverul.
// =================================================================

// =================================================================
// 5️⃣ Gestionează erorile și afișează pagini de eroare personalizate
// =================================================================
// Dacă un utilizator accesează o pagină care nu există (ex: "/pagina-inexistenta"),
// serverul returnează o pagină de eroare personalizată (ex: 404 - Pagina nu a fost găsită).
// =================================================================

// =================================================================
// 6️⃣ Rulează un server pe portul 8080
// =================================================================
// Portul este ca o "ușă" prin care utilizatorii se conectează la server.
// În acest caz, serverul este configurat să ruleze pe portul 8080.
// Utilizatorii pot accesa site-ul la adresa: http://localhost:8080
// =================================================================
