import { Regex } from "./Regex";

export class ConstraintRegex extends Regex {
    private location: Location = Location.BEFORE;

}

export enum Location {
    BEFORE = "Before",
    AFTER = "After"
}