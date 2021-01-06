let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let menuOpen = false;
let fullRecipeInfo = document.querySelector(".recipe-instructions");

let domUpdates = {

  // GENERATE A USER ON LOAD
  greetUserOnLoad(firstName) {
    let welcomeMsg = `<div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
      document.querySelector(".banner-image").insertAdjacentHTML("afterbegin", welcomeMsg);
      // Ask Travis about chaining here to insert html on not declared querySelector
  },

  // RECIPE CARDS
  addCardsToDom(recipeInfo, shortRecipeName) {
    let cardHtml = `<div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
      main.insertAdjacentHTML("beforeend", cardHtml);
  },

  // FILTER BY RECIPE TAGS
  listRecipeTagsOnDom(tag, capitalizedTag) {
    return `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${capitalizedTag}</label></li>`;
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  // FAVORITE RECIPE FUNCTIONALITY

  // CREATE RECIPE INSTRUCTIONS
  generateRecipeTitle(recipe, ingredients) {
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <p>${ingredients}</p>`
    fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
  },

  addRecipeImage(recipe) {
    document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
  },

  generateInstructions(recipe) {
    let instructionsList = "";
    let instructions = recipe.instructions.map(i => {
      return i.instruction
    });
    instructions.forEach(i => {
      instructionsList += `<li>${i}</li>`
    });
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
  },

  // TOGGLE DISPLAYS
  showMyRecipesBanner() {
    document.querySelector(".welcome-msg").style.display = "none";
    document.querySelector(".my-recipes-banner").style.display = "block";
  },

  showWelcomeBanner() {
    document.querySelector(".welcome-msg").style.display = "flex";
    document.querySelector(".my-recipes-banner").style.display = "none";
  },
  // Ask Travis about updating css in scripts, should this be a dom thing?

  // SEARCH RECIPES
  toggleMenu() {
    var menuDropdown = document.querySelector(".drop-menu");
    menuOpen = !menuOpen;
    if (menuOpen) {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  },

  // CREATE AND USE PANTRY
  displayPantryInfo(pantry) {
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
        <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
      document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
        ingredientHtml);
    });
  },

};

pantryBtn.addEventListener("click", domUpdates.toggleMenu);

export default domUpdates;
