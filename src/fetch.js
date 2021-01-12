let fetchedData = {
  ingredientsAPIData: () => {return fetch("http://localhost:3001/api/v1/ingredients")
                        .then(response => response.json());
                      },

  usersAPIData: () => {return fetch("http://localhost:3001/api/v1/users")
                  .then(response => response.json());
                },

  recipesAPIData: () => {return fetch("http://localhost:3001/api/v1/recipes")
                    .then(response => response.json());
                  },

  modifyUsersPantry: (userID, ingredientID, ingredientAmount) => {return fetch("http://localhost:3001/api/v1/users", {
                              method: 'POST',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({'userID': userID, 'ingredientID': ingredientID, 'ingredientModification': ingredientAmount})
                            })
                            .then(response => response.json());

                  }
};

export default fetchedData;
