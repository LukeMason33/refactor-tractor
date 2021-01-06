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

};

export default fetchedData;
