const ingredientsAPIData = fetch("http://localhost:3001/api/v1/ingredients")
                            .then(response => response.json())
                            .then(data => console.log(data));

const usersAPIData = fetch("http://localhost:3001/api/v1/users")
                      .then(response => response.json())
                      .then(data => console.log(data));

const recipesAPIData = fetch("http://localhost:3001/api/v1/recipes")
                        .then(response => response.json())
                        .then(data => console.log(data));

module.exports = {
  ingredientsAPIData,
  usersAPIData,
  recipesAPIData
}
