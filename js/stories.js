"use strict"; // Page 5

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

// Used in file main.js in function start().
async function getAndShowStoriesOnStart() {
  // StoryList.getStories is found in file models.js
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  // function is found further down this page
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// Used further down this page under function putStoriesOnPage(). It is in the for loop.
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // getHostName() is found in file models.js
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">&star;</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

// Used further up the page under getAndShowStoriesOnStart().
// Also used in file nav.js in function navAllStories(evt).
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    // Found further up this page
    const $story = generateStoryMarkup(story);
    // $allStoriesList is a variable in main.js which is used as a selector for
    // <ol id="all-stories-list" class="stories-list"> in index.html
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Handles click event for story submission. Is triggered on click event found below.
async function addSubmittedStory(evt) {
  evt.preventDefault();

  const user = currentUser.username;
  const title = $("#create-title").val();
  const author = $("#create-author").val();
  const url = $("#create-url").val();

  // StoryList.addStory is found in models.js
  const story = await StoryList.addStory(user, {
    title,
    author,
    url,
  });

  // Function generateStoryMarkup is found further up this page.
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

// Click event for story submission. Function addSubmittedStory is found above.
$submitForm.on("submit", addSubmittedStory);

function favorite(evt) {
  if (evt.target.tagName === "SPAN") {
    console.log("clicked");
    evt.target.textContent = "&starf;";
  }
}

$allStoriesList.on("click", favorite);
