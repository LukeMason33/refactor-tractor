let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let menuOpen = false;
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let tabCount = 5;

let domUpdates = {

  // GENERATE A USER ON LOAD
  greetUserOnLoad(firstName) {
    let welcomeMsg = `<div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
    let bannerImage = document.querySelector(".banner-image")
    bannerImage.insertAdjacentHTML("afterbegin", welcomeMsg);
  },

  // RECIPE CARDS
  addCardsToDom(recipeInfo, shortRecipeName) {
    let cardHtml = `<div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div tabindex="${tabCount}" class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img tabindex="${tabCount + 1}" src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
      tabCount += 2;
    main.insertAdjacentHTML("beforeend", cardHtml);
  },

  // FILTER BY RECIPE TAGS
  listRecipeTagsOnDom(allTags) {
    let tagList = document.querySelector(".tag-list");
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${capitalize(tag)}</label></li>`;
      tagList.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  // CREATE RECIPE INSTRUCTIONS
  generateRecipeTitle(recipe, ingredients) {
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <p>${ingredients}</p>`
    fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
  },

  generateIngredients(recipe) {
    return recipe && recipe.ingredients.map(i => {
      return `${capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})`
    }).join(", ");
  },

  addRecipeImage(recipe) {
    let recipeTitle = document.getElementById("recipe-title")
    recipeTitle.style.backgroundImage = `url(${recipe.image})`;
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

  generateTypeForRecipe(recipe) {
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Recipe Types</h4>");
    let types;
    if (recipe.tags[0] === undefined) {
      types = `<b>Sorry the type was not defined yet :( Check back later!</b>`
    } else {
      types = recipe.tags.map(type => {
        return `<b>${capitalize(type)}</b>`
      }).join(", ");
    }
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<p>${types}</p>`);
  },

  compareRecipeIngredientsToPantry(recipe, user) {
    let comparison = "";
    recipe.ingredients.map(ingredient => {
      let found = user.pantry.find(supply => {
        return ingredient.id === supply.ingredient
      })
      if (found !== undefined) {
        let difference = found.amount - ingredient.quantity.amount;
        if (difference < 0) {
          comparison += `<li>You are short <b>${Math.abs(difference)} ${ingredient.quantity.unit}</b> of <i>${ingredient.name}</i>!</li>`;
        } else if (difference >= 0) {
          comparison += `<li>You have enough <i>${ingredient.name}</i> to make this!</li>`;
        }
      } else {
        comparison += `<li>You dont have any <i>${ingredient.name}</i></li>`
      }
    })
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Pantry Comparison</h4>");
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${comparison}</ol>`);
  },

  insertRecipeInfo(fullRecipeInfo) {
    fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
  },

  // TOGGLE DISPLAYS
  showMyRecipesBanner() {
    let welcomeMsg = document.querySelector(".welcome-msg")
    welcomeMsg.style.display = "none";
    let myRecipesBanner = document.querySelector(".my-recipes-banner")
    myRecipesBanner.style.display = "block";
    myRecipesBanner.classList.add("hidden");

  },

  showWelcomeBanner() {
    let welcomeMsg = document.querySelector(".welcome-msg")
    welcomeMsg.style.display = "flex";
    let myRecipesBanner = document.querySelector(".my-recipes-banner")
    myRecipesBanner.style.display = "none";
    myRecipesBanner.classList.remove("hidden");
  },
  // Ask Travis about updating css in scripts, should this be a dom thing?

  // SEARCH RECIPES
  toggleMenu() {
    let menuDropdown = document.querySelector(".drop-menu");
    menuOpen = !menuOpen;
    if (menuOpen) {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  },

  // FAVORITE RECIPE FUNCTIONALITY
  favoriteRecipe(user, event) {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  },

  // CREATE AND USE PANTRY
  displayPantryInfo(pantry) {
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
        <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
      let pantryList = document.querySelector(".pantry-list")
      pantryList.insertAdjacentHTML("beforeend", ingredientHtml);
    });
  },

};

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

pantryBtn.addEventListener("click", domUpdates.toggleMenu);

export default domUpdates;
