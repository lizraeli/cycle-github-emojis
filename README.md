# Cycle Github Emojis

A github emoji viewer made with [Cycle.js](https://cycle.js.org/).

## Features

* The user may search for an emoji by name by using the search bar. The emoji list is filtered in real-time as the user types. There is a transition animation as the user types.
* The user may add and remove an emoji from their favorites by clicking or tapping on it. A star will appear above every emoji that is in the favorites. The favorites are stored in the browsers `localstorage`, which is updated on every modification of the favorites.
* The user will see a list of their favorite emojis when the search bar is empty, or when they click on `"show favorites"` (which will empty the search bar).
* The site is responsive and will appear in full-screen mode if added to (and opened from) the home-screen of an ios or android device.

## Tech

* [Cycle.js](https://cycle.js.org/)
* [xstream](http://staltz.github.io/xstream/)
* [create-cycle-app](https://github.com/cyclejs-community/create-cycle-app)
  * JSX [using snabbdom pragma](https://github.com/Swizz/snabbdom-pragma)
* [Cycle Storage Driver](https://github.com/cyclejs/storage)
