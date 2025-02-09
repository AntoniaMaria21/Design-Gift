document.addEventListener("DOMContentLoaded", function () {
    // Selectăm toate linkurile din navbar
    let navLinks = document.querySelectorAll("nav ul li a");
  
    // Obținem URL-ul curent (doar numele fișierului)
    let currentUrl = window.location.pathname.split("/").pop() || "index.html"; // Dacă e pagina principală
  
    // Parcurgem toate linkurile și adăugăm clasa "active" pe cel care corespunde
    navLinks.forEach(link => {
      if (link.getAttribute("href") === currentUrl) {
        link.classList.add("active");
      }
    });
  });
  