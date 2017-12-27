import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import { App } from "./app";
import xs from "xstream";
import storageDriver from "@cycle/storage";
import "./style.css";

const main = App;

// logger for debugging purposes
function logger(stream$, name) {
  stream$.addListener({
    next: value => {
      console.log(name, value);
    }
  });
}

const drivers = {
  DOM: makeDOMDriver("#root"),
  listTransition: changeList$ => {
    changeList$.addListener({
      next: imageList => {
        imageList.classList.add("pre-animation");
        setTimeout(() => {
          imageList.classList.remove("pre-animation");
        }, 300);
      }
    });
  },
  storage: storageDriver,
  logStorageRequest: stream => logger(stream, "storage request: "),
  logFav: stream => logger(stream, "favorites: ")
};

run(main, drivers);
