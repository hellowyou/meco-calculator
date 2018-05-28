import React, { Component } from 'react';
import './App.css';
import FormulaContainer from './FormulaContainer';

class App extends Component {
  render() {
  	const formulaVars = {
  		READING_DIFF: 10
  	};
    return (
      <div className="App">
        <FormulaContainer formulaVars={formulaVars} />
      </div>
    );
  }
}

export default App;
