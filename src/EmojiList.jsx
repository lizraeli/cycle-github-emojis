import emojis from "./emojis.json";

const emojiKeys = Object.keys(emojis);

const renderEmojiList = (searchText, favEmojis) => {
  const text = searchText.toLowerCase();
  const emojiList = emojiKeys
    .filter(
      key => (text.length < 3 ? key.startsWith(text) : key.includes(text))
    )
    .map(key => {
      const imgClassNames = favEmojis.includes(key) ? "fav emoji" : "emoji";
      const itemClassNames = favEmojis.includes(key) ? "item favitem" : "item";

      return (
        <div className={itemClassNames}>
          <p>
            <strong>{key}</strong>
          </p>
          <p>
            <img className={imgClassNames} alt={key} src={emojis[key]} />
          </p>
        </div>
      );
    });

  const firstItem = (
    <div className="item">
      <p>
        <strong> Tap or click to add to favorites </strong>
      </p>
    </div>
  );

  return emojiList.length === 0 ? renderNoResults() : [firstItem, ...emojiList];
};

const renderNoResults = () => (
  <div className="item">
    <p> No Search Results </p>
    <p>
      <img alt="crying_cat_face" src={emojis["crying_cat_face"]} />
    </p>
  </div>
);

const renderFavorites = favEmojis => {
  const emojiList = favEmojis.map(key => (
    <div className="item favitem">
      <p>
        <strong>{key}</strong>
      </p>
      <p>
        <img className="fav emoji" alt={key} src={emojis[key]} />
      </p>
    </div>
  ));

  const firstItem = (
    <div className="item">
      <p>
        <strong>Tap or click to remove from favorites</strong>
      </p>
    </div>
  );
  return emojiList.length === 0 ? renderEmptyList() : [firstItem, ...emojiList];
};

const renderEmptyList = () => (
  <div className="item">
    <p> Start Typing Above </p>
    <p>
      <img alt="keyboard" src={emojis["keyboard"]} />
    </p>
  </div>
);

export { renderEmojiList, renderEmptyList, renderFavorites, renderNoResults };
