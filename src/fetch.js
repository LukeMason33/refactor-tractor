let fetchedData = {
  ingredientsAPIData: () => {
    return fetch("http://localhost:3001/api/v1/ingredients")
      .then(response => response.json())
      .catch(err => {
        alert("Sorry! We are having trouble getting the data, try again later!")
      })
  },

  usersAPIData: () => {
    return fetch("http://localhost:3001/api/v1/users")
      .then(response => response.json())
      .catch(err => {
        alert("Sorry! We are having trouble getting the data, try again later!")
      })
  },

  recipesAPIData: () => {
    return fetch("http://localhost:3001/api/v1/recipes")
      .then(response => response.json())
      .catch(err => {
        alert("Sorry! We are having trouble getting the data, try again later!")
      })
  },

  modifyUsersPantry: (userID, ingredientID, ingredientAmount) => {
    return fetch("http://localhost:3001/api/v1/users", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userID, ingredientID, 'ingredientModification': (ingredientAmount * -1)})
    })
      .then(response => response.json())
      .catch(err => {
        alert("Sorry! We are having trouble getting the data, try again later!")
      })
  }
};

export default fetchedData;
