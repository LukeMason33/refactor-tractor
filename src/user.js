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
// Look into refactoring these four to just be two functions!!!
  decideToCook(recipe) {
    this.recipesToCook.push(recipe);
  }

  decideNotToCook(recipe) {
    let i = this.recipesToCook.indexOf(recipe);
    this.recipesToCook.splice(i, 1);
  }

  filterRecipes(type) {
    return this.favoriteRecipes.filter(recipe => recipe.type.includes(type));
  }
  searchForRecipe(keyword) {
    return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
  }
}

module.exports = User;
