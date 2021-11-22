/** Gère l'ouverture / fermeture des filtres **/
function ouvreFiltre(type) {
    let btnFiltres = document.querySelectorAll(".btn-filtre");
    btnFiltres.forEach(btn => {
        btn.style.display = "block";
    });
    let filtres = document.querySelectorAll(".cherche-filtre");
    filtres.forEach(filtre => {
        filtre.style.display = "none";
    });
    document.getElementById("btn-"+type).style.display = "none";
    document.getElementById("cherche-"+type).style.display = "flex";
}
function fermetureFiltre(type) {
    document.getElementById(type).style.width = "fit-content";
    document.getElementById("btn-"+type).style.display = "block";
    document.getElementById("cherche-"+type).style.display = "none";
}