import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const makeRecord = (l, t, n, c, v) => {
    return {'Line': l, 'Type': t, 'Name': n, 'Condition': c, 'Value': v};
};

function flat(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flat(val)) : acc.concat(val), []);
}

const findHandler = (x) =>
    Handlers[x.type](x);

const functionDeclarationHandler = (x) => {
    let tmp = [makeRecord(x.loc.start.line, 'function statement', x.id.name, null, null)];
    return tmp.concat(x.params.map(y => IdentifierHandler(y))).concat(findHandler(x.body));
};

const variableDeclaratorHandler = (x) =>
    makeRecord(x.loc.start.line, 'variable declaration',
        x.id.name, null, x.init != null ? escodegen.generate(x.init) : null);


const IdentifierHandler = (x) =>
    makeRecord(x.loc.start.line, 'variable declaration', x.name, null, null);

const variableDeclarationHandler = (x) =>
    x.declarations.map(y => variableDeclaratorHandler(y));


const blockStatementHandler = (x) =>
    x.body.map(x => findHandler(x));

const assignmentExpressionHandler = (x) =>
    makeRecord(x.loc.start.line, 'assignment expression',
        x.left.name, null, escodegen.generate(x.right));

const sequenceExpressionHandler = (x) =>
    x.expressions.map(x => findHandler(x));

const expressionStatementHandler = (x) => {
    let y = [x.expression];
    return [].concat(y.map(x => findHandler(x)));
};
const whileStatementHandler = (x) => {
    let tmp = [makeRecord(x.loc.start.line, 'while statement', null, escodegen.generate(x.test), null)];
    return tmp.concat([x.body].map(x => findHandler(x)));
};

const forStatementHandler = (x) => {
    let tmp = [makeRecord(x.loc.start.line, 'for statement', null, escodegen.generate(x.test), null)];
    return tmp.concat(findHandler(x.init)).concat(findHandler(x.update)).concat(findHandler(x.body));
};

const ifStatementHandler = (x) => {
    let ret = [makeRecord(x.loc.start.line, 'if statement', null, escodegen.generate(x.test), null)];
    ret = ret.concat(findHandler(x.consequent));
    let tmp = x.alternate != null ? findHandler(x.alternate) : [];
    return ret.concat(tmp);
};

const returnStatementHandler = (x) =>
    makeRecord(x.loc.start.line, 'return statement', null, null, escodegen.generate(x.argument));

let Handlers = {
    'FunctionDeclaration': functionDeclarationHandler,
    'VariableDeclaration': variableDeclarationHandler,
    'BlockStatement': blockStatementHandler,
    'VariableDeclarator': variableDeclaratorHandler,
    'Identifier': IdentifierHandler,
    'ExpressionStatement': expressionStatementHandler,
    'SequenceExpression': sequenceExpressionHandler,
    'AssignmentExpression': assignmentExpressionHandler,
    'WhileStatement': whileStatementHandler,
    'ForStatement': forStatementHandler,
    'IfStatement': ifStatementHandler,
    'ReturnStatement': returnStatementHandler
};

const parseCode = (codeToParse) => {
    let ret = esprima.parseScript(codeToParse, {loc: true}).body;
    return flat((ret.map(x => findHandler(x))));
};

export {parseCode};
