let main = document.querySelector("main");

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

  //




};

export default domUpdates;
