import Duck from 'extensible-duck';

export default new Duck({
    namespace: 'meco-calculator', store: 'formulaItems',
    types: ['ADD', 'UPDATE', 'REMOVE'],
    initialState: {
        items: [],
    },
    reducer: (state, action, duck) => {
        switch(action.type) {
            default: return state;
        }
    },
    selectors: {
        // Use with reselect
        // shopItems:  state => state.shop.items,
        // subtotal: new Duck.Selector(selectors =>
        //     createSelector(
        //         selectors.shopItems,
        //         items => items.reduce((acc, item) => acc + item.value, 0)
        //     )
        // )
    },
    creators: (duck) => ({
        addFormulaItem: formulaItem => ({type: duck.types.ADD, formulaItem}),
        // Using thunk
        // updateWidget: widget => dispatch => {
        //     dispatch({ type: 'UPDATE', widget })
        // }
    })
});