const fs = require('fs');
const path = require('path');

// Definim paginile cu titluri și conținut specific
const pages = [
    { name: 'produse', title: 'Produse - Design & Gift', content: `
        <h2>Produsele noastre</h2>
        <p>Descoperă gama noastră de produse personalizate:</p>
        <ul>
            <li>Globuri de Crăciun</li>
            <li>Tablouri personalizate</li>
            <li>Căni personalizate</li>
            <li>Tricouri personalizate</li>
            <li>Ursuleți de pluș</li>
        </ul>
    ` },
    { name: 'promotii', title: 'Promoții - Design & Gift', content: `
        <h2>Promoții</h2>
        <p>Reduceri speciale la cadouri personalizate!</p>
        <ul>
            <li>20% reducere la globuri de Crăciun</li>
            <li>15% reducere la tablouri personalizate</li>
            <li>10% reducere la căni personalizate</li>
        </ul>
    ` },
    { name: 'contact', title: 'Contact - Design & Gift', content: `
        <h2>Contact</h2>
        <p>Ne poți contacta pentru comenzi sau informații:</p>
        <ul>
            <li><b>Telefon:</b> <a href="tel:+0722726888">0722726888</a></li>
            <li><b>Email:</b> <a href="mailto:contact@designandgift.ro">contact@designandgift.ro</a></li>
            <li><b>Adresă:</b> Bulevardul Regele Carol 1, nr. 46, Târgoviște</li>
        </ul>
    ` }
];

// Șablon HTML comun, unde înlocuim titlul și conținutul
const generatePage = (page) => {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Echipa Design & Gift">
    <meta name="keywords" content="cadouri personalizate, globuri de Crăciun, tablouri personalizate, cadouri aniversare">
    <meta name="description" content="Descoperă cadouri personalizate și promoții exclusive.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#A9D08E">
    <title>${page.title}</title>
    <link rel="icon" type="image/x-icon" href="ico/favicon.ico">
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <header>
        <h1>Design & Gift - Cadouri personalizate</h1>
        <nav>
            <ul>
                <li><a href="index.html"><b>Acasă</b></a></li>
                <li><a href="produse.html"><b>Produse</b></a></li>
                <li><a href="promotii.html"><b>Promoții</b></a></li>
                <li><a href="contact.html"><b>Contact</b></a></li>
            </ul>
        </nav>
    </header>

    <main>
        ${page.content}
    </main>

    <footer>
        <p>&copy; 2024 Design & Gift. Toate drepturile rezervate.</p>
    </footer>

</body>
</html>
    `;

    // Salvăm fișierul în folderul "dist"
    const filePath = path.join(__dirname, 'dist', `${page.name}.html`);
    fs.writeFileSync(filePath, htmlTemplate);
    console.log(`✅ Pagina ${page.name}.html a fost generată!`);
};

// Creăm directorul "dist" dacă nu există
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Generăm toate paginile definite
pages.forEach(generatePage);

console.log('✅ Toate paginile au fost generate cu succes!');
