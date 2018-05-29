import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formulaDuck from '../redux/modules/formulas';
import './FormulaContainer.css';
import Parser from '../lib/parser';

const mapStateToProps = (state) => ({
	formulaItems: formulaDuck.selectors.items(state),
});

const mapDispatchToProps = (dispatch) => ({
	addFormulaItem: (formulaItem) => dispatch(formulaDuck.creators.addFormulaItem(formulaItem)),
	updateFormulaItem: (formulaItem) => dispatch(formulaDuck.creators.updateFormulaItem(formulaItem)),
	removeFormulaItem: (formulaItemId) => dispatch(formulaDuck.creators.removeFormulaItem(formulaItemId)),
});

export class FormulaContainer extends Component {
	_parser = null;

	constructor(props) {
		super(props);
		this.initParser();
	}

	initParser() {
		// console.log(new Parser, new OwnParser);
		this._parser = new Parser();
		console.log(this._parser);
		this._parser.on('callFunction', this._handleFuncDefs.bind(this));
	}

	_handleFuncDefs(name, params, done) {
		if(name.toLowerCase() === 'item') {
			let itemNumber = params[0];
			// console.log(this.props.formulaItems, itemNumber);
			this.props.formulaItems[itemNumber - 1] !== void 0
				? done(this.props.formulaItems[itemNumber - 1].value)
				: done(new Error('#VALUE!'));
		}
		// console.log({name, params, done});
	}

	_getErrorMessage(err) {
		return {
			'#ERROR!'	: 'Error',
			'#DIV/0!'	: 'Cannot divide by zero',
			'#NAME?'	: 'Undefined function or variable',
			'#N/A'		: 'Value is not avaiable to a formula',
			'#NUM!'		: 'Invalid Number',
			'#VALUE!'	: 'Invalid argument type',
		}[err] || null;
	}

	componentWillReceiveProps(props) {
		if(props.hasOwnProperty('formulaVars')) {
			for(let key in props.formulaVars) {
				this._parser.setVariable(key, props.formulaVars[key]);
			}
		}
	}

	addFormulaItem(e) {
		let formulaItem = {
			id: this.getNextId(),
			name: '',
			formula: '',
			value: 0,
			error: null,
			errorMsg: null,
		};

		this.props.addFormulaItem(formulaItem);
	}

	updateFormulaItem(formulaItem, e) {
		const { name, value } = e.target;

		if(formulaItem.hasOwnProperty(name)) {
			formulaItem[name] = name === 'formula' ? value.toUpperCase() : value;
			this.props.updateFormulaItem(formulaItem);
		}
	}

	findDependents(formulaItem) {
		let index = this.props.formulaItems.findIndex(item => item.id === formulaItem.id);
		console.log(`finding dependents for formula item with id of ${formulaItem.id}`);
		return this.props.formulaItems.filter((item) => {
			let indices = [], match, x = 0, re = /item\((\d+)\)/ig;

			console.log({itemFormula: item.formula, formulaItemPassedIndex: index, re, reLastIndex: re.lastIndex + 0});

			// Return if same as the formula item
			if(item.id === formulaItem.id) {
				console.log('Returning, same ID');
				return false;
			}
			// Find all the item() functions in the formula string
			while((match = re.exec(item.formula)) !== null) {
				if(x > 100) {
					console.log(`Broke when finding dependents for formula item with id of ${formulaItem.id}`);
					break;
				}

				console.log({match});
				indices.push( parseInt(match[1], 10) );
				x++;
			}

			return indices.indexOf(index + 1) !== -1;
		});
	}

	removeFormulaItem(formulaItem) {
		this.props.removeFormulaItem(formulaItem.id);
		// May still cause an infinite loop
		// TODO: Need to find a way to avoid self and cross referencing
		// this.findDependents(formulaItem).map(item => this.parseFormulaItem(item));
	}

	parseFormulaItem(formulaItem, count = 0) {
		let { error, result, errorMsg } = this._parser.parse(formulaItem.formula);

		if(count > 100) {
			console.error('Max call stack has been reached');
			return;
		}

		this.props.updateFormulaItem({
			...formulaItem,
			value: result,
			error,
			errorMsg
		});

		count++;

		// If there is no error message update the items
		// that has reference to the currently parsed formula item
		if(! errorMsg) {
			// May still cause an infinite loop
			// TODO: Need to find a way to avoid self and cross referencing
			this.findDependents(formulaItem).map(item => this.parseFormulaItem(item, count));
			// this.findDependents(formulaItem);
			// console.log({dependents: });
		}
	}

	// Generate ID like autoincrement in sql
	getNextId() {
	 return this.props.formulaItems
			? this.props.formulaItems.reduce((last, current) => current.id > last ? current.id : last, 0) + 1
			: 1;
	}

	renderItem(formulaItem) {
		let formulaClass = classNames({error: !!formulaItem.error });

		return (
			<li className="FormulaItem" key={ formulaItem.id }>
				{/* TODO: Make a component for formula item name */}
				<div className="FormulaItemName">
					<input type="text" name="name" onChange={this.updateFormulaItem.bind(this, formulaItem)} value={formulaItem.name} />
				</div>

				{/* TODO: Make a component for formula item formula */}
				<div className="FormulaItemFormula">
					<input
						type="text" name="formula"
						className={formulaClass}
						value={formulaItem.formula}
						onChange={this.updateFormulaItem.bind(this, formulaItem)}
						onBlur={this.parseFormulaItem.bind(this, formulaItem)} />
					{formulaItem.errorMsg && <span className="error-message">{formulaItem.errorMsg}</span>}
				</div>

				{/* TODO: Make a component for formula item action buttons */}
				<div className="FormulaItemButtons">
					<button className="RemoveFormulaItemBtn" onClick={this.removeFormulaItem.bind(this, formulaItem)}>X</button>
					{/* TODO: Make items movable*/}
				{/*<button className="MoveFormulaItemBtn" onClick={this.removeFormulaItem.bind(this, formulaItem)}>+</button>*/}
				</div>
			</li>
		);
	}

	render() {
		const grandTotal = this.props.formulaItems.reduce((total, item) => total + item.value, 0);
		return (
			<div className="FormulaContainer">
				<h1>Formula</h1>
				{this.props.formulaItems &&
						<ul className="FormulaItems">
							{this.props.formulaItems.map(this.renderItem.bind(this))}
							<li className="FormulaItemsFooter">
								<div className="col-1 GrandTotal">Grand Total:</div>
								<div className="col-2 GrandTotalAmount">{grandTotal}</div>
							</li>
						</ul>
				}
				<button className="AddFormulaItemBtn" onClick={this.addFormulaItem.bind(this)}>Add Formula Item</button>
			</div>
		);
	}
}

FormulaContainer.propTypes = {
	formulaItems: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			formula: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
			error: PropTypes.string,
			errorMsg: PropTypes.string,
		}).isRequired
	).isRequired,
	addFormulaItem: PropTypes.func.isRequired,
	updateFormulaItem: PropTypes.func.isRequired,
	removeFormulaItem: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormulaContainer);
