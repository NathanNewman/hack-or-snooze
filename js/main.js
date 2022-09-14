"use strict"; // Page 2

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $submitForm = $("#submit-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmitStory = $("#add-story");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

// Used in nav.js in function navAllStories(evt) and function navLoginClick(evt).
function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm];
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

// First function. It is activated at the bottom of this page. $(start);
async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  // Found in users.js
  await checkForRememberedUser();
  // getAndShowStoriesOnStart() is found in file stories.js.
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  // Found in file users.js.
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);
// tells async function start() to run.
$(start);
