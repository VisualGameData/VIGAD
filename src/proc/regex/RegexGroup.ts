import { ConstraintRegex, Location } from './ConstraintRegex';
import { ValueRegex } from './ValueRegex';

export class RegexGroup {
    private id: number;
    private valueRegex: ValueRegex;
    private constraintRegex: ConstraintRegex[] = [];
    private enabled: boolean;

    public constructor() {
        this.id = 0;
        this.valueRegex = new ValueRegex();
        this.constraintRegex.push(new ConstraintRegex());
        this.constraintRegex.push(new ConstraintRegex());
        this.constraintRegex[1].setLocation(Location.AFTER);
        this.enabled = true;
    }

    public getValueRegex(): ValueRegex {
        return this.valueRegex;
    }

    public getConstraintRegex(): ConstraintRegex[] {
        return this.constraintRegex;
    }
}
