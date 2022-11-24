import { ConstraintRegex } from "./ConstraintRegex";
import { ValueRegex } from "./ValueRegex";

export class RegexGroup {
    private id: number = 0;
    private valueRegex?: ValueRegex;
    private constraintRegex: ConstraintRegex[] = [];
    private enabled: boolean = true;
}