import RandExp from "randexp";
var stringSimilarity = require("string-similarity");

export class Vigad {
    public main() {
        let data:string = "Here we have some random text that was HP: 55 fetched fromPlayer: Marc the image, including som data in between."
        let dataSubstr = this.getAllSubstrings(data);
        console.log(dataSubstr);

        let firstRegex: RegExp = /Player\:/;
        let firstRegexMatches = this.genMatches(firstRegex, 50000);
        let highestRating = 0;
        let highestRatingElem = "";
        dataSubstr.forEach(element => {
            let bestMatch = this.bestMatch(element, firstRegexMatches);
            if (bestMatch.rating > highestRating) {
                highestRating = bestMatch.rating;
                highestRatingElem = element;
            } else if (bestMatch.rating == highestRating && element.length > highestRatingElem.length) { // accept longest element rather
                highestRatingElem = element;
            }
            if (highestRating == 1) {
                return; // does not work with foreach but can be a great performance optimizer
            }
        });
        console.log("Best Match first Regex: ");
        console.log(highestRatingElem);

        let valueRegex = /^\w{1,10}\b/;

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
        console.log("Best Match to '" + data + "':");
        console.log(matches.bestMatch);
        return matches.bestMatch;
    }

    private getAllSubstrings(str:string) {
        var i, j, result = [];
      
        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push(str.slice(i, j));
            }
        }
        return result;
      }

}