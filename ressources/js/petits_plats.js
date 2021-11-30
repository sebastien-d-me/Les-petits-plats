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
/* Enlève les accents, la ponctuation et met en minuscule */
function normalizer(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    data = data.replace(/[.,!;:?]/g,"");
    data = data.toLowerCase();
    return data;
}
/* Récupère la liste des tags */
function listeTags(type) {
    let liste = [];
    /* Ajoute dans un tableau les données selon le type */
    recipes.forEach(recipe => {
        switch(type) {
            case "ingredients":
                `${recipe.ingredients.map(data => 
                    liste.push(normalizer(
                        `${data.ingredient}`
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
                        `${data}`
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
        document.getElementById("liste-filtre-"+type).insertAdjacentHTML("beforeend", `<li class="nom-filtre" data-type="${type}" data-nom="${data}" onclick="ajouteTag('${type}', '${data}')">${data}</li>`);
    });
}
/* Affiche tous les ingrédients */ 
listeTags("ingredients");
/* Affiche tous les appareils */
listeTags("appliance");
/* Affiche tous les ustensiles */
listeTags("ustensils");

/** Gère les tags choisis */
let tagIngredients = [];
let tagAppareils = [];
let tagUstensiles = [];

let listeIDIngredients = [];
let listeIDAppareils = [];
let listeIDUstensiles = [];
/* Récupère les ID par rapport aux tags */
function idTag(id, type, tag) {
    switch(type) {
        case "ingredients":
            recipes[id]["ingredients"].forEach(ingredient => {
                if(normalizer(ingredient["ingredient"]) == tag) {
                    let idPlat = recipes[id]["id"];
                    let nomPlat = recipes[id]["name"];
                    let personnePlat = recipes[id]["servings"];
                    let ingredientsPlat = recipes[id]["ingredients"];
                    let tempsPlat = recipes[id]["time"];
                    let descriptionPlat = recipes[id]["description"];
                    let appareilsPlat = recipes[id]["appliance"];
                    let ustensilesPlat = recipes[id]["ustensils"];
                    return plat(idPlat, nomPlat, personnePlat, ingredientsPlat, tempsPlat, descriptionPlat, appareilsPlat, ustensilesPlat);
                }
            });
            break;
        case "appliance":
            if(normalizer(recipes[id]["appliance"]) == tag) {
                let idPlat = recipes[id]["id"];
                let nomPlat = recipes[id]["name"];
                let personnePlat = recipes[id]["servings"];
                let ingredientsPlat = recipes[id]["ingredients"];
                let tempsPlat = recipes[id]["time"];
                let descriptionPlat = recipes[id]["description"];
                let appareilsPlat = recipes[id]["appliance"];
                let ustensilesPlat = recipes[id]["ustensils"];
                return plat(idPlat, nomPlat, personnePlat, ingredientsPlat, tempsPlat, descriptionPlat, appareilsPlat, ustensilesPlat);
            }
            break;
        case "ustensils":
            recipes[id]["ustensils"].forEach(ustensils => {
                if(normalizer(ustensils) == tag) {
                    let idPlat = recipes[id]["id"];
                    let nomPlat = recipes[id]["name"];
                    let personnePlat = recipes[id]["servings"];
                    let ingredientsPlat = recipes[id]["ingredients"];
                    let tempsPlat = recipes[id]["time"];
                    let descriptionPlat = recipes[id]["description"];
                    let appareilsPlat = recipes[id]["appliance"];
                    let ustensilesPlat = recipes[id]["ustensils"];
                    return plat(idPlat, nomPlat, personnePlat, ingredientsPlat, tempsPlat, descriptionPlat, appareilsPlat, ustensilesPlat);
                }
            });
            break;
        default:
            break;
    }
}
/* Ajoute le tag dans les tag choisis */
function ajouteTag(type, nom) {
    document.getElementById("tags-choisis").insertAdjacentHTML("beforeend", `<span class="tag tag-${type}" id="${type}-${nom}">${nom} <i class="far fa-times-circle" onclick="supprimeTag('${type}-${nom}')"></i></span>`);
    switch(type) {
        case "ingredients":
            /* Récupère l'id de la / des recette(s) possédant cette ingrédient */
            tagIngredients.push(nom);
            Object.keys(recipes).map(function idObjet(id) { 
                tagIngredients.forEach(ingredients => {
                    recipes[id]["ingredients"].forEach(ingredient => {
                        if(normalizer(ingredient["ingredient"]).includes(nom) === true) {
                            idTag(id, "ingredients", ingredients);
                        }
                    });
                })
            });
            break;
        case "appliance":
            tagAppareils.push(nom);
            Object.keys(recipes).map(function idObjet(id) { 
                tagAppareils.forEach(appliances => {
                     if(normalizer(recipes[id]["appliance"]).includes(nom) === true) {
                        idTag(id, "appliance", appliances);
                    }
                })
            });
            break;
        case "ustensils":
            tagUstensiles.push(nom);
            Object.keys(recipes).map(function idObjet(id) { 
                tagUstensiles.forEach(ustensils => {
                    recipes[id]["ustensils"].forEach(ustensil => {
                        if(normalizer(ustensil).includes(nom) === true) {
                            idTag(id, "ustensils", ustensils);
                        }
                    });
                })
            });
            break;
        default:
            break;
    }
    /* Vérifie si similitude dans les 3 tableaux */
}
/* Met les recettes correspondantes */
function plat(id, nom, personne, ingredients, temps, description) {
    let listePlats = document.getElementById("liste-plats");
    let recette = document.createElement("article");
    recette.classList.add("plat");
    recette.setAttribute("id", id);

    let plat = `
        <div class="image-plat"></div>
        <div class="description-plat">
            <h1 class="titre-plat">${nom}</h1>
            <span class="temps-preparation">${temps}</span>
            <div class="liste-ingredient">
                ${ingredients.map(ingredient =>
                    `<span class="type-ingredient">${ingredient.ingredient}<span class="nombre-ingredient">${ingredient.quantity || ''}${ingredient.quantite || ''} ${ingredient.unit || ''}</span></span>`
                ).join(" ")}
            </div>
            <div class="recette">
                <p>${description}</p>
            </div>
        </div>
    `;

    recette.innerHTML = plat;
    listePlats.appendChild(recette);
}
/* Supprime le tag dans les tags choisis */
function supprimeTag(id) {
    document.getElementById(id).remove();
}
