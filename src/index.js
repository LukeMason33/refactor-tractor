// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';
import './scripts.js'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/apple-logo.png';

console.log('This is the JavaScript entry file - your code begins here.');

//API methods

import ingredientsAPIData from './fecth.js';

console.log(ingredientsAPIData);
