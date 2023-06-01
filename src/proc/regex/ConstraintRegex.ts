import { Regex, Matching } from './Regex';

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

    public setLocation(location: Location): void {
        this.location = location;
    }
}

export enum Location {
    BEFORE = 'Before',
    AFTER = 'After',
}
