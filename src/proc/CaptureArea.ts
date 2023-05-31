import { RegexGroup } from './regex/RegexGroup';

export class CaptureArea {
    private id = 0;
    private width = 0;
    private height = 0;
    private top = 0;
    private left = 0;
    private regexGroups: RegexGroup[] = [];
    private enabled: boolean;

    public constructor(
        width: number,
        height: number,
        top: number,
        left: number
    ) {
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

    public setId(id: number) {
        this.id = id;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(width: number) {
        this.width = width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height: number) {
        this.height = height;
    }

    public getTop(): number {
        return this.top;
    }

    public setTop(top: number) {
        this.top = top;
    }

    public getLeft(): number {
        return this.left;
    }

    public setLeft(left: number) {
        this.left = left;
    }

    public getRegexGroups(): RegexGroup[] {
        return this.regexGroups;
    }

    public getStreamScales(
        stream: MediaStream,
        previewWidth: number,
        previewHeight: number
    ): { width: number; height: number; left: number; top: number } {
        const streamWidth = stream.getVideoTracks()[0].getSettings().width;
        const streamHeight = stream.getVideoTracks()[0].getSettings().height;

        const scaleX = streamWidth! / previewWidth;
        const scaleY = streamHeight! / previewHeight;

        const scaledWidth = this.width * scaleX;
        const scaledHeight = this.height * scaleY;
        const scaledLeft = this.left * scaleX;
        const scaledTop = this.top * scaleY;

        return {
            width: scaledWidth,
            height: scaledHeight,
            left: scaledLeft,
            top: scaledTop,
        };
    }
}
