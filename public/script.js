document.addEventListener("DOMContentLoaded", function () {
  // --- Setarea linkurilor active din navbar ---
  let navLinks = document.querySelectorAll("nav ul li a");
  let currentUrl = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    }
  });
});

// ETAPA 6 – Filtrare, sortare, calcul și resetare pentru pagina de produse
document.addEventListener("DOMContentLoaded", function() {
  const btnFiltreaza = document.getElementById("btnFiltreaza");
  const btnSortAsc = document.getElementById("btnSortAsc");
  const btnSortDesc = document.getElementById("btnSortDesc");
  const btnCalculeaza = document.getElementById("btnCalculeaza");
  const btnReset = document.getElementById("btnReset");
  const produseList = document.getElementById("produseList");

  let produse = Array.from(document.querySelectorAll("#produseList article"));

  // Filtrare
  btnFiltreaza.addEventListener("click", function() {
    const filtruNume = document.getElementById("filtruNume").value.trim().toLowerCase();
    const filtruDescriere = document.getElementById("filtruDescriere").value.trim().toLowerCase();
    const filtruPret = parseFloat(document.getElementById("filtruPret").value);
    const filtruCuloare = document.getElementById("filtruCuloare").value.trim().toLowerCase();
    const filtruDisp = document.querySelector('input[name="filtruDisp"]:checked').value.trim().toLowerCase();
    const filtruNoutati = document.getElementById("filtruNoutati").checked;
    const filtruSubcategorie = document.getElementById("filtruSubcategorie").value.trim().toLowerCase();
    const selectIngrediente = document.getElementById("filtruIngrediente");
    const filtruIngrediente = Array.from(selectIngrediente.selectedOptions)
                                  .map(opt => opt.value.trim().toLowerCase());

    produse.forEach(function(product) {
      const nume = product.querySelector("h3").textContent.trim().toLowerCase();
      const descriere = product.querySelector(".descriere").textContent.trim().toLowerCase();
      const pret = parseFloat(product.getAttribute("data-pret")) || 0;
      const culoare = (product.getAttribute("data-culoare") || "").toLowerCase();
      const disponibil = (product.getAttribute("data-disponibil") || "").toLowerCase();
      const subcategorie = (product.getAttribute("data-subcategorie") || "").toLowerCase();
      const ingrediente = (product.getAttribute("data-ingrediente") || "").toLowerCase();
      const dataAdaugare = product.getAttribute("data-date") || product.querySelector("time").getAttribute("datetime");

      let show = true;
      if (filtruNume && !nume.startsWith(filtruNume)) show = false;
      if (filtruDescriere && !descriere.includes(filtruDescriere)) show = false;
      if (!isNaN(filtruPret) && pret > filtruPret) show = false;
      if (filtruCuloare && culoare !== filtruCuloare) show = false;
      if (filtruDisp !== "oricare" && disponibil !== filtruDisp) show = false;
      if (filtruNoutati) {
        const thresholdDate = new Date("2023-01-01");
        const prodDate = new Date(dataAdaugare);
        if (prodDate < thresholdDate) show = false;
      }
      if (filtruSubcategorie !== "oricare" && subcategorie !== filtruSubcategorie) show = false;
      if (filtruIngrediente.length > 0) {
        let ingredList = ingrediente.split(",").map(i => i.trim());
        let allFound = filtruIngrediente.every(ing => ingredList.includes(ing));
        if (!allFound) show = false;
      }
      product.style.display = show ? "" : "none";
    });
  });

  // Sortare Ascendentă
  btnSortAsc.addEventListener("click", function() {
    produse.sort(function(a, b) {
      let nameA = a.querySelector("h3").textContent.trim().toLowerCase();
      let nameB = b.querySelector("h3").textContent.trim().toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      let ratioA = parseFloat(a.getAttribute("data-ratio")) || 0;
      let ratioB = parseFloat(b.getAttribute("data-ratio")) || 0;
      return ratioA - ratioB;
    });
    produse.forEach(product => {
      produseList.appendChild(product);
    });
  });

  // Sortare Descendentă
  btnSortDesc.addEventListener("click", function() {
    produse.sort(function(a, b) {
      let nameA = a.querySelector("h3").textContent.trim().toLowerCase();
      let nameB = b.querySelector("h3").textContent.trim().toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      let ratioA = parseFloat(a.getAttribute("data-ratio")) || 0;
      let ratioB = parseFloat(b.getAttribute("data-ratio")) || 0;
      return ratioB - ratioA;
    });
    produse.forEach(product => {
      produseList.appendChild(product);
    });
  });

  // Calculare: suma prețurilor produselor vizibile
  btnCalculeaza.addEventListener("click", function() {
    let suma = 0;
    produse.forEach(function(product) {
      if (product.style.display !== "none") {
        suma += parseFloat(product.getAttribute("data-pret")) || 0;
      }
    });
    let divCalcul = document.createElement("div");
    divCalcul.textContent = "Suma prețurilor: " + suma;
    divCalcul.style.position = "fixed";
    divCalcul.style.top = "10px";
    divCalcul.style.right = "10px";
    divCalcul.style.backgroundColor = "lightyellow";
    divCalcul.style.padding = "10px";
    document.body.appendChild(divCalcul);
    setTimeout(() => {
      divCalcul.remove();
    }, 2000);
  });

  // Resetare filtre
  btnReset.addEventListener("click", function() {
    if (confirm("Vrei să resetezi filtrele?")) {
      document.getElementById("filtruNume").value = "";
      document.getElementById("filtruDescriere").value = "";
      document.getElementById("filtruPret").value = 1000;
      document.getElementById("pretVal").textContent = "(1000)";
      document.getElementById("filtruCuloare").value = "";
      document.getElementById("dispOricare").checked = true;
      document.getElementById("filtruNoutati").checked = false;
      document.getElementById("filtruSubcategorie").value = "oricare";
      Array.from(document.getElementById("filtruIngrediente").options).forEach(opt => opt.selected = false);
      produse.forEach(product => {
        product.style.display = "";
      });
    }
  });
});


// ETAPA 6 COD JS PENTRU MODIFICAREA TEMEI 

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Verifică localStorage pentru tema salvată; implicit este "light"
  let currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('theme-dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.body.classList.remove('theme-dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  
  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
      document.body.classList.remove('theme-dark');
      localStorage.setItem('theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  });
});
