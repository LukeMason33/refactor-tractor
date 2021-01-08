// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientsData from './data/ingredient-data';

//CSS FILES
import './css/base.scss';
import './css/styles.scss';
//API DATA
import fetchedData from './fetch.js';
//DOM UPDATES
import domUpdates from './domUpdates.js';
//IMAGES
import './images/apple-logo-outline.png';
import './images/apple-logo.png';
import './images/cookbook.png';
import './images/seasoning.png';
import './images/search.png';
//CLASSES
import User from './user';
import Recipe from './recipe';
//QUERY SELECTORS
let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
// let menuOpen = false;
// let pantryBtn = document.querySelector(".my-pantry-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
// let tagList = document.querySelector(".tag-list");

//GLOBAL VARIABLES
let user;
let usersData;
let recipeData;
let ingredientsData;
let pantryInfo = [];
let recipes = [];
let favoriteRecipes;

//EVENT LISTNERS
window.addEventListener("load", fetchAllData);
allRecipesBtn.addEventListener("click", displayAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
// pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", liveSearch);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("keyup", liveSearch);

// GENERATE A USER ON LOAD
function generateUser(usersData) {
  user = new User(usersData[Math.floor(Math.random() * usersData.length)]);
  let firstName = user.name.split(" ")[0];
  domUpdates.greetUserOnLoad(firstName);
  findPantryInfo();
}
//Generate API Data on Load
function fetchAllData() {
  Promise.all([fetchedData.usersAPIData(), fetchedData.recipesAPIData(), fetchedData.ingredientsAPIData()])
    .then(data => {
      usersData = data[0];
      recipeData = data[1];
      ingredientsData = data[2];
      generateUser(usersData);
      createCards(recipeData);
      getIngredientNamesForRecipe();
      findTags(recipeData);
    })
}


// CREATE RECIPE CARDS
function createCards(recipeData) {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    domUpdates.addCardsToDom(recipeInfo, shortRecipeName)
  });
}

function getIngredientNamesForRecipe () {
  recipes.forEach(recipe => {
    recipe.generateIngredientsNameById(ingredientsData);
    return recipe;
  })
}


// FILTER BY RECIPE TAGS
function findTags(recipeData) {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  domUpdates.listRecipeTagsOnDom(tags);
}

// function listTags(allTags) {
//   allTags.forEach(tag => {
//     domUpdates.listRecipeTagsOnDom(tag);
//   });
// }

// function capitalize(words) {
//   return words.split(" ").map(word => {
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   }).join(" ");
// }

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes)
}

// FAVORITE RECIPE FUNCTIONALITY
function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    domUpdates.favoriteRecipe(user, event);
  }
  // if (event.target.className === "card-apple-icon") {
  //   let cardId = parseInt(event.target.closest(".recipe-card").id)
  //   if (!user.favoriteRecipes.includes(cardId)) {
  //     event.target.src = "../images/apple-logo.png";
  //     user.saveRecipe(cardId);
  //   } else {
  //     event.target.src = "../images/apple-logo-outline.png";
  //     user.removeRecipe(cardId);
  //   }
  // }
  else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

// function addToFavorites() {
//   domUpdates.favoriteRecipe(user, event);
// }

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function showSavedRecipes() {
    favoriteRecipes = recipes.filter(recipe => {
    return user.favoriteRecipes.includes(recipe.id);
  });
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  domUpdates.showMyRecipesBanner();
  liveSearch();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  domUpdates.generateRecipeTitle(recipe, domUpdates.generateIngredients(recipe));
  domUpdates.addRecipeImage(recipe);
  domUpdates.generateInstructions(recipe);
  domUpdates.insertRecipeInfo(fullRecipeInfo);
}

// function generateRecipeTitle(recipe, ingredients) {
//   let recipeTitle = `
//     <button id="exit-recipe-btn">X</button>
//     <h3 id="recipe-title">${recipe.name}</h3>
//     <h4>Ingredients</h4>
//     <p>${ingredients}</p>`
//   fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
// }

// function addRecipeImage(recipe) {
//   document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
// }

// function generateIngredients(recipe) {
//   return recipe && recipe.ingredients.map(i => {
//     return `${capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})`
//   }).join(", ");
// }

// function generateInstructions(recipe) {
//   let instructionsList = "";
//   let instructions = recipe.instructions.map(i => {
//     return i.instruction
//   });
//   instructions.forEach(i => {
//     instructionsList += `<li>${i}</li>`
//   });
//   fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
//   fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
// }

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// // TOGGLE DISPLAYS
// function showMyRecipesBanner() {
//   document.querySelector(".welcome-msg").style.display = "none";
//   document.querySelector(".my-recipes-banner").style.display = "block";
// }
//
// function showWelcomeBanner() {
//   document.querySelector(".welcome-msg").style.display = "flex";
//   document.querySelector(".my-recipes-banner").style.display = "none";
// }

// SEARCH RECIPES
function liveSearch() {
  if (document.querySelector(".my-recipes-banner").classList.contains("hidden")) {
    searchRecipes(favoriteRecipes);
    //REFACTOR THIS MAKE CLASS METHOD
  } else {
    searchRecipes(recipes);
  }
}

function searchRecipes(input) {
  let searchedItems = [];
  input.filter(recipe => {
    recipe.ingredients.filter(ing => {
      if (ing.name.includes(searchInput.value) && !searchedItems.includes(recipe.name)) {
        searchedItems.push(recipe);
      }
    })
    if (recipe.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchedItems.push(recipe)
    };
  });
  filterNonSearched(searchedItems);
  showAllRecipes(searchedItems);
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  domUpdates.hideUnselectedRecipes(found);
}

// function toggleMenu() {
//   var menuDropdown = document.querySelector(".drop-menu");
//   menuOpen = !menuOpen;
//   if (menuOpen) {
//     menuDropdown.style.display = "block";
//   } else {
//     menuDropdown.style.display = "none";
//   }
// }

function displayAllRecipes() {
  showAllRecipes(recipeData);
  domUpdates.showWelcomeBanner();
}

function showAllRecipes(recipes) {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
}

// CREATE AND USE PANTRY
function findPantryInfo() {
  user.pantry.forEach(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

// function displayPantryInfo(pantry) {
//   pantry.forEach(ingredient => {
//     let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
//       <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
//     document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
//       ingredientHtml);
//   });
// }

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes();
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
}
