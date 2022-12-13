import { ConstraintRegex } from "./ConstraintRegex";
import { Slicing } from "./Regex";
import { ValueRegex } from "./ValueRegex";
import { StringSimilarity } from "../stringSimilarity";

export class RegexHandler {
    private static instance: RegexHandler;

    private constructor() {
    }

    /**
     * This function gets the singelton instance of RegexHandler.ts
     *
     * @return RegexHandler
     */
    public static getInstance(): RegexHandler {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * Find best match for value regex in given string (data). Takes optional constraint regex before and after value regex.
     * @param data
     * @param valueRegex
     * @param cRegexBefore
     * @param cRegexAfter
     * @return {rating: number, match: {index: number, element: string}}
     */
    public findValue(data:string, valueRegex: ValueRegex, cRegexBefore?: ConstraintRegex, cRegexAfter?: ConstraintRegex): {rating: number, match: {index: number, element: string}} {

        // replace all occurences of \n in data with spaces
        data = data.replace(/\n/g, " ");

        let constraintRegex: ConstraintRegex[] = [];
        if (typeof cRegexBefore !== 'undefined') {
            constraintRegex.push(cRegexBefore);
        }
        if (typeof cRegexAfter !== 'undefined') {
            constraintRegex.push(cRegexAfter);
        }

        let allSubstrings: {index:number, element:string}[] = [];
        let spacesSubstrings: {index:number, element:string}[] = [];

        // set required substrings for constraint regex & apply similarity conversion
        for (let i = 0; i < constraintRegex.length; i++) {
            if (constraintRegex[i].getSlicing() === Slicing.SUBSTR && allSubstrings.length !== 0) {
                constraintRegex[i].setSubstrings(allSubstrings.slice());   // clone array
            } else if (constraintRegex[i].getSlicing() === Slicing.SPACES && spacesSubstrings.length !== 0) {
                constraintRegex[i].setSubstrings(spacesSubstrings.slice());   // clone array
            } else {
                constraintRegex[i].genSubstrings(data);
            }
            if (constraintRegex[i].getSlicing() === Slicing.SUBSTR) {
                allSubstrings = constraintRegex[i].getSubstrings(); // cache substrings
            } else if (constraintRegex[i].getSlicing() === Slicing.SPACES) {
                spacesSubstrings = constraintRegex[i].getSubstrings(); // cache substrings
            }

            constraintRegex[i].applySimilarity();
        }

        // gen best matches for constraint regex
        for (let i = 0; i < constraintRegex.length; i++) {
            constraintRegex[i].getBestMatch(data);
        }

        // determine constraint indexes
        let lowestHighIndex = 0;
        let highestLowIndex = 0;
        constraintRegex.forEach(regex => {
            switch (regex.getLocation()) {
                case "Before":
                    if (regex.getLastBestMatch().match.index > highestLowIndex) {
                        highestLowIndex = regex.getLastBestMatch().match.index;
                    }
                    break;
                case "After":
                    if (regex.getLastBestMatch().match.index < lowestHighIndex) {
                        lowestHighIndex = regex.getLastBestMatch().match.index;
                    }
                    break;
            }
        });
        if (lowestHighIndex === 0) {
            lowestHighIndex = data.length;
        }
        console.log("here");
        // set required substrings for value regex & apply similarity conversion
        if (highestLowIndex === 0 && lowestHighIndex === data.length) { // if no constraint regex
            if (valueRegex.getSlicing() === Slicing.SUBSTR && allSubstrings.length !== 0) {
                console.log("used cached substrings");
                valueRegex.setSubstrings(allSubstrings.slice());   // clone array
            } else if (valueRegex.getSlicing() === Slicing.SPACES && spacesSubstrings.length !== 0) {
                valueRegex.setSubstrings(spacesSubstrings.slice());   // clone array
            } else {
                console.log("regenerated substrings");
                valueRegex.genSubstrings(data);
            }
        } else {
            console.log("regenerated substrings 2");
            valueRegex.genSubstrings(data.slice(highestLowIndex, lowestHighIndex));
        }

        valueRegex.applySimilarity();

        // gen best match for value regex
        return valueRegex.getBestMatch(data);
    }

    /**
     * Find the best match for a string in a list of previously generated regex matches
     * @param data: string
     * @param genMatches: string[]
     * @return {bestMatch: {target: string, rating: number}, ratings: {target: string, rating: number}[]}
     */
    public static bestMatch(data:string, genMatches:string[]) {
        let matches = StringSimilarity.findBestMatch(data, genMatches);
        return matches.bestMatch;
    }

    /**
     * Get the best matching string from substrings for previously generated regex matches
     * @param substrings: {index: number, element: string}[]
     * @param regexMatches: string[]
     * @return {match: {index: number, element: string}, rating: number}
     */
    public static approxMatching(substrings:{index:number, element:string}[], regexMatches:string[]): {match: {index: number, element: string}, rating: number} {
        let highestRating = 0;
        let highestRatingElem = {index:-1, element: ""};
        substrings.every(element => {
            let bestMatch = RegexHandler.bestMatch(element.element, regexMatches);
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