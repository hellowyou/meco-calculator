import Duck from 'extensible-duck';

export default new Duck({
    namespace: 'meco-calculator', store: 'formulaItems',
    types: ['ADD', 'UPDATE', 'REMOVE'],
    initialState: {
        items: [],
    },
    reducer: (state, action, duck) => {
        const { actionResolvers } = duck.options;

        switch(action.type) {
            case duck.types.ADD:
                return actionResolvers.addFormulaItem(state, action.payload, duck);
            case duck.types.UPDATE:
                return actionResolvers.updateFormulaItem(state, action.payload, duck);
            case duck.types.REMOVE:
                return actionResolvers.removeFormulaItem(state, action.payload, duck);
            default: return state;
        }
    },
    actionResolvers: {
        addFormulaItem: (state, formulaItem, duck) =>
            ({...state, items: [...state.items, formulaItem ]}),
        updateFormulaItem: (state, formulaItem, duck) => ({
            ...state,
            items: state.items.map((item) => {
                if(formulaItem.id !== item.id) {
                    return item;
                };
    
                return {
                    ...item,
                    ...formulaItem,
                    id: item.id,
                }
            })
        }),
        removeFormulaItem: (state, formulaItemId, duck) => 
            ({...state, items: state.items.filter(item => item.id !== formulaItemId)}),
    },
    selectors: (duck) => ({
        items: state => state[duck.store].items
        // Use with reselect
        // shopItems:  state => state.shop.items,
        // subtotal: new Duck.Selector(selectors =>
        //     createSelector(
        //         selectors.shopItems,
        //         items => items.reduce((acc, item) => acc + item.value, 0)
        //     )
        // )
    }),
    creators: (duck) => ({
        addFormulaItem: formulaItem => ({type: duck.types.ADD, payload: formulaItem}),
        updateFormulaItem: formulaItem => ({type: duck.types.UPDATE, payload: formulaItem}),
        removeFormulaItem: formulaItemId => ({type: duck.types.REMOVE, payload: formulaItemId}),
        // Using thunk
        // updateWidget: widget => dispatch => {
        //     dispatch({ type: 'UPDATE', widget })
        // }
    })
});