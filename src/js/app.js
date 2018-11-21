import $ from 'jquery';
import {parseCode} from './code-analyzer';

const printTable = (l) => {
    let arr = l;
    let matrix = [['Line', 'Type', 'Name', 'Condition', 'Value']];
    let i = 1;
    arr.forEach(function (map) {
        matrix[i] = [map['Line'], map['Type'], map['Name'], map['Condition'], map['Value']];
        i++;
    });
    let res = '<table border=3 class="minimalistBlack"><thead>';
    for (i = 0; i < matrix[0].length; i++) res += '<th>' + matrix[0][i] + '</th>';
    res +='</thead>';
    for (i = 1; i < matrix.length; i++) {
        res += '<tr>';
        for (let j = 0; j < matrix[i].length; j++)
            res += '<td>' + (matrix[i][j] == null ? '' : matrix[i][j]) + '</td>';
        res += '</tr>';
    }
    res += '</table>';
    document.body.innerHTML = res;
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        printTable(parsedCode);
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 0));
    });
});

