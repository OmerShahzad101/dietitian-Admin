// import { createStore, applyMiddleware, compose} from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from './redux/index';
import thunk from 'redux-thunk';

const initialState = {};
const middleware = [thunk];

// const store = createStore(
//     rootReducer,
//     initialState,
//     compose(
//         applyMiddleware(...middleware)
//         )   
// );
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;