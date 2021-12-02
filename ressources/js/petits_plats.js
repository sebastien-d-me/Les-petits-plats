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
/* Ajouter un élément afficher avec ce qui fait qu'il s'affiche (genre type-nom) et le retirer */

/** Affiche toutes les recettes de base **/
recipes.forEach(recipe => {
    let idPlat = recipe["id"];
    let nomPlat = recipe["name"];
    let personnePlat = recipe["servings"];
    let ingredientsPlat = recipe["ingredients"];
    let tempsPlat = recipe["time"];
    let descriptionPlat = recipe["description"];
    let appareilsPlat = recipe["appliance"];
    let ustensilesPlat = recipe["ustensils"];
    return plat(idPlat, nomPlat, personnePlat, ingredientsPlat, tempsPlat, descriptionPlat, appareilsPlat, ustensilesPlat);
});

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
        nom = data.split(" ").join("-")
        document.getElementById("liste-filtre-"+type).insertAdjacentHTML("beforeend", `<li class="nom-filtre" id="${type}-${nom}" data-type="${type}" data-nom="${data}" onclick="ajouteTag('${type}', '${data}')">${data}</li>`);
    });
}
/* Affiche tous les ingrédients */ 
listeTags("ingredients");
/* Affiche tous les appareils */
listeTags("appliance");
/* Affiche tous les ustensiles */
listeTags("ustensils");


/** SI TABLEAU VIDE ALORS NORMAL SI 2 -> MELANGE TABLEAU ET VERIFIE SI SIMIALIRE -> PAREIL 3 **/

/** Ajoute le tag dans les tag choisis **/
function ajouteTag(type, nom) {
    nomID = nom.split(" ").join("-")
    document.getElementById("tags-choisis").insertAdjacentHTML("beforeend", `<span class="tag tag-${type}" id="tag-${type}-${nomID}">${nom} <i class="far fa-times-circle" onclick="supprimeTag('${type}-${nom}')"></i></span>`);
    let plats = document.querySelectorAll(".plat");
    switch(type) {
        case "ingredients":          
            plats.forEach(function (plat) {
                if(plat.classList.contains("ingredient-"+nom.split(" ").join("-"))) {
                    if(plat.classList.contains("plat-afficher")) {
                        document.getElementById(plat.id).classList.add("plat-afficher");
                    }
                } else {
                    document.getElementById(plat.id).classList.remove("plat-afficher");
                    document.getElementById(plat.id).classList.add("plat-cacher");
                }
            });
            break;
        case "appliance":
            plats.forEach(function (plat) {
                if(normalizer(plat.dataset.appliance) == nom) {
                    if(plat.classList.contains("plat-afficher")) {
                        document.getElementById(plat.id).classList.add("plat-afficher");
                    }
                } else {
                    document.getElementById(plat.id).classList.remove("plat-afficher");
                    document.getElementById(plat.id).classList.add("plat-cacher");
                }
            });
            break;
        case "ustensils":  
            plats.forEach(function (plat) {
                if(plat.classList.contains("ustensile-"+nom.split(" ").join("-"))) {
                    if(plat.classList.contains("plat-afficher")) {
                        document.getElementById(plat.id).classList.add("plat-afficher");
                    }
                } else {
                    document.getElementById(plat.id).classList.remove("plat-afficher");
                    document.getElementById(plat.id).classList.add("plat-cacher");
                }
            });
            break;
        default:
            break;
    }
    /* Vérifie si un plat est affiché */
    let nbPlats = document.querySelectorAll(".plat:not(.plat-cacher)").length;
    if(nbPlats === 0) {
        document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
    } else {
        document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
    }
}
/* Supprime le tag dans les tags choisis */
function supprimeTag(id, type, supprimer) {
    document.getElementById(id).classList.remove(type+"-"+supprimer);
}

/** Affiche les recettes **/
function plat(id, nom, personne, ingredients, temps, description, appliance, ustensils) {
    let listePlats = document.getElementById("liste-plats");
    let recette = document.createElement("article");
    recette.setAttribute("id", id);
    recette.setAttribute("data-nom", `${nom}`);
    recette.setAttribute("data-appliance", `${appliance}`);
    recette.classList.add("plat");
    ingredients.forEach(ingredient => recette.classList.add(normalizer("ingredient-"+ingredient.ingredient.split(" ").join("-"))));
    ustensils.forEach(ustensil => recette.classList.add(normalizer("ustensile-"+ustensil.split(" ").join("-"))));

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
