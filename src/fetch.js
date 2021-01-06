let fetchedData = {
  ingredientsAPIData: () => {return fetch("http://localhost:3001/api/v1/ingredients")
                            .then(response => response.json())
                            .then(data => data)
    },

  usersAPIData: () => {return fetch("http://localhost:3001/api/v1/users")
                      .then(response => response.json())
                      .then(data => data)
    },

  recipesAPIData: () => {return fetch("http://localhost:3001/api/v1/recipes")
                        .then(response => response.json())
                        .then(data => data)
    }
};

export default fetchedData;
