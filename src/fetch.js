let fetchedData = {
  ingredientsAPIData: fetch("http://localhost:3001/api/v1/ingredients")
                        .then(response => response.json())
                        .then(data => data),

  usersAPIData: () => {return fetch("http://localhost:3001/api/v1/users")
                  .then(response => response.json())
                },

  recipesAPIData: fetch("http://localhost:3001/api/v1/recipes")
                    .then(response => response.json())
                    .then(data => data)

};

export default fetchedData;
