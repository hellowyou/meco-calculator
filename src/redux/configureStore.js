import { createStore, combineReducers } from 'redux';
import formulaDuck from './modules/formulas';

const reducer = combineReducers({
	[formulaDuck.store]: formulaDuck.reducer,
});

const configureStore = (initialState) => createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default configureStore;
