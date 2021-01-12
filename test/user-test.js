import { expect } from 'chai';

import User from '../src/user';
import Recipe from '../src/recipe';
import usersData from '../src/data/users-test-data';
import recipeData from '../src/data/recipe-test-data';
import ingredientsData from '../src/data/ingredient-test-data';

describe('User', function() {
  let user;
  let recipe;

  beforeEach(function() {
    user = new User(usersData);
    recipe = new Recipe(recipeData[0]);
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user.favoriteRecipes).to.deep.eq([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user.recipesToCook).to.deep.eq([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe, 'favoriteRecipes');
    expect(user.favoriteRecipes[0]).to.deep.eq(recipe);
  });

  it('should be able to decide to cook a recipe', function() {
    user.saveRecipe(recipe, 'recipesToCook');
    expect(user.recipesToCook[0]).to.deep.eq(recipe);
  });

  it('should be able remove recipes from favoriteRecipes after they are addede in', function() {
    user.saveRecipe(recipe, 'favoriteRecipes');
    user.removeRecipe(recipe, 'favoriteRecipes');
    expect(user.favoriteRecipes).to.deep.eq([]);
  });

  it('should be able remove recipes from recipesToCook after they are addede in', function() {
    user.saveRecipe(recipe, 'recipesToCook');
    user.removeRecipe(recipe, 'recipesToCook');
    expect(user.recipesToCook).to.deep.eq([]);
  });

  it('should be able to add the ingredients names to the ingredients in the pantry', function() {
    user.generatePantryInfoById(ingredientsData);
    expect(user.pantry[0]).to.deep.eq({ingredient: 11477, amount: 4, name: 'zucchini squash'});
  });

  it("should be able to return all of the user's favoriteRecipes' info rather than just the recipe's id in the users", function() {
    user.favoriteRecipes.push(recipe.id);
    expect(user.generateRecipeInfoById(recipeData, 'favoriteRecipes')[0]).to.deep.eq(recipe);
  });

  it("should be able to return all of the user's recipesToCooks' info rather than just the recipe's id in the users", function() {
    user.recipesToCook.push(recipe.id);
    expect(user.generateRecipeInfoById(recipeData, 'recipesToCook')[0]).to.deep.eq(recipe);
  });
});
