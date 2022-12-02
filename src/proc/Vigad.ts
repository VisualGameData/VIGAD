import RandExp from "randexp";
var stringSimilarity = require("string-similarity");

export class Vigad {
    public main() {
        let data:string = "Here we have some random text that was HP: 55 fetched fromPlayer: kartoffelMarc the image, including som data in between."
        let dataSubstr = this.getAllSubstrings(data);
        console.log(dataSubstr);

        let firstRegex: RegExp = /Here/;
        let firstRegexMatch = this.approxMatching(dataSubstr, firstRegex, this.genMatches(firstRegex, 50000));
        console.log("Best Match first Regex: ");
        console.log(firstRegexMatch);

        let secondRegex: RegExp = /between/;
        let secondRegexMatch = this.approxMatching(dataSubstr, secondRegex, this.genMatches(secondRegex, 50000));
        console.log("Best Match second Regex: ");
        console.log(secondRegexMatch);

        let valueRegex = /[a-zA-Z]*Player/;
        let valueSubstr = data.slice(firstRegexMatch.match.index + firstRegexMatch.match.element.length, secondRegexMatch.match.index);
        
        // Option 1: test against all substrings. 
        // Most error tolerant. 
        // Very Performance intensive
        // only reliable for very specific regex
        // works with strict constraints only
        // may cut parts of the value to be extracted for unspecific regex (with variable length)
        // -> for exact value matching, this is the way to go
        let valueSubstrSubstr = this.getAllSubstrings(valueSubstr);
        // this is probably most useful for constraint-regex-matching (not for actually extracting the value) => if value is not very specific

        // Option 2: test against substrings sliced at spaces
        // Less error tolerant
        // Much less performance intensive
        // works with less specific regex
        // works with less strict constraints
        /*let valueSubstrSubstr:{index:number, element:string}[] = []; // only test substrings sliced at ' '
        valueSubstr.split(" ").forEach(element => {
            valueSubstrSubstr.push({index: -1, element: element});
        });*/

        // Option 3: test against entire (sub)string
        // less error tolerant
        // least performance intensive
        // works with unspecific regex
        // only works with very strict constraints
        //let valueSubstrSubstr = [{index: -1, element: valueSubstr}];

        // apply similar letter-to-number conversion and vise versa here (for each substring)
        
        
        
        console.log(valueSubstrSubstr);
        // Option 1:
        // approximate value matching -> may result in values not exactly matching regex
        //let valueRegexMatch = this.approxMatching(valueSubstrSubstr, valueRegex, this.genMatches(valueRegex, 100000));
        // Option 2:
        // exact matching -> only accept values that definitely match the valueRegex
        let valueRegexMatch = {rating: -1, match: {index: -1, element: ""}};
        valueSubstrSubstr.every(element => {
            let exactMatch = element.element.match(valueRegex);
            if (exactMatch !== null && valueRegexMatch.match.element.length < exactMatch[0].length) {
                valueRegexMatch = {rating: 1, match: {index: -1, element: exactMatch[0]}};
            }
            return true;
        });
        console.log("Best Match value Regex: ");
        console.log(valueRegexMatch);
        //this.match(data, regex);
        //console.log(this.bestMatch(data, regex));
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
}