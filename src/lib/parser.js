import { Parser as HotParser } from 'hot-formula-parser';

const getErrorMessage = (err) => ({
        '#ERROR!'	: 'Error',
        '#DIV/0!'	: 'Cannot divide by zero',
        '#NAME?'	: 'Undefined function or variable',
        '#N/A'		: 'Value is not avaiable to a formula',
        '#NUM!'		: 'Invalid Number',
        '#VALUE!'	: 'Invalid argument type',
    }[err] || null);


export default class Parser extends HotParser {
    parse(string) {
        let { error, result } = super.parse(string);
        let errorMsg = getErrorMessage(error);

        result = result || 0;

        return {error, result, errorMsg};
    }
}