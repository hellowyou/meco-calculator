import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import formulaDuck from '../redux/modules/formulas';

const mapStateToProps = (state) => ({
	formulaItems: formulaDuck.selectors.items(state),
});

const mapDispatchToProps = (dispatch) => ({
	addFormulaItem: (formulaItem) => dispatch(formulaDuck.creators.addFormulaItem(formulaItem)),
	updateFormulaItem: (formulaItem) => dispatch(formulaDuck.creators.updateFormulaItem(formulaItem)),
	removeFormulaItem: (formulaItemId) => dispatch(formulaDuck.creators.removeFormulaItem(formulaItemId)),
});

export class FormulaContainer extends Component {

	addFormulaItem(e) {
		let formulaItem = {
			id: this.getNextId(),
			name: '',
			formula: '',
			value: 0,
			error: null,
		};

		this.props.addFormulaItem(formulaItem);
	}

	updateFormulaItem(formulaItem, e) {
		const { name, value } = e.target;

		if(formulaItem.hasOwnProperty(name)) {
			formulaItem[name] = value;
			this.props.updateFormulaItem(formulaItem);
		}
	}

	removeFormulaItem(formulaItem) {
		this.props.removeFormulaItem(formulaItem.id);
	}

	parseFormulaItem(formulaItem) {
		// Update the formula property using hot-parser
	}

	getNextId() {
	 return this.props.formulaItems
			? this.props.formulaItems.reduce((last, current) => current.id > last ? current.id : last, 0) + 1
			: 1;
	}

	renderItem(formulaItem) {
		return (
			<li className="FormulaItem" key={ formulaItem.id }>
				{/* TODO: Make a component for formula item name */}
				<input type="text" name="name" onChange={this.updateFormulaItem.bind(this, formulaItem)} value={formulaItem.name} />
				{/* TODO: Make a component for formula item formula */}
				<input
					type="text" name="formula" value={formulaItem.formula}
					onChange={this.updateFormulaItem.bind(this, formulaItem)}
					onBlur={this.parseFormulaItem.bind(this, formulaItem)} />
				{/* TODO: Make a component for formula item action buttons */}
				<button className="RemoveFormulaItemBtn" onClick={this.removeFormulaItem.bind(this, formulaItem)}>X</button>
				{/* TODO: Make items movable*/}
				{/*<button className="MoveFormulaItemBtn" onClick={this.removeFormulaItem.bind(this, formulaItem)}>+</button>*/}
			</li>
		);
	}

	render() {
		return (
			<div className="FormulaContainer">
				<h1>Formulas</h1>
				{this.props.formulaItems && <ul className="FormulaItems">{this.props.formulaItems.map(this.renderItem.bind(this))}</ul>}
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
		}).isRequired
	).isRequired,
	addFormulaItem: PropTypes.func.isRequired,
	updateFormulaItem: PropTypes.func.isRequired,
	removeFormulaItem: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormulaContainer);
