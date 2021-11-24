/** Gère l'ouverture / fermeture des filtres **/
/* Ouverture du filtre */
function ouvreFiltre(type) {
    /* Réinitialise les boutons et filtres */
    let btnFiltres = document.querySelectorAll(".btn-filtre");
    btnFiltres.forEach(btn => {
        btn.classList.remove("btn-cacher");
        btn.classList.add("btn-afficher");
    });
    let filtres = document.querySelectorAll(".cherche-filtre");
    filtres.forEach(filtre => {
        filtre.classList.remove("cherche-filtre-afficher");
        filtre.classList.add("cherche-filtre-cacher");
    });
    /* Apparence du bouton et filtre en question */
    let btnType = document.getElementById("btn-"+type);
    let chercheType = document.getElementById("cherche-"+type);
    btnType.classList.add("btn-cacher");
    chercheType.classList.add("cherche-filtre-afficher");
}
/* Fermeture du filtre */
function fermetureFiltre(type) {
    let btnType = document.getElementById("btn-"+type);
    let chercheType = document.getElementById("cherche-"+type);
    btnType.classList.remove("btn-cacher");
    btnType.classList.add("btn-afficher");
    chercheType.classList.remove("cherche-filtre-afficher");
    chercheType.classList.add("cherche-filtre-cacher");
}

/*let recettes = `${recipes.map(recette => `${recette.name}`).join(" ")}`;*/

/** Gère les listes **/
function normalizer(data) {
    /* Enlève les accents et ponctuation */
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    data = data.replace(/[.,\/#!$\^\*;:{}=\`~()]/g,"");
    return data;
}
function listeTags(type) {
    let liste = [];
    /* Ajoute dans un tableau les données selon le type en les mettant en minuscule */
    recipes.forEach(recipe => {
        switch(type) {
            case "ingredients":
                `${recipe.ingredients.map(data => 
                    liste.push(normalizer(
                        `${data.ingredient.toLowerCase()}`
                    ))
                ).join("")}`;
                break;
            case "appliance":
                liste.push(normalizer(
                    `${recipe.appliance}`
                ));
                break;
            case "ustensils":
                `${recipe.ustensils.map(data => 
                    liste.push(normalizer(
                        `${data.toLowerCase()}`
                    ))
                ).join("")}`;
                break;
            default:
                break;
        }
    });
    /* Tri par ordre alphabétique */
    liste = liste.sort((a, b) => a.localeCompare(b));
    /* Insert en éliminant les doublons dans le DOM */
    new Set(liste).forEach((data) => {
        document.getElementById("liste-filtre-"+type).insertAdjacentHTML('beforeend', `<li class="nom-filtre">${data}</li>`);
    });
}
/* Affiche tous les ingrédients */ 
listeTags("ingredients");
/* Affiche tous les appareils */
listeTags("appliance");
/* Affiche tous les ustensiles */
listeTags("ustensils");