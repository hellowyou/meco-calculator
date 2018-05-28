import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConnectedFormulaContainer, { FormulaContainer } from './FormulaContainer';

Enzyme.configure({ adapter: new Adapter() });

describe('*** DUMB FormulaContainer component', () => {
	it('should render the DUMB component', () => {
		let wrapper = shallow(<FormulaContainer />);
		
		expect(wrapper.length).toEqual(1);
	});

	it('should render formula item', () => {
		let items = [{ id: 1, name: 'General', formula: '1 + 1', value: '2', error: null }];

		let wrapper = render(<FormulaContainer formulaItems={items} />);

		expect(wrapper.find('li.FormulaItem').length).toEqual(1);
	});

	it('should render many formula items', () => {
		let items = [
			{ id: 1, name: 'General', formula: '1 + 1', value: '2', error: null },
			{ id: 2, name: 'General', formula: '1 + 2', value: '3', error: null },
		];

		let wrapper = render(<FormulaContainer formulaItems={items} />);

		expect(wrapper.find('li.FormulaItem').length).toEqual(2);
	});

	it('should render Add Formula button', () => {
		let wrapper = render(<FormulaContainer />);
		expect(wrapper.find('button.AddFormulaBtn').length).toEqual(1);
	});
});

describe('*** SMART FormulaContainer component', () => {
	it('should render the SMART component');
	it('should render ')
});