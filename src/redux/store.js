import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { reducerAuth, reducerMessage } from "./reducer";
import { reducerUser } from './userReducer';
const rootReducer = combineReducers({
  plugins: reducerMessage,
  user: reducerUser,
  pluginsDos: reducerAuth,
});

const composeEnhancers = window._REDUX_DEVTOLS_EXTENSION_COMPOSE_ || compose;
let Store;

if (process.env.NODE_ENV === "development") {
  Store = () => createStore(rootReducer, composeEnhancers(applyMiddleware()));
} else {
  Store = () => createStore(rootReducer);
}

export default Store();
