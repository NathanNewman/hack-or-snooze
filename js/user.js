"use strict"; // Page 4

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

// triggered by click event found further down this page, immediately after this function.
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  // function is found further down this page.
  saveUserCredentialsInLocalStorage();
  // function is found in file nav.js.
  updateUIOnUserLogin();
}

// when log-in forum is submitted, start async login function(evt), which is found above on this page.
$loginForm.on("submit", login);

/** Handle signup form submission. */

// trigger by click event found further down this page, immediately after this function.
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  // function is found further down this page.
  saveUserCredentialsInLocalStorage();
  // function is found further down this page.
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

// On submission of the sign-up form, triggers async function signup(evt), which is the above function.
$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

// trigger by click event found further down this page, immediately after this function.
function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

// On click of log-out button, triggers function logout(evt), which is the above function.
$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

// Used in main.js in async function start()
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  // Found in models.js under Class User
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

// Used further up on this page.
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

// Used further up on this page. Also used in main.js in async function start()
function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  putStoriesOnPage();

  $allStoriesList.show();
  $navSubmitStory.show();
  $navFavorites.show();
  $navStories.show();

  // Found in nav.js
  updateNavOnLogin();
}
