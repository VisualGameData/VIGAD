import RandExp from "randexp";

export abstract class Regex {
    private id: number = 0;
    private regex: RegExp = new RegExp("");

    /**
     * Generate matches for this regex
     * @param max: number
     * @return string[]
     */
    private genMatches(max:number) {
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