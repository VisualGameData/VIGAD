var stringSimilarity = require("string-similarity");

export class RegexHandler {
    private static instance: RegexHandler;

    private constructor() {
    }

    /**
     * This function gets the singelton instance of RegexHandler.ts
     *
     * @return Vigad
     */
    public static getInstance(): RegexHandler {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * Get all substrings from str
     * @param str: string
     * @return {index: number, element: string}[]
     */
    private getAllSubstrings(str:string) {
        var i, j, result = [];

        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push({index: i, element: str.slice(i, j)});
            }
        }
        return result;
    }

    /**
     * Find the best match for a string in a list of previously generated regex matches
     * @param data: string
     * @param genMatches: string[]
     * @return {bestMatch: {target: string, rating: number}, ratings: {target: string, rating: number}[]}
     */
    private bestMatch(data:string, genMatches:string[]) {
        let matches = stringSimilarity.findBestMatch(data, genMatches);
        return matches.bestMatch;
    }

    /**
     * Get the best matching string from substrings for previously generated regex matches
     * @param substrings: {index: number, element: string}[]
     * @param regexMatches: string[]
     * @return {match: {index: number, element: string}, rating: number}
     */
    private approxMatching(substrings:{index:number, element:string}[], regexMatches:string[]) {
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

    /**
     * Replace char at specific index in string
     * @param str: string
     * @param index: number
     * @param replacement: string
     * @return string
     */
    private replaceCharAt(str:string, index:number, replacement:string) {
        return str.substring(0, index) + replacement + str.substring(index + 1);
    }

    /**
     * Replace numbers with similar looking letters
     * @param str: string
     * @return string
     */
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

    /**
     * Replace letters with similar looking numbers
     * @param str: string
     * @return string
     */
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
                case 's':
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
}