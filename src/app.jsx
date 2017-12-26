import xs from "xstream";
import debounce from "xstream/extra/debounce";
import dropRepeats from "xstream/extra/dropRepeats";

import {
  renderEmojiList,
  renderEmptyList,
  renderFavorites,
  renderNoResults
} from "./EmojiList.jsx";

function changeList(domSource) {
  const changeSearchInput$ = domSource.select("#searchInput").events("input");

  const imageList$ = domSource
    .select("#imageList")
    .element()
    .take(1);

  const changeList$ = xs
    .combine(imageList$, changeSearchInput$)
    .map(([imageList, _]) => imageList);

  return changeList$;
}

function intent(domSource) {
  const changeSearchText$ = domSource
    .select("#searchInput")
    .events("input")
    .compose(debounce(300))
    .map(ev => ev.target.value);

  const clickViewFavorites$ = domSource.select("#show-fav").events("click");

  // Stream of clicks or taps on any emoji
  const toggleFavEmoji$ = domSource
    .select(".emoji")
    .events("click")
    // Getting emoji name from its 'alt' attribute
    .map(e => e.target.alt);

  return {
    changeSearchText$,
    toggleFavEmoji$,
    clickViewFavorites$
  };
}

function favEmojiReducer({ toggleFavEmoji$ }, localStorage) {
  const storedEmojiReducer$ = localStorage
    .getItem("favEmojis")
    .take(1)
    .map(storedEmojis => (storedEmojis ? JSON.parse(storedEmojis) : []))
    .map(
      storedEmojis =>
        function(favEmojis) {
          return storedEmojis;
        }
    );

  // Array of favorite emojis constructed by folding the emoji clicks
  const clickEmojiReducer$ = toggleFavEmoji$.map(
    selectedEmoji =>
      function(favEmojis) {
        return favEmojis.includes(selectedEmoji)
          ? favEmojis.filter(emoji => emoji !== selectedEmoji)
          : [...favEmojis, selectedEmoji];
      }
  );

  return xs
    .merge(storedEmojiReducer$, clickEmojiReducer$)
    .fold((favEmojis, reducer) => reducer(favEmojis), []);
}

function model(actions, localStorage) {
  const { changeSearchText$, toggleFavEmoji$, clickViewFavorites$ } = actions;
  const clearSearchText$ = clickViewFavorites$.mapTo("");

  const searchText$ = xs
    .merge(changeSearchText$, clearSearchText$)
    .startWith("");

  const favEmojis$ = favEmojiReducer(actions, localStorage);

  const state$ = xs
    .combine(searchText$, favEmojis$)
    .map(([searchText, favEmojis]) => ({
      searchText,
      favEmojis
    }));

  return state$;
}

function view(state$) {
  return state$.map(({ searchText, favEmojis }) => {
    return (
      <div id="container">
        <h2 className="header"> Github Emoji Search</h2>
        <div id="show-fav">
          Show favorites <i className="far fa-star"> </i>
        </div>
        <p id="btn-container">
          <input type="text" id="searchInput" value={searchText} autofocus />
        </p>
        <div id="imageList">
          {searchText
            ? renderEmojiList(searchText, favEmojis)
            : renderFavorites(favEmojis)}
        </div>
      </div>
    );
  });
}

export function App({ DOM, storage }) {
  const actions = intent(DOM);
  const state$ = model(actions, storage.local);
  const vdom$ = view(state$);

  const changeList$ = changeList(DOM);
  const favEmojis$ = favEmojiReducer(actions, storage.local);
  const storageRequest$ = favEmojis$.map(favEmojis => {
    return {
      key: "favEmojis",
      value: JSON.stringify(favEmojis)
    };
  });

  return {
    DOM: vdom$,
    listTransition: changeList$,
    logFav: favEmojis$,
    logStorageRequest: storageRequest$,
    storage: storageRequest$
  };
}
