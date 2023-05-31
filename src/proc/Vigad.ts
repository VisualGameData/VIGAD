import { CaptureArea } from './CaptureArea';
import { RegexHandler } from './regex/RegexHandler';
import { TesseractHandler } from './TesseractHandler';
import useStreamHandler from '@/composables/useStreamHandler/useStreamHandler';

export class Vigad {
    private static instance: Vigad;
    private tesseractHandler: TesseractHandler;
    private regexHandler: RegexHandler;
    private captureAreas: CaptureArea[];
    private tesseractInterval!: NodeJS.Timeout;
    private intervalRunning: boolean;

    private previewWidth: number;
    private previewHeight: number;

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.tesseractHandler = TesseractHandler.getInstance();
        this.regexHandler = RegexHandler.getInstance();
        this.captureAreas = [];
        this.intervalRunning = false;
        this.previewWidth = 0;
        this.previewHeight = 0;
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

    public setPreviewWidth(width: number): void {
        this.previewWidth = width;
    }

    public setPreviewHeight(height: number): void {
        this.previewHeight = height;
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
                const { currentSelectedSource } = useStreamHandler();
                this.tesseractHandler.run(
                    currentSelectedSource.value!,
                    (result: { ca_id: number; data: string }[]) => {
                        result.forEach(
                            (
                                value: { ca_id: number; data: string },
                                index: number
                            ) => {
                                let ca = this.getCaptureArea(value.ca_id);
                                let regexGrp = ca.getRegexGroups()[0];
                                if (
                                    regexGrp
                                        .getConstraintRegex()[0]
                                        .getRegex()
                                        .toString() === '/(?:)/' &&
                                    regexGrp
                                        .getConstraintRegex()[1]
                                        .getRegex()
                                        .toString() === '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex()
                                    );
                                } else if (
                                    regexGrp
                                        .getConstraintRegex()[0]
                                        .getRegex()
                                        .toString() === '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        regexGrp.getConstraintRegex()[1]
                                    );
                                } else if (
                                    regexGrp
                                        .getConstraintRegex()[1]
                                        .getRegex()
                                        .toString() === '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        regexGrp.getConstraintRegex()[0]
                                    );
                                } else {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        regexGrp.getConstraintRegex()[0],
                                        regexGrp.getConstraintRegex()[1]
                                    );
                                }
                            }
                        );
                    },
                    this.previewWidth,
                    this.previewHeight
                );
            }, 500);
            this.intervalRunning = true;
            console.log('started tesseract');
        }
    }

    public stopTesseract(): void {
        clearInterval(this.tesseractInterval);
        this.intervalRunning = false;
        console.log('stopped tesseract');
    }
}
