import { CaptureArea } from './CaptureArea';
import { StreamHandler } from './StreamHandler';
import { TesseractHandler } from './TesseractHandler';

export class Vigad {
    private static instance: Vigad;
    private streamHandler: StreamHandler;
    private tesseractHandler: TesseractHandler;
    private captureAreas: CaptureArea[];
    private tesseractInterval!: NodeJS.Timeout;
    private intervalRunning: boolean;

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.streamHandler = StreamHandler.getInstance();
        this.tesseractHandler = TesseractHandler.getInstance();
        this.captureAreas = [];
        this.intervalRunning = false;
    }

    /**
     * This function gets the singelton instance of Vigad.ts
     *
     * @return Vigad
     */
    public static getInstance(): Vigad {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    public getStreamHandlerInstance(): StreamHandler {
        return this.streamHandler;
    }

    /**
     * Add a new capture area. Returns the id of the capture area.
     * @param width
     * @param height
     * @param top
     * @param left
     * @return index: number
     */
    public addCaptureArea(
        width: number,
        height: number,
        top: number,
        left: number
    ): number {
        let ca = new CaptureArea(width, height, top, left);
        this.captureAreas.push(ca);
        ca.setId(this.captureAreas.length - 1);
        this.tesseractHandler.enableCaptureArea(ca);
        return ca.getId();
    }

    /**
     * Delete a capture area by id
     * @param id
     * @return void
     */
    public deleteCaptureArea(id: number): void {
        this.captureAreas.splice(id, 1);
        this.tesseractHandler.removeWorker();
    }

    /**
     * Get a capture area by id
     * @param id
     * @return CaptureArea
     */
    public getCaptureArea(id: number): CaptureArea {
        return this.captureAreas[id];
    }

    /**
     * Gets all capture area
     * @return CaptureArea
     */
    public getAllCaptureAreas(): CaptureArea[] {
        return this.captureAreas;
    }

    public startTesseract(): void {
        if (!this.intervalRunning) {
            this.tesseractInterval = setInterval(() => {
                this.tesseractHandler.run(this.streamHandler.getCurrentSelectedSource())
            }, 500);
            this.intervalRunning = true;
            console.log("started tesseract");
        }
    }

    public stopTesseract(): void {
        clearInterval(this.tesseractInterval);
        this.intervalRunning = false;
        console.log("stopped tesseract");
    }
}
