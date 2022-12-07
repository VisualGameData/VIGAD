import { RegexGroup } from "./regex/RegexGroup";

export class CaptureArea {
    private id: number = 0;
    private width: number = 0;
    private height: number = 0;
    private top: number = 0;
    private left: number = 0;
    private regexGroups: RegexGroup[] = [];
    private enabled: boolean = true;

    public constructor(width:number, height:number, top:number, left:number) {
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id:number) {
        this.id = id;
    }
}