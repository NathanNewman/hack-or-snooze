"use strict"; // Page 3

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  // Found in file main.js
  hidePageComponents();
  // Found in file stories.js
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

// Found in the click event below.
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  // Found in file main.js
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

// On submission of the login form, runs function navLoginClick(evt)
$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

// Used in file user.js in function updateUIOnUserLogin()
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows the submit form for stories when submit is clicked.
function navSubmitStory() {
  // Found in file main.js
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
// click event to trigger navSubmitStory(), the above function.
$navSubmitStory.on("click", navSubmitStory);

// Shows the favorites list when favorites is clicked.
function navFavoritesList() {
  // Found in file main.js
  hidePageComponents();
  // Found in models.js
  currentUser.getFavorites();
}

// click event to trigger navFavoritesList(), the above function
$navFavorites.on("click", navFavoritesList);
