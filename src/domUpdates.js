let main = document.querySelector("main");
// let menuOpen = false;
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
    let ingredientsList = '';
    let recipeIngredients = ingredients.split(',')
    recipeIngredients.forEach(ing => {
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
    }).join(", ");
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
    // fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Recipe Types</h4>");
    let types = '';
    
    if (recipe.tags[0] === undefined) {
      types = `<p><b>Sorry the type was not defined yet :( Check back later!</b></p>`
    } else {
      // types = recipe.tags.map(type => {
      //   return `<b>${capitalize(type)}</b>`
      // }).join(", ");
      // let typeList = ''
      recipe.tags.forEach(type => {
        types += `<h4 class="type-pad">${type}</h4>`
      })
    }
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<div class="card-tag-list">${types}</div>`);
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
  showCorrectBanner(event) {
    let welcomeMsg = document.querySelector(".welcome-msg");
    let myRecipesBanner = document.querySelector(".my-recipes-banner");
    let myMealsToCookBanner = document.querySelector(".my-meals-to-cook-banner");
    welcomeMsg.style.display = "none";
    if (event.target.className.includes("together")) {
      myRecipesBanner.style.display = "block";
      myRecipesBanner.classList.add("hidden");
      myMealsToCookBanner.style.display = "none";
      myMealsToCookBanner.classList.remove("hidden");
    } else if (event.target.className.includes("connect")) {
      myMealsToCookBanner.style.display = "block";
      myMealsToCookBanner.classList.add("hidden");
      myRecipesBanner.style.display = "none";
      myRecipesBanner.classList.remove("hidden");
    }
  },

  showWelcomeBanner() {
    let welcomeMsg = document.querySelector(".welcome-msg");
    welcomeMsg.style.display = "flex";
    let myRecipesBanner = document.querySelector(".my-recipes-banner");
    myRecipesBanner.style.display = "none";
    myRecipesBanner.classList.remove("hidden");
    let myMealsToCookBanner = document.querySelector(".my-meals-to-cook-banner");
    myMealsToCookBanner.style.display = "none";
    myMealsToCookBanner.classList.remove("hidden");
  },
  // Ask Travis about updating css in scripts, should this be a dom thing?

  // SEARCH RECIPES
  // toggleMenu() {
  //   let menuDropdown = document.querySelector(".drop-menu");
  //   menuOpen = !menuOpen;
  //   if (menuOpen) {
  //     menuDropdown.style.display = "block";
  //   } else {
  //     menuDropdown.style.display = "none";
  //   }
  // },

  // FAVORITE RECIPE FUNCTIONALITY
  favoriteRecipe(user, event) {
    let cardId = parseInt(event.target.closest(".recipe-card").id);
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  },

  // RECIPES TO COOK FUNCTIONALITY
  addOrRemoveFromRecipesToCook(user, event) {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.recipesToCook.includes(cardId)) {
      event.target.src = "../images/full-pot.png";
      user.decideToCook(cardId);
    } else {
      event.target.src = "../images/pot-outline.png";
      user.decideNotToCook(cardId);
    }
  },

  // CREATE AND USE PANTRY
  displayPantryInfo(pantry) {
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
        <label for="${ingredient.name}">${capitalize(ingredient.name)}, ${ingredient.amount}</label></li>`;
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


export default domUpdates;
