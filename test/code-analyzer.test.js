import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

const tester = (title, code, actual) =>
    it(title, () => assert.equal(JSON.stringify(parseCode(code)), actual));

let finalTestCode = 'function binarySearch(X, V, n){\n' +
    '    let low, high, mid;\n' +
    '    low = 0;\n' +
    '    high = n - 1;\n' +
    '    while (low <= high) {\n' +
    '        mid = (low + high)/2;\n' +
    '        if (X < V[mid])\n' +
    '            high = mid - 1;\n' +
    '        else if (X > V[mid])\n' +
    '            low = mid + 1;\n' +
    '        else\n' +
    '            return mid;\n' +
    '    }\n' +
    '    return -1;\n' +
    '}';

describe('The javascript parser', () => {
    tester('is parsing an empty function correctly', '', '[]');
    tester('is parsing a simple variable declaration correctly', 'let a = 1;','[{"Line":1,"Type":"variable declaration","Name":"a","Condition":null,"Value":"1"}]');
    tester('is parsing a multiple variable declaration correctly', 'let a = 1, b = 2, c;', '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":null,"Value":"1"},{"Line":1,"Type":"variable declaration","Name":"b","Condition":null,"Value":"2"},{"Line":1,"Type":"variable declaration","Name":"c","Condition":null,"Value":null}]');
    tester('is parsing a simple variable assignment correctly', 'let a = 1, b = 2, c; c = 3;','[{"Line":1,"Type":"variable declaration","Name":"a","Condition":null,"Value":"1"},{"Line":1,"Type":"variable declaration","Name":"b","Condition":null,"Value":"2"},{"Line":1,"Type":"variable declaration","Name":"c","Condition":null,"Value":null},{"Line":1,"Type":"assignment expression","Name":"c","Condition":null,"Value":"3"}]');
    tester('is parsing a multiple variable assignment correctly', 'let a = 1, b = 2, c; a = 1, b = 2, c = 3;','[{"Line":1,"Type":"variable declaration","Name":"a","Condition":null,"Value":"1"},{"Line":1,"Type":"variable declaration","Name":"b","Condition":null,"Value":"2"},{"Line":1,"Type":"variable declaration","Name":"c","Condition":null,"Value":null},{"Line":1,"Type":"assignment expression","Name":"a","Condition":null,"Value":"1"},{"Line":1,"Type":"assignment expression","Name":"b","Condition":null,"Value":"2"},{"Line":1,"Type":"assignment expression","Name":"c","Condition":null,"Value":"3"}]');
    tester('is parsing a return statement in a function correctly', 'function func (x) { return x; }','[{"Line":1,"Type":"function statement","Name":"func","Condition":null,"Value":null},{"Line":1,"Type":"variable declaration","Name":"x","Condition":null,"Value":null},{"Line":1,"Type":"return statement","Name":null,"Condition":null,"Value":"x"}]');
    tester('is parsing an if statement correctly', 'let x = 1; if(x < 2) x = x - 1;', '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":null,"Value":"1"},{"Line":1,"Type":"if statement","Name":null,"Condition":"x < 2","Value":null},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x - 1"}]');
    tester('is parsing a complex if statement  correctly', 'let x = 1; if(x < 2) x = x - 1; else { x = x - 1 }', '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":null,"Value":"1"},{"Line":1,"Type":"if statement","Name":null,"Condition":"x < 2","Value":null},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x - 1"},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x - 1"}]');
    tester('is parsing a while statement correctly', 'let x = 1; while(x < 2) {x = x + 1;}', '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":null,"Value":"1"},{"Line":1,"Type":"while statement","Name":null,"Condition":"x < 2","Value":null},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x + 1"}]');
    tester('is parsing a for statement correctly', 'let x = 1; for(x = 1; x < 2; x = x + 1) {x = x + 1;}','[{"Line":1,"Type":"variable declaration","Name":"x","Condition":null,"Value":"1"},{"Line":1,"Type":"for statement","Name":null,"Condition":"x < 2","Value":null},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"1"},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x + 1"},{"Line":1,"Type":"assignment expression","Name":"x","Condition":null,"Value":"x + 1"}]');
    tester('is parsing a function with while and if correctly', finalTestCode,'[{"Line":1,"Type":"function statement","Name":"binarySearch","Condition":null,"Value":null},{"Line":1,"Type":"variable declaration","Name":"X","Condition":null,"Value":null},{"Line":1,"Type":"variable declaration","Name":"V","Condition":null,"Value":null},{"Line":1,"Type":"variable declaration","Name":"n","Condition":null,"Value":null},{"Line":2,"Type":"variable declaration","Name":"low","Condition":null,"Value":null},{"Line":2,"Type":"variable declaration","Name":"high","Condition":null,"Value":null},{"Line":2,"Type":"variable declaration","Name":"mid","Condition":null,"Value":null},{"Line":3,"Type":"assignment expression","Name":"low","Condition":null,"Value":"0"},{"Line":4,"Type":"assignment expression","Name":"high","Condition":null,"Value":"n - 1"},{"Line":5,"Type":"while statement","Name":null,"Condition":"low <= high","Value":null},{"Line":6,"Type":"assignment expression","Name":"mid","Condition":null,"Value":"(low + high) / 2"},{"Line":7,"Type":"if statement","Name":null,"Condition":"X < V[mid]","Value":null},{"Line":8,"Type":"assignment expression","Name":"high","Condition":null,"Value":"mid - 1"},{"Line":9,"Type":"if statement","Name":null,"Condition":"X > V[mid]","Value":null},{"Line":10,"Type":"assignment expression","Name":"low","Condition":null,"Value":"mid + 1"},{"Line":12,"Type":"return statement","Name":null,"Condition":null,"Value":"mid"},{"Line":14,"Type":"return statement","Name":null,"Condition":null,"Value":"-1"}]');
});
