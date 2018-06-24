import { Parser as HotParser } from 'hot-formula-parser';

const getErrorMessage = (err) => ({
        '#ERROR!'	: 'Error',
        '#DIV/0!'	: 'Cannot divide by zero',
        '#NAME?'	: 'Undefined function or variable',
        '#N/A'		: 'Value is not avaiable to a formula',
        '#NUM!'		: 'Invalid Number',
        '#VALUE!'	: 'Invalid argument type',
    }[err] || null);

export const cyclicRefChecker = (payloads, indexToCheck, showLog = false) => {
    const _log = showLog;
    const _visited = [];
    const _indexToCheck = indexToCheck;
    let _currentIndex = null;
    let _found = false;
    let _payloads = payloads;

    const setCurrentIndex = (index) => _currentIndex = index;

    const logger = (index, ...other) => _log && console.log(`Index ${index}:`, ...other);

    const addToTree = (index) => _visited.push(index);

    const unVisited = (ref) => _visited.indexOf(ref) === -1;

    const cycle = () => {
        const unfilteredRefs = _payloads[_currentIndex];
        
        // There is no point in continuing if it already found a circular reference
        if(_found === true) {
            return;
        }
        // return the current index has already been visited
        if( _visited.indexOf(_currentIndex) !== -1 ) {
            logger(_currentIndex, `This index has already been visited returning`);
            return;
        }
        logger(_currentIndex, `Leaves ${JSON.stringify(unfilteredRefs)}`);
        // push the current index to the visited list
        addToTree(_currentIndex);

        logger(_currentIndex, `Visited updated to ${JSON.stringify(_visited)}`);
        // set found to true as current index has an index we are looking for
        if( unfilteredRefs.indexOf(indexToCheck) !== -1 ) {
            logger(_currentIndex,`Found a cycling reference with refs of ${JSON.stringify(unfilteredRefs)}`);
            _found = true;
        }
        // Filter the indices to only ones that we have not visited yet
        const filteredRefs = unfilteredRefs.filter(unVisited);

        logger(_currentIndex, `Going to cycle indices ${JSON.stringify(filteredRefs)}`)
        // Loop through all indeces and perform cycle again
        filteredRefs.forEach(ref => {
            setCurrentIndex(ref);
            cycle();
        });
    }

    setCurrentIndex(indexToCheck);
    cycle(_indexToCheck);

    return {
        tree: _visited,
        result: _found,
        index: _indexToCheck
    };
}

export default class Parser extends HotParser {

    constructor() {
        super();
        this.on('callFunction', this._addItemFunction.bind(this));
        console.log(this);
    }

    parse(string) {
        let { error, result } = super.parse(string);
        let errorMsg = getErrorMessage(error);

        result = result || 0;

        return {error, result, errorMsg};
    }

    _addItemFunction(name, params, done) {
        if(name.toLowerCase() === 'item') {
            let itemIndex = params[0];

            if(this._callItems()[itemIndex] !== void 0) {
                done(this.props.formulaItems[itemIndex].value)
            } else {
                done(new Error('#VALUE!'));
            }
        }
    }

    _callItems() {
        let items = [];

        this.emit('callItems', function(newItems) {
            console.log('newItems', newItems);
            if( newItems && newItems.constructor === Array ) {
                items = newItems;
            }
        });

console.log('returinig items', items);
        return items;
    }
}