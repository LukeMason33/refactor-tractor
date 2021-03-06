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
import './images/down-arrow.png';
import './images/full-pot.png';
import './images/pot-outline.png';
import './images/right-arrow.png';
import './images/seasoning.png';
import './images/search.png';

//CLASSES
import User from './user';
import Recipe from './recipe';

//QUERY SELECTORS
let allRecipesBtn = document.querySelector(".show-all-btn");
let backToMainBtn = document.querySelector(".back-to-main-btn");
let cardContainer = document.querySelector("#card-container");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let mealsToCookBtn = document.querySelector(".meals-to-cook-btn");
let pantryDropDown = document.querySelector(".pantry-drop-down");
let pantryList = document.querySelector(".pantry-tag-list")
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let tagList = document.querySelector(".tag-list");
let tagDropDown = document.querySelector(".tag-drop-down");

//GLOBAL VARIABLES
let user;
let usersData;
let recipeData;
let ingredientsData;
let recipes = [];

//EVENT LISTENERS
window.addEventListener("load", fetchAllData);
allRecipesBtn.addEventListener("click", displayAllRecipes);
allRecipesBtn.addEventListener("keyup", pressEnterToViewInfoOrFavorite);
backToMainBtn.addEventListener("click", displayAllRecipes);
backToMainBtn.addEventListener("keyup", pressEnterToViewInfoOrFavorite);
filterBtn.addEventListener("click", findCheckedBoxes);
fullRecipeInfo.addEventListener("click", addToMyRecipes);
cardContainer.addEventListener("click", addToMyRecipes);
fullRecipeInfo.addEventListener("click", addToMyRecipes);
cardContainer.addEventListener("keyup", pressEnterToViewInfoOrFavorite)
mealsToCookBtn.addEventListener("click", showMealsToCook);
pantryDropDown.addEventListener("click", toggleDropDown);
pantryDropDown.addEventListener("keyup", pressEnterToViewInfoOrFavorite);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchForm.addEventListener("keyup", liveSearch);
tagDropDown.addEventListener("click", toggleDropDown);
tagDropDown.addEventListener("keyup", pressEnterToViewInfoOrFavorite);

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
  findPantryInfo(user);
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
  domUpdates.listRecipeTagsOnDom(tags, tagList);
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
    let allRecipes = filterByBannerType(tag);
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  } else {
    liveSearch();
  }
}

function filterByBannerType(tag) {
  let welcomeMsg = document.querySelector(".welcome-msg");
  let myRecipesBanner = document.querySelector(".my-recipes-banner");
  let myMealsToCookBanner = document.querySelector(".my-meals-to-cook-banner");
  let filtered;
  if (!welcomeMsg.className.includes("hidden")) {
    filtered = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
  } else if (myRecipesBanner.className.includes("shown")) {
    let totalRecipeInfoMyRecipes = user.generateRecipeInfoById(recipeData, "favoriteRecipes");
    filtered = filterSpecificArray(totalRecipeInfoMyRecipes, tag);
  } else if (myMealsToCookBanner.className.includes("shown")) {
    let totalRecipeInfoMyMeals = user.generateRecipeInfoById(recipeData, "recipesToCook");
    filtered = filterSpecificArray(totalRecipeInfoMyMeals, tag);
  }
  return filtered;
}

function filterSpecificArray(array, tag) {
  return array.filter(recipe => {
    return recipe.tags.includes(tag.id);
  });
}


function filterRecipes(filtered) {
  let filterTypeFound = [];
  recipes.forEach(recipe => {
    filtered.forEach(filteredRecipe => {
      if (filteredRecipe.id === recipe.id) {
        filterTypeFound.push(recipe);
      }
    });
  });
  let toHide = recipes.filter(recipe => {
    return !filterTypeFound.includes(recipe);
  })
  domUpdates.hideUnselectedRecipes(toHide)
}

// FAVORITE RECIPE FUNCTIONALITY
function pressEnterToViewInfoOrFavorite(event) {
  if (event.keyCode === 13 && event.target.className.includes("square-btns")) {
    displayAllRecipes();
  } else if (event.keyCode === 13 && event.target.className.includes("pantry-drop-down")) {
    toggleDropDown(event)
  } else if (event.keyCode === 13 && event.target.className.includes("tag-drop-down")) {
    toggleDropDown(event)
  } else if (event.keyCode === 13) {
    addToMyRecipes();
  }
}

function addToMyRecipes(event) {
  if (event.target.className === "card-apple-icon" && document.querySelector(".my-recipes-banner").classList.contains("shown")) {
    domUpdates.favoriteRecipe(user, event);
    filterFavorites();
  } else if (event.target.className === "card-apple-icon") {
    domUpdates.favoriteRecipe(user, event);
  } else if (event.target.className === "card-pot-icon" && document.querySelector(".my-meals-to-cook-banner").classList.contains("shown")) {
    domUpdates.addOrRemoveFromRecipesToCook(user, event);
    filterRecipesToCook();
  } else if (event.target.className === "card-pot-icon") {
    domUpdates.addOrRemoveFromRecipesToCook(user, event);
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
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

function showSavedRecipes(event) {
  filterFavorites();
  domUpdates.showCorrectBanner(event);
  liveSearch();
}

// RECIPES TO COOK FUNCTIONALITY
function filterRecipesToCook() {
  let notToCook = recipes.filter(recipe => {
    return !user.recipesToCook.includes(recipe.id);
  });
  notToCook.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

function showMealsToCook(event) {
  filterRecipesToCook();
  domUpdates.showCorrectBanner(event);
  liveSearch();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  recipe = new Recipe(recipe);
  let cost = `$${recipe.calculateIngredientsCost(ingredientsData)}`;
  domUpdates.generateRecipeTitle(recipe, domUpdates.generateIngredients(recipe));
  domUpdates.generateTypeForRecipe(recipe);
  domUpdates.generateInstructions(recipe);
  domUpdates.compareRecipeIngredientsToPantry(recipe, user, cost);
  domUpdates.insertRecipeInfo(fullRecipeInfo);
  removeIngredientsFromPantry(recipe);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild)) 
    fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
  if (!document.querySelector(".my-meals-to-cook-banner").classList.contains("hidden")) {
    filterRecipesToCook();
  }
  
}

// SEARCH RECIPES
function liveSearch() {
  if (document.querySelector(".my-recipes-banner").classList.contains("shown")) {
    searchRecipes(user.generateRecipeInfoById(recipeData, "favoriteRecipes"));
  } else if (document.querySelector(".my-meals-to-cook-banner").classList.contains("shown")) {
    searchRecipes(user.generateRecipeInfoById(recipeData, "recipesToCook"));
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
    }
  });
  filterNonSearched(searchedItems);
  showAllRecipes(searchedItems);
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id);
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
  })
}

// CREATE AND USE PANTRY
function findPantryInfo(userInput) {
  userInput.generatePantryInfoById(ingredientsData);
  domUpdates.displayPantryInfo(userInput.pantry);
}

// TOGGLE DROP DOWN MENU
function toggleDropDown(event) {
  if (event.target.className.includes("pantry-drop-down") && pantryList.className.includes("hidden")) {
    toggleHiddenAndArrowDirection(pantryList, pantryDropDown, "remove", "down")
    pantryDropDown.setAttribute("aria-expanded", true);
    pantryDropDown.setAttribute("aria-label", "Close Pantry");
  } else if (event.target.className.includes("pantry-drop-down") && !pantryList.className.includes("hidden")) {
    toggleHiddenAndArrowDirection(pantryList, pantryDropDown, "add", "right")
    pantryDropDown.setAttribute("aria-expanded", false);
    pantryDropDown.setAttribute("aria-label", "Open Pantry");
  } else if (event.target.className.includes("tag-drop-down") && tagList.className.includes("hidden")) {
    toggleHiddenAndArrowDirection(tagList, tagDropDown, "remove", "down")
    tagDropDown.setAttribute("aria-expanded", true);
    tagDropDown.setAttribute("aria-label", "Close Tag");
  } else if (event.target.className.includes("tag-drop-down") && !tagList.className.includes("hidden")) {
    toggleHiddenAndArrowDirection(tagList, tagDropDown, "add", "right")
    tagDropDown.setAttribute("aria-expanded", false);
    tagDropDown.setAttribute("aria-label", "Open Tags");
  }
}

function toggleHiddenAndArrowDirection(list, dropDown, addOrRemove, direction) {
  list.classList[addOrRemove]("hidden");
  dropDown.src = `../images/${direction}-arrow.png`;
}

//MODIFY USERS PANTRY USING FETCH/POST API
function removeIngredientsFromPantry(recipe) {
  if (!document.querySelector(".my-meals-to-cook-banner").classList.contains("hidden")) {
    let madeThisBtn = document.querySelector('.made-this-btn');
    madeThisBtn.addEventListener('click', function () {
      user.removeRecipe(recipe, "recipesToCook");
      recipe.ingredients.forEach(ing => {
        user.pantry.forEach(ingr => {
          if (ing.id === ingr.ingredient && ingr.amount >= ing.quantity.amount) {
            fetchedData.modifyUsersPantry(user.id, ing.id, ing.quantity.amount);
          }
        })
      })
      updateUserPantryWithAPI();
    })
  }
}

function updateUserPantryWithAPI () {
  let updatedUser;
  fetchedData.usersAPIData()
    .then(people => {
      updatedUser = new User(people.find(person => person.name === user.name));
      pantryList.innerHTML = "";
      findPantryInfo(updatedUser);
    })
}
