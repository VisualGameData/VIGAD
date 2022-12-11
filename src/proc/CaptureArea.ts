import { RegexGroup } from "./regex/RegexGroup";

export class CaptureArea {
    private id: number = 0;
    private width: number = 0;
    private height: number = 0;
    private top: number = 0;
    private left: number = 0;
    private regexGroups: RegexGroup[] = [];
    private enabled: boolean;

    public constructor(width:number, height:number, top:number, left:number) {
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.regexGroups.push(new RegexGroup());
        this.enabled = true;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id:number) {
        this.id = id;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(width:number) {
        this.width = width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height:number) {
        this.height = height;
    }

    public getTop(): number {
        return this.top;
    }

    public setTop(top:number) {
        this.top = top;
    }

    public getLeft(): number {
        return this.left;
    }

    public setLeft(left:number) {
        this.left = left;
    }

    public getRegexGroups(): RegexGroup[] {
        return this.regexGroups;
    }
}