class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }
  saveRecipe(recipe) {
    this.favoriteRecipes.push(recipe);
  }

  removeRecipe(recipe) {
    let i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1);
  }

  decideToCook(recipe) {
    this.recipesToCook.push(recipe);
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


  generateRecipeInfoByID(dataSet) {
    let recipeInfo = [];
    this.favoriteRecipes.forEach(recipe => {
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
