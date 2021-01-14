# Refactor Tractor - freshPicks
In this project, we were provided a semi-functional codebase for a website of recipes that a user can browse to find meals to cook. The challenge of the project was refactoring the code to be more functional, more accessible, and to implement the use of Sass, network requests, and WebPack.

## Usage
The freshPicks website allows users access to a database of recipes. On the main page, a user can browse all recipes, filter recipes by type, and view what their pantry holds. A user can also favorite a recipe by clicking the apple icon on the card, or save it to their weekly menu by clicking the pot. The search bar can be used to search through all of the recipe titles and ingredients on the main page. To view the recipe's ingredients, instructions, and total cost of ingredients, the user can click the card to expand it. A comparison to the user's pantry is displayed on the expanded card that will tell you how much of each ingredient you are missing if any. 
  
![gif of mainpage]()

If a user wants to view only their favorite recipes, they can navigate to their saved recipes. From here a user can search the recipes, sort by type, or unfavorite. To return to the mainpage of all recipes, the user can click the 'Show All Recipes' button.

![gif of favorites]()

If a user wants to view the meals they've saved to their weekly menu, they can navigate to the menu page. Here the recipe cards, when opened, will tell the user if they have the necessary ingredients in their pantry to complete the recipe. If they are missing anything it will tell them how much they are missing. You will also see a button to declare that you made that meal. By clicking this will remove the ingredients used from the user's pantry and once the card is exited that recipe will be removed from the weekly menu screen. 

![gif of menu for week]()


## How to Install
1. `fork` this repository
2. `git clone` it down to your command line
3. Navigate into the repository on your machine
4. Run `npm install`
5. Run `npm start` to launch local server

To access data api: 
1. `git clone` [this]() (add link) repo to your command line
2. Navigate into the repository on your machine
3. Run `npm install` 
4. Run `npm start` to launch API server (*both servers need to be running to access the site)

OR

Visit live site [here]() (we will build this live right?)

## Technologies Used
1. JavaScript (vanilla)
2. HTML
3. Sass/SCSS
3. WebPack
4. Chai & Mocha

## Planning
We utilized github projects for project management, that board can be found [here](https://github.com/LukeMason33/refactor-tractor/projects/1) <br>
The detailed spec for this project can be found [here](https://frontend.turing.io/projects/module-2/refactor-tractor-wc.html) <br>
The original project spec for the codebase we were provided can be found [here](https://frontend.turing.io/projects/whats-cookin.html).

### Testing development
We expanded upon the testing built into the original code base to check functionality. We adjusted the original tests to utilize new data formatting to match the data from the server. 

### Challenges
* This was our first experience receiving a large codebase we were unfamiliar with and needing to work on it. It was certainly a challenge to familiarize ourselves with what the code was doing and it was quite an undertaking to reorganize existing code to improve organization and functionality. Initially we struggled to find a good place to jump in and start refactoring, but eventually decided we should start by determining what within the codebase was already functioning well in terms of JavaScript functionality and User Experience/Interaction. After that, we were better able to plan out how to most efficiently move forward and use our time by dividing and conquering small tasks and communicating openly and frequently about new issues we found, or changes we would like to implement. We ended up having to separate our desired changes into `required` to dos and `desired` to dos (things that would be nice to implement but not our minimum viable product).
* We ran into some resistance when trying to access all info from our network requests simultaneously. After some research we found `Promise.all()` which solved our issues, as it returns all the input network requests together. 
* Utilizing Sass/SCSS for the first time was interesting. It took some additional research on syntax and functionality of mixins vs built in color functions. The biggest challenge here was taking messy provided CSS and converting it into SCSS while refactoring and adjusting styling to improve UX.
* Understanding WebPack - It was our first experience with WebPack so we had to do some research and fiddling to get it to work as we expected/wanted it to. 

### Wins
* Developing a strong understanding of a foreign codebase and being able to refactor significantly. While this was also one of our major challenges during the project, we were all very proud of our ability to quickly familiarize ourselves with the functionality and therefore refactor effectively. 
* Teamwork and dividing up work successfully without any major merge conflicts. We chose to implement a divide and conquer workflow, and because of our clear and frequent communication, we were extremely successful in getting tasks done more quickly. We also took the time to walk through all the changes together to be sure we fully understood all the changes. 

## Future Iterations
* Adding Recipes: A user would be able to submit a recipe to the site, and after admin review, it could be approved and added to the recipe database. 
* Admin view: Developing an Admin view for the site that could show some User trends and any submitted recipes waiting for review. 
* Rating Recipes: After a user has made a recipe they should be prompted to rate the recipe on a few different qualities (maybe difficulty level and approval). These ratings could then be visible to other users.
* Providing the cost of the missing ingredients in order to make a recipe.
* The button to remove items from pantry to only work if conditions are met where the user has enough of each ingredient to make the recipe. 

## Project Members
This project was designed and implemented by [Luke Mason](https://github.com/LukeMason33), [Lucas Merchant](https://github.com/lbmerchant93), and [Kristen Bair](https://github.com/kristenmb)
