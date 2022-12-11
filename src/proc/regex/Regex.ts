import RandExp from "randexp";

export abstract class Regex {
    protected id: number;
    protected regex: RegExp;
    protected matching: Matching;
    protected slicing: Slicing;
    protected similarity: Similarity;
    protected matchesNum: number;

    public constructor () {
        this.id = 0;
        this.regex = new RegExp("");
        this.matching = Matching.EXACT;
        this.slicing = Slicing.SUBSTR;
        this.similarity = Similarity.NONE;
        this.matchesNum = 0;
    }

    /**
     * Generate matches for this regex
     * @param max: number
     * @return string[]
     */
    public genMatches(max:number) {
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
        console.log("generated matches for regex: " + this.id);
        return regLev0;
    }
}

export enum Matching {
    EXACT = "Exact",
    APPROX = "Approximate"
}

export enum Slicing {
    SUBSTR = "Substring",
    SPACES = "Spaces",
    ENTIRE_STR = "Entire String"
}

export enum Similarity {
    NONE = "None",
    NUM_LET = "Numbers To Letters",
    LET_NUM = "Letters To Numbers"
}