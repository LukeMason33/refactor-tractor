class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
  }

  calculateIngredientsCost(dataSet) {
    let totalPrice = 0;
    this.ingredients.forEach(ingredient => {
      dataSet.forEach(data => {
        if (ingredient.id === data.id) {
          totalPrice += data.estimatedCostInCents * ingredient.quantity.amount;
        }
      })
    })
    return Number((totalPrice / 100).toFixed(2));
  }


  generateIngredientsNameById(dataSet) {
    this.ingredients.forEach(ingredient => {
      dataSet.forEach(data => {
        if (ingredient.id === data.id) {
          return ingredient.name = data.name;
        }
      })
    })
  }
}

module.exports = Recipe;
