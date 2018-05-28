import formulaModule from './formulas';

describe('Formula Module', () => {
	

	function setup() {
		const formulaItems = [
			{ id: 1, name: 'General', formula: '1 + 1', value: 2, error: null, errorMsg: null },
			{ id: 2, name: 'Geniricic', formula: '1 + 2', value: 3, error: null, , errorMsg: null },
			{ id: 3, name: 'Another Name', formula: '2 + 2', value: 4, error: null, , errorMsg: null },
		];

		const initialState = formulaModule.initialState;
		const duck = formulaModule;
		const alterData = (id) => {
			const formula = formulaItems.find((item) => item.id === id);
			return {
				...formula,
				name: `${formula.name} another`,
				formula: `${formula.formula} + 1`,
				value: formula.value + 1
			};
		};

		return {
			formulaItems,
			initialState,
			duck,
			alterData
		};
	}

	it('should return initial state', () => {
		const { initialState, formulaItems } = setup();

		const given = { type: '', payload: formulaItems.shift() };

		expect(formulaModule.reducer(undefined, given, formulaModule)).toEqual(initialState);
	});

	it('should return the appropriate ADD action type and payload object', () => {
		const { duck, formulaItems } = setup(); 
		const expected = { type: duck.types.ADD, payload: formulaItems[0] };

		const given = formulaItems[0];

		expect(formulaModule.creators.addFormulaItem(given)).toEqual(expected);
	});

	it('should return the appropriate UPDATE action type and payload object', () => {
		const { duck, formulaItems } = setup(); 
		const expected = { type: duck.types.UPDATE, payload: formulaItems[0] };
		const given = formulaItems[0];

		expect(formulaModule.creators.updateFormulaItem(given)).toEqual(expected);
	});

	it('should return the appropriate REMOVE action type and payload object', () => {
		const { duck, formulaItems } = setup(); 
		const expected = { type: duck.types.REMOVE, payload: formulaItems[0].id };
		const given = formulaItems[0].id;

		expect(formulaModule.creators.removeFormulaItem(given)).toEqual(expected);
	});

	it('reducer should add a formula item', () => {
		const { initialState, duck, formulaItems } = setup();
		const expected = { items: [ formulaItems[0] ] };
		const given = {
			initialState,
			action: duck.creators.addFormulaItem(formulaItems[0]),
			duck
		};

		expect(formulaModule.reducer(given.initialState, given.action, given.duck)).toEqual(expected);
	});

	it('reducer should update a formula Item', () => {
		const { duck, formulaItems, alterData, initialState } = setup();
		const formula = formulaItems[0];
		const alteredFormula = alterData(formula.id);
		const expected = {...initialState, items: [ alteredFormula ].concat(formulaItems.slice(1)) };
		const iState = {
			items: formulaItems
		};

		const action = duck.creators.updateFormulaItem(alteredFormula);

		expect(formulaModule.reducer(iState, action, duck)).toEqual(expected);
	});

	it('reducer should remove a formula Item', () => {
		const { initialState, duck, formulaItems, alterData } = setup();
		const formula = formulaItems[1];
		const alteredFormula = alterData(formula.id);
		const expected = {...initialState, items: formulaItems.slice(0, 1).concat(formulaItems.slice(2))};
		const iState = {
			items: formulaItems
		};

		const action = duck.creators.removeFormulaItem(formula.id);

		expect(formulaModule.reducer(iState, action, duck)).toEqual(expected);
	});
});