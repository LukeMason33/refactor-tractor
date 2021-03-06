let cardContainer = document.querySelector("#card-container");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let tabCount = 6;

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
        <div class="card-icons">
        <img tabindex="${tabCount + 1}" src="../images/pot-outline.png" alt="unfilled pot icon" class="card-pot-icon">
        <img tabindex="${tabCount + 2}" src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
        </div>
      </div>`
    tabCount += 3;
    cardContainer.insertAdjacentHTML("beforeend", cardHtml);
  },

  // FILTER BY RECIPE TAGS
  listRecipeTagsOnDom(allTags, tagList) {
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
    let ingredientsList = '';
    ingredients.forEach(ing => {
      ingredientsList += `<li>${ing}</li>`
    })
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <div class="recipe-display">
        <img class="recipe-img" src=${recipe.image} alt=${recipe.name}>
        <div class="ing-list">
          <h4>Ingredients</h4>
          <ul>${ingredientsList}</ul>
        </div>
      </div>`
    fullRecipeInfo.insertAdjacentHTML("afterbegin", recipeTitle);
  },

  generateIngredients(recipe) {
    return recipe.ingredients.map(i => {
      return `${capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})`
    });
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
    let types = "";
    if (recipe.tags[0] === undefined) {
      types = `<p><b>Sorry the type was not defined yet :( Check back later!</b></p>`
    } else {
      recipe.tags.forEach(type => {
        types += `<h4 class="type-pad">${type}</h4>`
      })
    }
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<div class="card-tag-list">${types}</div>`);
  },

  compareRecipeIngredientsToPantry(recipe, user, cost) {
    let comparison = "";
    recipe.ingredients.map(ingredient => {
      let found = user.pantry.find(supply => {
        return ingredient.id === supply.ingredient
      })
      if (found !== undefined) {
        let difference = found.amount - ingredient.quantity.amount;
        if (difference < 0) {
          comparison += `<li>You are short <b>${Math.abs(difference)} ${ingredient.quantity.unit}</b> of <i>${ingredient.name}</i>!</li>`;
        }
      } else {
        comparison += `<li>You don't have any <i>${ingredient.name}</i></li>`
      }
    })
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<div class="pantry-display">
      <div>
        <h4>Pantry Comparison</h4>
        <ol>${comparison}</ol>
      </div>
      <div class="pantry-list-right">
        <h4>Cost to make this recipe: ${cost}</h4>
      </div>
      </div>`);
    if (!document.querySelector(".my-meals-to-cook-banner").classList.contains("hidden")) {
      this.insertMadeThisButtonToCard();
    }
  },

  insertMadeThisButtonToCard () {
    let recipeInfo = document.querySelector('.pantry-list-right');
    recipeInfo.insertAdjacentHTML("beforeend", `<button class="made-this-btn square-btns">I made this!</button>
            <p class="warning">*Note: By pressing this button, your pantry will be
            <br> updated to reflect ingredients used!</p>`)
  },

  insertRecipeInfo(fullRecipeInfo) {
    fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
  },

  // TOGGLE DISPLAYS
  showCorrectBanner(event) {
    let welcomeMsg = document.querySelector(".welcome-msg");
    let myRecipesBanner = document.querySelector(".my-recipes-banner");
    let myMealsToCookBanner = document.querySelector(".my-meals-to-cook-banner");
    welcomeMsg.classList.add("hidden");
    if (event.target.className.includes("together")) {
      toggleHidden(myRecipesBanner, "shown", "hidden");
      toggleHidden(myMealsToCookBanner, "hidden", "shown");
    } else if (event.target.className.includes("connect")) {
      toggleHidden(myMealsToCookBanner, "shown", "hidden");
      toggleHidden(myRecipesBanner, "hidden", "shown");
    }
  },

  showWelcomeBanner() {
    let welcomeMsg = document.querySelector(".welcome-msg");
    welcomeMsg.classList.remove("hidden");
    let myRecipesBanner = document.querySelector(".my-recipes-banner");
    toggleHidden(myRecipesBanner, "hidden", "shown");
    let myMealsToCookBanner = document.querySelector(".my-meals-to-cook-banner");
    toggleHidden(myMealsToCookBanner, "hidden", "shown");
  },

  // FAVORITE RECIPE FUNCTIONALITY
  favoriteRecipe(user, event) {
    let cardId = parseInt(event.target.closest(".recipe-card").id);
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      event.target.alt = "filled apple icon";
      user.saveRecipe(cardId, "favoriteRecipes");
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      event.target.alt = "unfilled apple icon";
      user.removeRecipe(cardId, "favoriteRecipes");
    }
  },

  // RECIPES TO COOK FUNCTIONALITY
  addOrRemoveFromRecipesToCook(user, event) {
    let cardId = parseInt(event.target.closest(".recipe-card").id);
    if (!user.recipesToCook.includes(cardId)) {
      event.target.src = "../images/full-pot.png";
      event.target.alt = "filled pot icon";
      user.saveRecipe(cardId, "recipesToCook");
    } else {
      event.target.src = "../images/pot-outline.png";
      event.target.alt = "unfilled pot icon";
      user.removeRecipe(cardId, "recipesToCook");
    }
  },

  // CREATE AND USE PANTRY
  displayPantryInfo(pantry) {
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li>${capitalize(ingredient.name)}, ${ingredient.amount}</li>`;
      let pantryList = document.querySelector(".pantry-tag-list")
      pantryList.insertAdjacentHTML("beforeend", ingredientHtml);
    });
  },

};

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function toggleHidden(querySelector, add, remove) {
  querySelector.classList.add(add);
  querySelector.classList.remove(remove);
}


export default domUpdates;
