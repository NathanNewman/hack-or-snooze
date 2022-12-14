"use strict"; // Page 1

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */
  // used in file stories.js for const hostName in function generateStoryMarkup().
  getHostName() {
    return new URL(this.url).host;
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  // Used in file stories.js. It is in the function getAndShowStoriesOnStart().
  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map((story) => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  // Used in file stories.js in sync function addSubmittedStory.
  static async addStory(user, { title, author, url }) {
    const token = currentUser.loginToken;
    console.log(currentUser.loginToken);
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { token, story: { title, author, url } },
    });

    const story = new Story(response.data.story);

    if (this.ownStories) {
      this.ownStories.unshift(story);
    } else {
      this.ownStories = [story];
    }
    // this.stories.unshift(story);
    // user.ownStories.unshift(story);
    console.log(this.stories);
    console.log(this.ownStories);
    return story;
  }
  
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  // Used in users.js
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
  // adds a story to favorites.
  async addFavorite(storyId) {
    let story = storyList.stories.find((el) => el.storyId === storyId);
    this.favorites.push(story);
    await this.addOrRemoveFavorite("add", storyId);
  }
  // removes a story from favorites
  async removeFavorite(storyId) {
    this.favorites = this.favorites.filter((s) => s.storyId !== storyId);
    await this.addOrRemoveFavorite("remove", storyId);
  }
  // Used above in async addFavorite(storyId) and async removeFavorite(storyId)
  async addOrRemoveFavorite(newState, storyId) {
    const method = newState === "add" ? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
      method: method,
      data: { token },
    });
  }
  // Used in nav.js
  getFavorites() {
    $favoritedStories.empty();
    // console.log(this.favorites);
    for (const story of this.favorites) {
      // Found in stories.js
      const $favorites = generateFavoritesMarkup(story);
      $favoritedStories.append($favorites);
    }
    return $favoritedStories.show();
  }
  getOwnStories() {
    $ownStories.empty();
    console.log(this.ownStories);

    for (const story of this.ownStories) {
      // Found in stories.js
      const $ownStory = generateOwnStoriesMarkup(story);
      $ownStories.append($ownStory);
    }
    return $ownStories.show();
  }
    
}
