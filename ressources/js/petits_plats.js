/*** Réecrit ***/
/** Normalizer **/
function normalizer(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    data = data.replace(/[.,!;:?]/g,"");
    data = data.toLowerCase();
    return data;
}

/** Kebab case **/
function kebabCase(data) {
    data = data.split(" ").join("-");
    data = data.replace("'","-");
    return data;
}



/*** Gère les recettes ***/
/** Récupère les données des recettes **/
recipes.forEach(recipe => {
    let idRecette = recipe["id"];
    let nomRecette = recipe["name"];
    let personneRecette = recipe["servings"];
    let tempsRecette = recipe["time"];
    let ingredientsRecette = recipe["ingredients"];
    let descriptionRecette = recipe["description"];
    let appareilsRecette = recipe["appliance"];
    let ustensilesRecette = recipe["ustensils"];
    return construitRecette(idRecette, nomRecette, personneRecette, tempsRecette, ingredientsRecette, descriptionRecette, appareilsRecette, ustensilesRecette);
});

/** Construit les recettes **/
function construitRecette(id, nom, personne, temps, ingredients, description, appliance, ustensils) {
    /* Récupère les recettes et créer l'élément */
    let listeRecettes = document.getElementById("liste-recettes");
    let recette = document.createElement("article");
    recette.setAttribute("id", `${id}`);
    recette.setAttribute("data-nom", `${nom}`);
    recette.classList.add("recette");
    ingredients.forEach(ingredient => recette.classList.add(normalizer("ingredients-"+kebabCase(ingredient.ingredient))));
    recette.classList.add("appliance-"+normalizer(kebabCase(`${appliance}`)))
    ustensils.forEach(ustensil => recette.classList.add(normalizer("ustensils-"+kebabCase(ustensil))));
    /* Créer le template */
    let recetteTemplate = `
        <div class="image-recette"></div>
        <div class="contenu-recette">
            <h1 class="titre-recette">${nom}</h1>
            <span class="temps-preparation">${temps}</span>
            <div class="liste-ingredient">
                ${ingredients.map(ingredient =>
                    `<span class="type-ingredient">${ingredient.ingredient}<span class="nombre-ingredient">${ingredient.quantity || ''}${ingredient.quantite || ''} ${ingredient.unit || ''}</span></span>`
                ).join(" ")}
            </div>
            <div class="description-recette">
                <p>${description}</p>
            </div>
        </div>
    `;
    recette.innerHTML = recetteTemplate;
    listeRecettes.appendChild(recette);
}

/** Liste des recettes **/
let recettes = document.querySelectorAll(".recette");



/*** Gère les filtres ***/
/** Ajoute chaque élément dans la liste des filtres **/
function listeFiltres(type) {
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
        nom = kebabCase(normalizer(data));
        document.getElementById("liste-filtre-"+type).insertAdjacentHTML("beforeend", `<li class="nom-filtre" id="${type}-${nom}" data-type="${type}" data-nom="${data}" onclick="ajouteFiltre('${type}', '${nom}')">${data}</li>`);
    });
}
/* Affiche tous les ingrédients */ 
listeFiltres("ingredients");
/* Affiche tous les appareils */
listeFiltres("appliance");
/* Affiche tous les ustensiles */
listeFiltres("ustensils");

/** Liste des filtres **/
let listeIngredients = document.querySelectorAll("[data-type='ingredients']");
let listeAppareils = document.querySelectorAll("[data-type='appliance']");
let listeUstensils = document.querySelectorAll("[data-type='ustensils']");

/** Aperçu des filtres **/
/* Ouverture */
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
/* Fermeture */
function fermetureFiltre(type) {
    let btnType = document.getElementById("btn-"+type);
    let chercheType = document.getElementById("cherche-"+type);
    btnType.classList.remove("btn-cacher");
    btnType.classList.add("btn-afficher");
    chercheType.classList.remove("cherche-filtre-afficher");
    chercheType.classList.add("cherche-filtre-cacher");
}

/** Ajoute le filtre des choisis **/
let tableauFiltresChoisis = [];
let tableauFiltresChoisisID = [];
function ajouteFiltre(type, nom) {
    tableauFiltresChoisisID = [];
    tableauFiltresChoisis.push(type+"-"+nom);
    let nomID = kebabCase(nom);
    let nomAfficher = nom.replaceAll("-", " ");
    document.getElementById("filtres-choisis").insertAdjacentHTML("beforeend", `<span class="filtre filtre-${type}" id="filtre-${type}-${nomID}">${nomAfficher}<i class="far fa-times-circle" onclick="supprimeFiltre('${type}', '${nom}')"></i></span>`);
    let listeFiltresNom = document.querySelectorAll(".nom-filtre");
    switch(type) {
        /* Si le filtre est un ingrédient */
        case "ingredients":
            document.getElementById("champ-ingredients").value = "";          
            recettes.forEach(function (recette) {
                if(tableauRechercheID.includes("VIDE") === true) {
                    if(recette.classList.contains("ingredients-"+kebabCase(nom))) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    } else {
                        document.getElementById(recette.id).classList.remove("recette-afficher");
                        document.getElementById(recette.id).classList.add("recette-cacher");
                    }
                } else {
                    tableauRechercheID.forEach(rechercheID => {
                        if(recette.id === rechercheID.toString()) {
                            tableauFiltresChoisis.forEach(item => {
                                if (document.getElementById(recette.id).classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                    document.getElementById(recette.id).classList.remove("recette-cacher"); 
                                    document.getElementById(recette.id).classList.add("recette-afficher");
                                } else {
                                    document.getElementById(recette.id).classList.remove("recette-afficher");
                                    document.getElementById(recette.id).classList.add("recette-cacher");
                                }
                            });   
                        }
                    });
                }
            });
            break;
        /* Si le filtre est un appareil */
        case "appliance":
            document.getElementById("champ-appliance").value = "";
            recettes.forEach(function (recette) {
                if(tableauRechercheID.includes("VIDE") === true) {
                    if(recette.classList.contains("appliance-"+kebabCase(nom))) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    } else {
                        document.getElementById(recette.id).classList.remove("recette-afficher");
                        document.getElementById(recette.id).classList.add("recette-cacher");
                    }
                } else {
                    tableauRechercheID.forEach(rechercheID => {
                        if(recette.id === rechercheID.toString()) {
                            tableauFiltresChoisis.forEach(item => {
                                if (document.getElementById(recette.id).classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                    document.getElementById(recette.id).classList.remove("recette-cacher"); 
                                    document.getElementById(recette.id).classList.add("recette-afficher");
                                } else {
                                    document.getElementById(recette.id).classList.remove("recette-afficher");
                                    document.getElementById(recette.id).classList.add("recette-cacher");
                                }
                            });   
                        }
                    });;
                }
            });
            break;
        /* Si le filtre est un ustensile */
        case "ustensils":  
            document.getElementById("champ-ustensils").value = "";
            recettes.forEach(function (recette) {
                if(tableauRechercheID.includes("VIDE") === true) {
                    if(recette.classList.contains("ustensils-"+kebabCase(nom))) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    } else {
                        document.getElementById(recette.id).classList.remove("recette-afficher");
                        document.getElementById(recette.id).classList.add("recette-cacher");
                    }
                } else {
                    tableauRechercheID.forEach(rechercheID => {
                        if(recette.id === rechercheID.toString()) {
                            tableauFiltresChoisis.forEach(item => {
                                if (document.getElementById(recette.id).classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                    document.getElementById(recette.id).classList.remove("recette-cacher"); 
                                    document.getElementById(recette.id).classList.add("recette-afficher");
                                } else {
                                    document.getElementById(recette.id).classList.remove("recette-afficher");
                                    document.getElementById(recette.id).classList.add("recette-cacher");
                                }
                            });   
                        }
                    });
                }
            });
            break;
        default:
            break;
    }
    /* Vérifie si une recette est affichée */
    let recettesAfficher = document.querySelectorAll(".recette:not(.recette-cacher)");
    recettesAfficher.forEach(recetteAfficher => {
        tableauFiltresChoisisID.push(recetteAfficher.getAttribute("id"))
    });
    listeFiltresNom.forEach(filtre => {
        filtre.classList.remove("nom-filtre-afficher");
        filtre.style.display = "none";
    });
    tableauFiltresChoisisID.forEach(id => {
        listeFiltresNom.forEach(filtre => {
            if(document.getElementById(id).classList.contains(filtre.getAttribute("id"))) {
                document.getElementById(filtre.getAttribute("id")).classList.add("nom-filtre-afficher");
                filtre.style.display = "block";
            }
        });
    });
    if(recettesAfficher.length === 0) {
        document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
    } else {
        document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
    }
    /* Cache le filtre si cliqué */
    document.getElementById(type+"-"+nom).classList.remove("nom-filtre-afficher");
    document.getElementById(type+"-"+nom).classList.add("nom-filtre-cacher-choisis");
    document.getElementById(type+"-"+nom).style.display = "none";
}

/** Gère la barre de recherche dans les filtres **/
let tableauIngredients = [];
let tableauAppareils = [];
let tableauUstensiles = [];
listeIngredients.forEach(ingredient => {
    tableauIngredients.push(ingredient.getAttribute("data-nom"));
});
listeAppareils.forEach(appareil => {
    tableauAppareils.push(appareil.getAttribute("data-nom"));
});
listeUstensils.forEach(ustensil => {
    tableauUstensiles.push(ustensil.getAttribute("data-nom"));
});
function rechercherFiltre(type, tableau) {
    let listeType = document.querySelectorAll("[data-type='"+type+"']");
    champFiltres = document.querySelector("#champ-"+type);
    /* Suit ce que l'utilisateur rentre */
    champFiltres.addEventListener("keyup", (e) => {
        let rechercheValeur = normalizer(e.target.value);
        /* Si la recherche dépasse 1 caractère */
        if(rechercheValeur.length >= 1) {
            tableauFiltres = tableau;
            let resultatRecherche = tableauFiltres.filter((app) => {
                return(
                    normalizer(app).includes(rechercheValeur)
                );
            });
            /* Si aucun filtre n'a été choisi ni de recherche */
            if(tableauFiltresChoisis.length === 0 && tableauRechercheID.includes("VIDE") === true) {
                /* Cache les filtres */
                listeType.forEach(element => {
                    element.classList.remove("nom-filtre-afficher");
                    element.classList.add("nom-filtre-cacher");
                    element.style.display = "none";
                });
                /* Affiche ceux correspondant à la recherche */
                resultatRecherche.forEach(filtreCorrespondant => {
                    listeType.forEach(element => {
                        if(filtreCorrespondant === element.getAttribute("data-nom")) {
                            element.classList.remove("nom-filtre-cacher");
                            element.classList.add("nom-filtre-afficher");
                            element.style.display = "block";
                        }
                    });
                });
            } else {
                listeType.forEach(element => {
                    element.classList.remove("nom-filtre-afficher");
                    element.classList.add("nom-filtre-cacher");
                    element.style.display = "none";
                });
                resultatRecherche.forEach(filtreCorrespondant => {
                    let classe = type+"-"+normalizer(kebabCase(filtreCorrespondant));
                    recettes.forEach(function (recette) {
                        if(recette.classList.contains("recette-afficher") && recette.classList.contains(classe)) {
                            document.getElementById(classe).classList.add("nom-filtre-afficher");
                            document.getElementById(classe).style.display = "block";
                        }
                    });
                });
            }
        /* Sinon ré-affiche les filtres */
        } else {
            if(tableauFiltresChoisis.length === 0 && tableauRechercheID.includes("VIDE") === true) {
                listeType.forEach(element => {
                    element.classList.remove("nom-filtre-cacher");
                    element.classList.add("nom-filtre-afficher");
                    element.style.display = "block";
                });
            } else {
                recettes.forEach(function (recette) {
                    recette.classList.forEach(classe => {
                        if(recette.classList.contains("recette-afficher")) {
                            if(classe !== "recette") {
                                if(document.getElementById(classe) !== null) {
                                    document.getElementById(classe).classList.add("nom-filtre-afficher");
                                    document.getElementById(classe).style.display = "block";
                                }
                            }
                        }
                    });
                });
            }
        }
    })
}
rechercherFiltre("ingredients", tableauIngredients);
rechercherFiltre("appliance", tableauAppareils);
rechercherFiltre("ustensils", tableauUstensiles);

/** Affiche les filtres **/
function afficheFiltre(liste, type, condition) {
    liste.forEach(listeItem => {
        if(listeItem.getAttribute("id") === type+"-"+kebabCase(normalizer(condition))) {
            listeItem.classList.remove("nom-filtre-cacher");
            listeItem.classList.add("nom-filtre-afficher");
        }
    });
}

/** Cache les filtres **/
function cacheFiltre(liste) {
    liste.forEach(listeItem => {
        listeItem.classList.remove("nom-filtre-afficher");
        listeItem.classList.add("nom-filtre-cacher");
    });
}

/** Vérifie les filtres **/
function verifierFiltres(recette) {      
    resultat = tableauFiltresChoisis.every(element =>  resultat = recette.classList.contains(element));
    if(resultat === true) {
        return true;
    } else {
        return false;
    }
}

/** Supprime le filtre des choisis **/
function supprimeFiltre(type, nom) {
    /* Cache le aucun résultat */
    document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
    document.getElementById(type+"-"+kebabCase(nom)).classList.remove("filtre-cacher");
    document.getElementById(type+"-"+nom).classList.remove("nom-filtre-cacher-choisis");
    document.getElementById("filtre-"+type+"-"+kebabCase(nom)).remove();
    tableauFiltresChoisis = tableauFiltresChoisis.filter(item => item !== type+"-"+kebabCase((nom)))
    recettes.forEach(function (recette) {
        /* S'il n'y a plus de filtres ni de recherche écrite */
        if(tableauFiltresChoisis.length === 0 && tableauRechercheID.includes("VIDE") === true) {
            document.querySelectorAll(".nom-filtre").forEach(filtre => {
                filtre.classList.remove("nom-filtre-afficher");
                filtre.classList.remove("nom-filtre-cacher");
                filtre.style.display = "block";
            });
            recette.classList.remove("recette-cacher");
        } 
        /* S'il n'y a plus aucun filtres mais qu'il y a une recherche */
        else if(tableauFiltresChoisis.length === 0 && tableauRechercheID.includes("VIDE") === false) {
            recette.classList.add("recette-afficher");
            tableauRechercheID.forEach(ID => {
                if(recette.getAttribute("id") === ID.toString()) {
                    recette.classList.remove("recette-cacher");
                    recette.classList.forEach(classe => {
                        if(recette.classList.contains("recette-afficher")) {
                            if(classe !== "recette") {
                                if(document.getElementById(classe) !== null) {
                                    document.getElementById(classe).classList.add("nom-filtre-afficher");
                                    document.getElementById(classe).style.display = "block";
                                }
                            }
                        }
                    });
                } 
            });
        } 
        /* S'il y a au moins un filtre mais aucune recherche */
        else if(tableauRechercheID.includes("VIDE") === true && tableauFiltresChoisis !== 0) {
            if(verifierFiltres(recette) === true) {
                recette.classList.remove("recette-cacher"); 
                recette.classList.add("recette-afficher");
                tableauFiltresChoisis.forEach(item => {
                    if (recette.classList.contains(item) && recette.classList.contains("recette-afficher")) {
                        recette.classList.remove("recette-cacher"); 
                        recette.classList.add("recette-afficher");
                    } else {
                        recette.classList.remove("recette-afficher");
                        recette.classList.add("recette-cacher");
                    }
                });
                recette.classList.forEach(classe => {
                    if(recette.classList.contains("recette-afficher")) {
                        if(classe !== "recette") {
                            if(document.getElementById(classe) !== null) {
                                document.getElementById(classe).classList.add("nom-filtre-afficher");
                                document.getElementById(classe).style.display = "block";
                            }
                        }
                    }
                });
            } else {
                recette.classList.remove("recette-afficher");
                recette.classList.add("recette-cacher");
            }
        } 
        /* S'il reste un/des filtres et qu'il y a une recherche */
        else {
            tableauRechercheID.forEach(ID => {
                if(recette.getAttribute("id") === ID.toString()) {
                    if(verifierFiltres(recette) === true) {
                        recette.classList.remove("recette-cacher"); 
                        recette.classList.add("recette-afficher");
                        tableauFiltresChoisis.forEach(item => {
                            if (recette.classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                recette.classList.remove("recette-cacher"); 
                                recette.classList.add("recette-afficher");
                            } else {
                                recette.classList.remove("recette-afficher");
                                recette.classList.add("recette-cacher");
                            }
                        });
                        recette.classList.forEach(classe => {
                            if(recette.classList.contains("recette-afficher")) {
                                if(classe !== "recette") {
                                    if(document.getElementById(classe) !== null) {
                                        document.getElementById(classe).classList.add("nom-filtre-afficher");
                                        document.getElementById(classe).style.display = "block";
                                    }
                                }
                            }
                        });
                    } else {
                        recette.classList.remove("recette-afficher");
                        recette.classList.add("recette-cacher");
                    }
                } 
            });
        }
    });
    let recettesAfficher = document.querySelectorAll(".recette:not(.recette-cacher)").length;
    if(recettesAfficher === 0) {
        document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
    } else {
        document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
    }
}



/*** Gère la barre de recherche principale ***/
/** Champ rechercher **/
let champRechercher = document.querySelector('#champ-rechercher');
let tableauRechercheID = [];
tableauRechercheID.push("VIDE")
function rechercher(recipes) {
    /* Suit ce que l'utilisateur rentre */
    champRechercher.addEventListener("keyup", (e) => {
        let rechercheValeur = normalizer(e.target.value);
        /* Cache le aucun résultat */
        document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
        /* Si + de 3 caractères */
        if(rechercheValeur.length >= 3) {
            let resultatRecherche = recipes.filter((recette) => {
                return(
                    normalizer(recette.name).includes(rechercheValeur) ||
                    recette.ingredients.some((numIngredient) => normalizer(numIngredient.ingredient).includes(rechercheValeur)) ||
                    normalizer(recette.description).includes(rechercheValeur)
                );
            });
            /* Cache toutes les recettes */
            recettes.forEach(recette => {
                recette.classList.remove("recette-afficher");
                recette.classList.add("recette-cacher");
            });
            /* Cache tout les filtres */
            cacheFiltre(listeIngredients);
            cacheFiltre(listeAppareils);
            cacheFiltre(listeUstensils);
            /* Recherche si un nom, ingrédient, description correspond */
            tableauRechercheID = [];
            resultatRecherche.forEach(recettesCorrespondantes => {
                /* Affiche la recette */
                document.getElementById(recettesCorrespondantes.id).classList.remove("recette-cacher");
                document.getElementById(recettesCorrespondantes.id).classList.add("recette-afficher");
                /* Gère l'élément dans un tableau */
                if(document.getElementById(recettesCorrespondantes.id).classList.contains("recette-afficher")) {
                    tableauRechercheID.push(recettesCorrespondantes.id);
                }
                /* Affiche les ingrédients correspondants */
                recettesCorrespondantes.ingredients.map(ingredient => {
                    afficheFiltre(listeIngredients, "ingredients", ingredient.ingredient);
                });
                /* Affiche les appareils correspondants */
                afficheFiltre(listeAppareils, "appliance", recettesCorrespondantes.appliance);
                /* Affiche les ustensiles correspondants */
                recettesCorrespondantes.ustensils.map(ustensile => {
                    afficheFiltre(listeUstensils, "ustensils", ustensile);
                });
                /* Si au moins un filtre est choisi */
                if(tableauFiltresChoisis.length !== 0) {
                    document.querySelectorAll(".nom-filtre").forEach(filtre => {
                        filtre.classList.remove("nom-filtre-afficher");
                        filtre.style.display = "none";
                    });
                    recettes.forEach(recette => {
                        tableauFiltresChoisis.forEach(item => {
                            if (recette.classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                recette.classList.remove("recette-cacher"); 
                                recette.classList.add("recette-afficher");
                            } else {
                                recette.classList.remove("recette-afficher");
                                recette.classList.add("recette-cacher");
                            }
                        });  
                        recette.classList.forEach(classe => {
                            if(recette.classList.contains("recette-afficher")) {
                                if(classe !== "recette") {
                                    if(document.getElementById(classe) !== null) {
                                        document.getElementById(classe).classList.add("nom-filtre-afficher");
                                        document.getElementById(classe).style.display = "block";
                                    }
                                }
                            }
                        });
                    });
                /* Si aucun filtre n'est choisi */
                } else {
                    document.querySelectorAll(".nom-filtre").forEach(filtre => {
                        filtre.classList.remove("nom-filtre-afficher");
                        filtre.style.display = "none";
                    });
                    recettes.forEach(recette => {
                        if (recette.classList.contains("recette-afficher")) {
                            recette.classList.remove("recette-cacher"); 
                            recette.classList.add("recette-afficher");
                        } else {
                            recette.classList.remove("recette-afficher");
                            recette.classList.add("recette-cacher");
                        }
                        recette.classList.forEach(classe => {
                            if(recette.classList.contains("recette-afficher")) {
                                if(classe !== "recette") {
                                    if(document.getElementById(classe) !== null) {
                                        document.getElementById(classe).classList.add("nom-filtre-afficher");
                                        document.getElementById(classe).style.display = "block";
                                    }
                                }
                            }
                        });
                    });
                }
            });
            /* Vérifie si une recette est affichée */
            let nbRecettesAfficher = document.querySelectorAll(".recette-afficher").length;
            if(nbRecettesAfficher === 0) {
                document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
                tableauRechercheID.push("AUCUN");
                document.querySelectorAll(".nom-filtre").forEach(filtre => {
                    filtre.classList.remove("nom-filtre-afficher");
                    filtre.classList.remove("nom-filtre-cacher");
                    filtre.classList.add("nom-filtre-cacher");
                    filtre.style.display = "none";
                });
            } else {
                document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
            }
        } else {
            /* Affiche toutes les recettes et tous les filtres */
            tableauRechercheID = [];
            tableauRechercheID.push("VIDE");
            if(tableauFiltresChoisis.length === 0) { 
                recettes.forEach(recette => {
                    recette.classList.remove("recette-cacher");
                });
                document.querySelectorAll(".nom-filtre").forEach(filtre => {
                    filtre.classList.remove("nom-filtre-afficher");
                    filtre.classList.remove("nom-filtre-cacher");
                    filtre.style.display = "block";
                });
            /* Pareil mais avec les filtres choisis */
            } else {
                recettes.forEach(recette => {
                    if(verifierFiltres(recette) === true) {
                        recette.classList.remove("recette-cacher"); 
                        recette.classList.add("recette-afficher");
                        tableauFiltresChoisis.forEach(item => {
                            if (recette.classList.contains(item) && recette.classList.contains("recette-afficher")) {
                                recette.classList.remove("recette-cacher"); 
                                recette.classList.add("recette-afficher");
                            } else {
                                recette.classList.remove("recette-afficher");
                                recette.classList.add("recette-cacher");
                            }
                        });
                        recette.classList.forEach(classe => {
                            if(recette.classList.contains("recette-afficher")) {
                                if(classe !== "recette") {
                                    if(document.getElementById(classe) !== null) {
                                        document.getElementById(classe).classList.add("nom-filtre-afficher");
                                        document.getElementById(classe).style.display = "block";
                                    }
                                }
                            }
                        });
                    } else {
                        recette.classList.remove("recette-afficher");
                        recette.classList.add("recette-cacher");
                    }
                });
            }
        }
    });
}
rechercher(recipes);