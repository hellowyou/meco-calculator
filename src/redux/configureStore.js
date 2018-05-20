import { createStore, combineReducers } from 'redux';

const reducer = combineReducers({});

const configureStore = (initialState) => createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default configureStore;
