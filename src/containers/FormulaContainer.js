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
		this._parser = new Parser();
		this._parser.on('callItems', this._handleCallItems.bind(this));
	}

	_handleCallItems(done) {
		done(this.props.formulaItems);
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

		return this.props.formulaItems.filter((item) => {
			let indices = [], match, x = 0, re = /item\((\d+)\)/ig;

			// Return if same as the formula item
			if(item.id === formulaItem.id) {
				return false;
			}
			// Find all the item() functions in the formula string
			while((match = re.exec(item.formula)) !== null) {
				if(x > 100) {
					break;
				}

				indices.push( parseInt(match[1], 10) );
				x++;
			}

			return indices.indexOf(index) !== -1;
		});
	}

	removeFormulaItem(formulaItem) {
		this.props.removeFormulaItem(formulaItem.id);
		// May still cause an infinite loop
		// TODO: Need to find a way to avoid self and cross referencing
		// this.findDependents(formulaItem).map(item => this.parseFormulaItem(item));
	}

	parseFormulaItem(formulaItem) {
		let { error, result, errorMsg } = this._parser.parse(formulaItem.formula);

		this.props.updateFormulaItem({
			...formulaItem,
			value: result,
			error,
			errorMsg,
		});

		// If there is no error message update the items
		// that has reference to the currently parsed formula item
		if(! errorMsg) {
			// May still cause an infinite loop
			// TODO: Need to find a way to avoid self and cross referencing
			// this.findDependents(formulaItem).map(item => this.parseFormulaItem(item, count));
			console.log( this.findDependents(formulaItem) );
			// console.log({dependents: });
		}
	}

	// Generate ID like autoincrement in sql
	getNextId() {
	 return this.props.formulaItems
			? this.props.formulaItems.reduce(
					(last, current) => current.id > last ? current.id : last, 0
				) + 1
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
