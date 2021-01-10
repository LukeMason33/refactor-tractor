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
import './images/full-pot.png';
import './images/pot-outline.png';
import './images/seasoning.png';
import './images/search.png';
//CLASSES
import User from './user';
import Recipe from './recipe';
//QUERY SELECTORS
let allRecipesBtn = document.querySelector(".show-all-btn");
let backToMainBtn = document.querySelector(".back-to-main-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let mealsToCookBtn = document.querySelector(".meals-to-cook-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");

//GLOBAL VARIABLES
let user;
let usersData;
let recipeData;
let ingredientsData;
let pantryInfo = [];
let recipes = [];
let favoriteRecipes;
let recipesToCook;

//EVENT LISTNERS
window.addEventListener("load", fetchAllData);
allRecipesBtn.addEventListener("click", displayAllRecipes);
backToMainBtn.addEventListener("click", displayAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
main.addEventListener("keyup", pressEnterToViewInfoOrFavorite)
mealsToCookBtn.addEventListener("click", showMealsToCook);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchForm.addEventListener("keyup", liveSearch);

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

// GENERATE A USER ON LOAD
function generateUser(usersData) {
  user = new User(usersData[Math.floor(Math.random() * usersData.length)]);
  let firstName = user.name.split(" ")[0];
  domUpdates.greetUserOnLoad(firstName);
  findPantryInfo();
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

function getIngredientNamesForRecipe() {
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
  showAllRecipes(recipes);
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
function pressEnterToViewInfoOrFavorite(event){
  if (event.keyCode === 13) {
    addToMyRecipes();
  }
}

function addToMyRecipes(showSavedRecipes) {
  if (event.target.className === "card-apple-icon" && document.querySelector(".my-recipes-banner").classList.contains("hidden")) {
    domUpdates.favoriteRecipe(user, event);
    filterFavorites();
  } else if (event.target.className === "card-apple-icon") {
    domUpdates.favoriteRecipe(user, event);
  } else if (event.target.className === "card-pot-icon") {
    domUpdates.addOrRemoveFromRecipesToCook(user, event)
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

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

function filterFavorites() {
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
}

function showSavedRecipes() {
  filterFavorites();
  domUpdates.showCorrectBanner(event);
  liveSearch();
}

// RECIPES TO COOK FUNCTIONALITY
function filterRecipesToCook() {
  recipesToCook = recipes.filter(recipe => {
    return user.recipesToCook.includes(recipe.id);
  });
  let notToCook = recipes.filter(recipe => {
    return !user.recipesToCook.includes(recipe.id);
  });
  notToCook.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

function showMealsToCook() {
  filterRecipesToCook();
  domUpdates.showCorrectBanner(event);
  // liveSearch();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  domUpdates.generateRecipeTitle(recipe, domUpdates.generateIngredients(recipe));
  domUpdates.addRecipeImage(recipe);
  domUpdates.generateInstructions(recipe);
  domUpdates.generateTypeForRecipe(recipe);
  domUpdates.compareRecipeIngredientsToPantry(recipe, user);
  domUpdates.insertRecipeInfo(fullRecipeInfo);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

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

function displayAllRecipes() {
  showAllRecipes(recipes);
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
      pantryInfo.push({
        name: itemInfo.name,
        count: item.amount
      });
    }
  });
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes(recipes);
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
