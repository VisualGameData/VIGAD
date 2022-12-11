import { Regex, Matching, Slicing, Similarity } from "./Regex";

export class ConstraintRegex extends Regex {
    private location: Location;

    public constructor() {
        super();
        this.location = Location.BEFORE;
        this.matching = Matching.APPROX;
    }

    public getLocation(): Location {
        return this.location;
    }

}

export enum Location {
    BEFORE = "Before",
    AFTER = "After"
}