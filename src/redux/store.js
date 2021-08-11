import { createStore, compose } from "redux";
import rootReducer from "./reducer/rootReducer";

let store = null;

if (window.devToolsExtension){
  store = compose(
  window.devToolsExtension(),
)(createStore)(rootReducer);
}else{
  store = compose()(createStore)(rootReducer);
}



export default store;