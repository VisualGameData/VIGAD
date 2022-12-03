import RandExp from "randexp";
var stringSimilarity = require("string-similarity");

export class Vigad {
    private lookAlikes = {
        'a': ["a"],
        'b': ["(b|6)"],
        'c': ["(c|e)"],
        'd': ["d"],
        'e': ["(e|c|€)"],
        'f': ["f"],
        'g': ["(g|q|9)"],
        'h': ["h"],
        'i': ["(i|!)"],
        'j': ["j"],
        'k': ["k"],
        'l': ["(l|1|I|T|!)"],
        'm': ["(m|n)"],
        'n': ["(n|p|m)"],
        'o': ["(o|0|O)"],
        'p': ["(p|n)"],
        'q': ["(q|g)"],
        'r': ["r"],
        's': ["s"],
        't': ["t"],
        'u': ["(u|v|U)"],
        'v': ["(v|u|V)"],
        'w': ["w"],
        'x': ["x"],
        'y': ["(y|z)"],
        'z': ["(z|y)"],
        'A': ["A"],
        'B': ["(B|P|8)"],
        'C': ["(C|G)"],
        'D': ["(D|O|0)"],
        'E': ["(E|F)"],
        'F': ["(F|R|E|7)"],
        'G': ["(G|C|6)"],
        'H': ["H"],
        'I': ["(I|l|L|!)"],
        'J': ["J"],
        'K': ["K"],
        'L': ["(L|I)"],
        'M': ["(M|N)"],
        'N': ["(N|M)"],
        'O': ["(O|D|U|0|o)"],
        'P': ["(P|B)"],
        'Q': ["(Q|2)"],
        'R': ["(R|F)"],
        'S': ["(S|5|8)"],
        'T': ["(T|l|7)"],
        'U': ["(U|O|V|0|4|u)"],
        'V': ["(V|U|W|v)"],
        'W': ["(W|V)"],
        'X': ["(X|Y)"],
        'Y': ["(Y|X|5)"],
        'Z': ["(Z|2|7)"],
        '0': ["(0|o|O|D|U|8)"],
        '1': ["(1|l|7|!)"],
        '2': ["(2|Z|Q)"],
        '3': ["(3|9|8|5)"],
        '4': ["(4|U|9)"],
        '5': ["(5|S|Y|8|3)"],
        '6': ["(6|b|G|8)"],
        '7': ["(7|F|Z|T|1)"],
        '8': ["(8|B|S|0|3|5|6)"],
        '9': ["(9|g|q|3|4)"],
        ' ': [" "],
        '!': ["(!|1|i|l|I)"],
        '"': ["(\")"],
        '#': ["#"],
        '€': ["(€|e)"],
        '$': ["\\$"],
        '%': ["%"],
        '&': ["&"],
        '/': ["/"],
        '(': ["\\("],
        ')': ["\\)"],
        '=': ["="],
        '?': ["\\?"],
        '*': ["\\*"],
        '+': ["\\+"],
        '-': ["-"],
        '_': ["_"],
        '.': ["\."],
        ',': [","],
        ';': [";"],
        ':': [":"],
        '<': ["<"],
        '>': [">"],
        '[': ["\\["],
        ']': ["\\]"],
        '{': ["\\{"],
        '}': ["\\}"],
        '|': ["\\|"],
        '\\': ["\\\\"],
        '^': ["\\^"],
        '`': ["`"],
        '~': ["~"],
        '@': ["@"],
        '\'': ["\\'"],
        '§': ["§"],
        '°': ["°"],
        'ß': ["ß"],
        'Ä': ["Ä"],
        'Ö': ["Ö"],
        'Ü': ["Ü"],
        'ä': ["ä"],
        'ö': ["ö"],
        'ü': ["ü"]
    }

    private lookAlikesC = [
        ['g', 'q'],
        ['p', 'n'],
        ['m', 'n'],
        ['y', 'z'],
        ['u', 'v'],
        ['c', 'e'],
        ['l', 'I'],
        ['T', 'I'],
        ['D', 'O'],
        ['C', 'G'],
        ['L', 'I'],
        ['M', 'N'],
        ['P', 'B'],
        ['F', 'R'],
        ['U', 'O'],
        ['U', 'V'],
        ['E', 'F'],
        ['V', 'W'],
        ['X', 'Y'],
        ['U', 'u'],
        ['V', 'v']
    ];
    private lookAlikesNC = [
        ['0', 'o'],
        ['0', 'O'],
        ['0', 'D'],
        ['0', 'U'],
        ['1', 'l'],
        ['2', 'Z'],
        ['2', 'Q'],
        ['4', 'U'],
        ['5', 'S'],
        ['5', 'Y'],
        ['6', 'b'],
        ['6', 'G'],
        ['7', 'F'],
        ['7', 'Z'],
        ['7', 'T'],
        ['8', 'B'],
        ['8', 'S'],
        ['9', 'g'],
        ['9', 'q']
    ];
    private lookAlikesN = [
        ['0', '8'],
        ['3', '9'],
        ['3', '8'],
        ['4', '9'],
        ['5', '8'],
        ['5', '3'],
        ['6', '8'],
        ['7', '1']
    ];
    public main() {

        let data:string = "Here we have some random text that was HP? 55 fetched fromplazer: kartoffelMarc the image, including som data in between."

        // new approach
        let regexInput = "HP?";
        let regex:RegExp = this.genRegex(regexInput);
        let match = data.match(regex);
        console.log(regex);
        console.log(match);
        // <<- new approach

        /*

        let dataSubstr = this.getAllSubstrings(data);
        console.log(dataSubstr);

        let firstRegex: RegExp = /fetched/;
        let firstRegexMatch = this.approxMatching(dataSubstr, firstRegex, this.genMatches(firstRegex, 50000));
        console.log("Best Match first Regex: ");
        console.log(firstRegexMatch);

        let secondRegex: RegExp = /kartoffelMarc/;
        let secondRegexMatch = this.approxMatching(dataSubstr, secondRegex, this.genMatches(secondRegex, 50000));
        console.log("Best Match second Regex: ");
        console.log(secondRegexMatch);

        let valueRegex = /[a-zA-Z]*Player/;
        let valueSubstr = data.slice(firstRegexMatch.match.index + firstRegexMatch.match.element.length, secondRegexMatch.match.index);

        // Option 1: test against all substrings.
        // Most error tolerant.
        // Very Performance intensive
        // only reliable for very specific regex
        // works with tight constraints only
        // may cut parts of the value to be extracted for unspecific regex (with variable length)
        // -> for exact value matching, this is always the way to go
        // -> for approximate value matching, this MAY BE the way to go if regex is very specific (and constraints are tight)
        //let valueSubstrSubstr = this.getAllSubstrings(valueSubstr);
        // this is probably most useful for constraint-regex-matching (not for actually extracting the value) => if value is not very specific

        // Option 2: test against substrings sliced at spaces
        // Less error tolerant
        // Much less performance intensive
        // works with less specific regex
        // works with less tight constraints
        // -> for approximate value matching with lose constraints
        let valueSubstrSubstr:{index:number, element:string}[] = []; // only test substrings sliced at ' '
        valueSubstr.split(" ").forEach(element => {
            valueSubstrSubstr.push({index: -1, element: element});
        });

        // ! PROBABLY IRRELEVANT ! Option 3: test against entire (sub)string
        // less error tolerant
        // least performance intensive
        // works with unspecific regex
        // only works with very tight constraints
        //let valueSubstrSubstr = [{index: -1, element: valueSubstr}];

        // apply similar letter-to-number conversion and vise versa here (for each substring)
        valueSubstrSubstr.forEach((element, index) => {
            valueSubstrSubstr[index] = {index: element.index, element: this.repSimLetNum(element.element)};
        });



        console.log(valueSubstrSubstr);
        // Option 1:
        // approximate value matching -> may result in values not exactly matching regex
        let valueRegexMatch = this.approxMatching(valueSubstrSubstr, valueRegex, this.genMatches(valueRegex, 100000));
        // Option 2:
        // exact matching -> only accept values that definitely match the valueRegex
        /*let valueRegexMatch = {rating: -1, match: {index: -1, element: ""}};
        valueSubstrSubstr.every(element => {
            let exactMatch = element.element.match(valueRegex);
            if (exactMatch !== null && valueRegexMatch.match.element.length < exactMatch[0].length) {
                valueRegexMatch = {rating: 1, match: {index: -1, element: exactMatch[0]}};
            }
            return true;
        });*/

        //console.log("Best Match value Regex: ");
        //console.log(valueRegexMatch);

    }


    private match(data:string, regex:RegExp):void {
        let findAfter:RegExp = /HP:/;   // value regex can be found after this
        let findBefore:RegExp = /fetched/;  // value regex can be found before this
        let valuesubstr:string = data.substring(this.indexOfFirst(data, findAfter, true), this.indexOfFirst(data, findBefore)); // split string to substring containing value regex
        console.log("Substr: ");
        console.log(valuesubstr);
        let res = valuesubstr.match(regex); // find value matching the value regex
        console.log(res);
        console.log("---------------------------------------------");
        console.log(this.matchingToPercentage(data, regex));
        console.log("----------------------bestMatch-----------------------");
        //console.log(this.bestMatch(valuesubstr, regex));
    }

    private indexOfFirst(data:string, regex:RegExp, before:boolean = false):number {
        let match = data.match(regex);
        let index = match!.index;
        if (before) {
            index! += match![0].length;
        }
        return index!;
    }

    private matchingToPercentage(data:string, regex:RegExp) {
        const randexp = new RandExp(regex);
        console.log(randexp.gen());
    }

    private genMatches(regex:RegExp, max:number) {
        let regLev0: string[] = [];
        let randexp = new RandExp(regex);
        for (let i = 0; i < max; i++) {
            let exp = randexp.gen();
            if (!regLev0.includes(exp)) {
                regLev0.push(exp);
            }
        }
        console.log("generated");
        return regLev0;
    }

    private bestMatch(data:string, genMatches:string[]) {
        let matches = stringSimilarity.findBestMatch(data, genMatches);
        //console.log("Matches:");
        //console.log(matches);
        //console.log("Best Match to '" + data + "':");
        //console.log(matches.bestMatch);
        return matches.bestMatch;
    }

    private getAllSubstrings(str:string) {
        var i, j, result = [];

        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push({index: i, element: str.slice(i, j)});
            }
        }
        return result;
    }


    private approxMatching(substrings:{index:number, element:string}[], regex:RegExp, regexMatches:string[]) {
        let highestRating = 0;
        let highestRatingElem = {index:-1, element: ""};
        substrings.every(element => {
            let bestMatch = this.bestMatch(element.element, regexMatches);
            if (bestMatch.rating > highestRating) {
                highestRating = bestMatch.rating;
                highestRatingElem = element;
            } else if (bestMatch.rating == highestRating && element.element.length > highestRatingElem.element.length) { // accept longest element rather
                highestRatingElem = element;
            }
            /*if (highestRating == 1) {
                return false;
            }*/
            return true;
        });

        return {match: highestRatingElem, rating: highestRating};
    }

    private repSimNumLet(str:string):string {
        for (let i = 0; i < str.length; i++) {
            switch (str.charAt(i)) {
                case '0':
                    str = this.replaceCharAt(str, i, 'o');
                    break;
                case '1':
                    str = this.replaceCharAt(str, i, 'l');
                    break;
                case '4':
                    str = this.replaceCharAt(str, i, 'U');
                    break;
                case '5':
                    str = this.replaceCharAt(str, i, 'S');
                    break;
                case '6':
                    str = this.replaceCharAt(str, i, 'b');
                    break;
                case '7':
                    str = this.replaceCharAt(str, i, 'T');
                    break;
                case '8':
                    str = this.replaceCharAt(str, i, 'B');
                    break;
                case '9':
                    str = this.replaceCharAt(str, i, 'g');
                    break;
                default:
                    break;
            }
        }
        return str;
    }

    private repSimLetNum(str:string):string {
        for (let i = 0; i < str.length; i++) {
            switch (str.charAt(i)) {
                case 'o':
                    str = this.replaceCharAt(str, i, '0');
                    break;
                case 'O':
                    str = this.replaceCharAt(str, i, '0');
                    break;
                case 'U':
                    str = this.replaceCharAt(str, i, '0');
                    break;
                case 'u':
                    str = this.replaceCharAt(str, i, '0');
                    break;
                case 'D':
                    str = this.replaceCharAt(str, i, '0');
                    break;
                case 'l':
                    str = this.replaceCharAt(str, i, '1');
                    break;
                case 'Z':
                    str = this.replaceCharAt(str, i, '2');
                    break;
                case 'z':
                    str = this.replaceCharAt(str, i, '2');
                    break;
                case 'Q':
                    str = this.replaceCharAt(str, i, '2');
                    break;
                case 'S':
                    str = this.replaceCharAt(str, i, '5');
                    break;
                case 'Y':
                    str = this.replaceCharAt(str, i, '5');
                    break;
                case 'b':
                    str = this.replaceCharAt(str, i, '6');
                    break;
                case 'G':
                    str = this.replaceCharAt(str, i, '6');
                    break;
                case 'T':
                    str = this.replaceCharAt(str, i, '7');
                    break;
                case 'F':
                    str = this.replaceCharAt(str, i, '7');
                    break;
                case 'B':
                    str = this.replaceCharAt(str, i, '8');
                    break;
                case 'g':
                    str = this.replaceCharAt(str, i, '9');
                    break;
                case 'q':
                    str = this.replaceCharAt(str, i, '9');
                    break;
                default:
                    break;
            }
        }
        return str;
    }

    private replaceCharAt(str:string, index:number, replacement:string) {
        return str.substring(0, index) + replacement + str.substring(index + 1);
    }

    private genRegex(regex:string):RegExp {
        for (let i = 0; i < regex.length; i++) {
            let char:string = regex.charAt(i);
            // don't ask me what this brackets notation is, I tried to understand this for hours... ts is weird
            if (this.lookAlikes[char as keyof typeof this.lookAlikes].length > 0) {
                regex = this.replaceCharAt(regex, i, this.lookAlikes[char as keyof typeof this.lookAlikes][0]);
                i += this.lookAlikes[char as keyof typeof this.lookAlikes][0].length - 1;
            }
        }
        return new RegExp(regex);
    }
}