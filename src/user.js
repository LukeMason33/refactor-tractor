class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }
  saveRecipe(recipe, recipeSection) {
    this[recipeSection].push(recipe);
  }

  removeRecipe(recipe, recipeSection) {
    let i = this[recipeSection].indexOf(recipe);
    this[recipeSection].splice(i, 1);
  }

  generatePantryInfoById(dataSet) {
    this.pantry.forEach(ingredient => {
      dataSet.forEach(data => {
        if (ingredient.ingredient === data.id) {
          return ingredient.name = data.name;
        }
      })
    })
  }

  generateRecipeInfoByID(dataSet, recipeSection) {
    let recipeInfo = [];
    this[recipeSection].forEach(recipe => {
      dataSet.forEach(data => {
        if (recipe === data.id) {
          recipeInfo.push(data);
        }
      })
    })
    return recipeInfo;
  }
}
module.exports = User;
