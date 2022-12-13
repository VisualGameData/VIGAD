import RandExp from 'randexp';
import { RegexHandler } from './RegexHandler';

export abstract class Regex {
    protected id: number;
    protected regex: RegExp;
    protected matching: Matching;
    protected slicing: Slicing;
    protected similarity: Similarity;
    protected matchesNum: number;
    protected substrings: { index: number; element: string }[];
    protected lastBestMatch: {
        rating: number;
        match: { index: number; element: string };
    };
    protected lastRegex: RegExp; // used for checking whether regex has changed -> regenerating matches
    protected lastMatchesNum: number; // used for checking whether matchesNum has changed -> regenerating matches
    protected generatedMatches: string[]; // generated matches

    protected constructor() {
        this.id = 0;
        this.regex = new RegExp('');
        this.matching = Matching.EXACT;
        this.slicing = Slicing.SUBSTR;
        this.similarity = Similarity.NONE;
        this.matchesNum = 10000;
        this.substrings = [];
        this.lastBestMatch = { rating: -1, match: { index: -1, element: '' } };
        this.lastRegex = new RegExp('');
        this.lastMatchesNum = this.matchesNum;
        this.generatedMatches = [];
    }

    public getId(): number {
        return this.id;
    }

    public getRegex(): RegExp {
        return this.regex;
    }

    public setRegex(regex: string) {
        this.regex = new RegExp(regex);
    }

    public getMatching(): Matching {
        return this.matching;
    }

    public setMatching(matching: Matching) {
        this.matching = matching;
    }

    public getSlicing(): Slicing {
        return this.slicing;
    }

    public setSlicing(slicing: Slicing) {
        this.slicing = slicing;
    }

    public getSimilarity(): Similarity {
        return this.similarity;
    }

    public setSimilarity(similarity: Similarity) {
        this.similarity = similarity;
    }

    public getMatchesNum(): number {
        return this.matchesNum;
    }

    public setMatchesNum(matchesNum: number) {
        this.matchesNum = matchesNum;
    }

    public getSubstrings(): { index: number; element: string }[] {
        return this.substrings;
    }

    public setSubstrings(substrings: { index: number; element: string }[]) {
        this.substrings = substrings;
    }

    public getLastBestMatch(): {
        rating: number;
        match: { index: number; element: string };
    } {
        return this.lastBestMatch;
    }

    /**
     * Generate substrings according to set slicing method
     * @param data
     * @return void
     */
    public genSubstrings(data: string) {
        switch (this.slicing) {
            case Slicing.SUBSTR:
                this.substrings = this.getAllSubstrings(data!);
                break;
            case Slicing.SPACES:
                data.split(' ').forEach((element) => {
                    this.substrings.push({
                        index: this.indexOfFirst(data),
                        element: element,
                    });
                });
                break;
            case Slicing.ENTIRE_STR:
                this.substrings.push({ index: 0, element: data });
                break;
        }
    }

    public applySimilarity() {
        switch (this.similarity) {
            case Similarity.NUM_LET:
                this.substrings.forEach((element, index) => {
                    this.substrings[index] = {
                        index: element.index,
                        element: this.repSimNumLet(element.element),
                    };
                });
                break;
            case Similarity.LET_NUM:
                this.substrings.forEach((element, index) => {
                    this.substrings[index] = {
                        index: element.index,
                        element: this.repSimLetNum(element.element),
                    };
                });
                break;
        }
    }

    /**
     * Generate matches for this regex
     * @param max: number
     * @return string[]
     */
    public genMatches(max: number = this.matchesNum) {
        let regLev0: string[] = [];
        let randexp = new RandExp(this.regex);
        for (let i = 0; i < max; i++) {
            let exp = randexp.gen();
            if (!regLev0.includes(exp)) {
                regLev0.push(exp);
            } else {
                // i--; May be a good performance optimization, doesn't work however if max is greater than the number of possible matches
            }
        }
        return regLev0;
    }

    /**
     * Get all substrings from str
     * @param str: string
     * @return {index: number, element: string}[]
     */
    private getAllSubstrings(
        str: string
    ): { index: number; element: string }[] {
        var i, j, result = [];

        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push({ index: i, element: str.slice(i, j) });
            }
        }
        return result;
    }

    /**
     * Find the best match in data using this.substrings
     * @param data: string
     * @return {rating: number, match: {index: number, element: string}}
     */
    public getBestMatch(data: string): {
        rating: number;
        match: { index: number; element: string };
    } {
        let bestMatch = { rating: -1, match: { index: -1, element: '' } };
        switch (this.matching) {
            case Matching.EXACT:
                this.substrings.every((element) => {
                    let exactMatch = element.element.match(this.regex);
                    if (
                        exactMatch !== null &&
                        bestMatch.match.element.length < exactMatch[0].length
                    ) {
                        bestMatch = {
                            rating: 1,
                            match: {
                                index: this.indexOfFirst(data),
                                element: exactMatch[0],
                            },
                        };
                    }
                });
                break;
            case Matching.APPROX:
                if (this.generatedMatches.length === 0 || this.lastRegex.toString() !== this.regex.toString() || this.matchesNum !== this.lastMatchesNum) {
                    this.generatedMatches = this.genMatches();
                    this.lastRegex = this.regex;
                    this.lastMatchesNum = this.matchesNum;
                }
                bestMatch = RegexHandler.approxMatching(
                    this.substrings,
                    this.generatedMatches
                );
                break;
        }
        this.lastBestMatch = bestMatch;
        return bestMatch;
    }

    /**
     * Replace numbers with similar looking letters
     * @param str: string
     * @return string
     */
    private repSimNumLet(str: string): string {
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
    private repSimLetNum(str: string): string {
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

    /**
     * Replace char at specific index in string
     * @param str: string
     * @param index: number
     * @param replacement: string
     * @return string
     */
    private replaceCharAt(str: string, index: number, replacement: string) {
        return str.substring(0, index) + replacement + str.substring(index + 1);
    }

    /**
     * Get the index of the first match of this regex in a string
     * @param data: string
     * @param regex: RegExp
     * @param before: boolean
     * @return number
     */
    private indexOfFirst(data: string, before: boolean = false): number {
        let match = data.match(this.regex);
        if (!match) {
            return -1;
        }
        let index = match.index;
        if (before) {
            index! += match[0].length;
        }
        return index!;
    }
}

export enum Matching {
    EXACT = 'Exact',
    APPROX = 'Approximate',
}

export enum Slicing {
    SUBSTR = 'Substring',
    SPACES = 'Spaces',
    ENTIRE_STR = 'Entire String',
}

export enum Similarity {
    NONE = 'None',
    NUM_LET = 'Numbers To Letters',
    LET_NUM = 'Letters To Numbers',
}
