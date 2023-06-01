import { CaptureArea } from './CaptureArea';
import { RegexHandler } from './regex/RegexHandler';
import { TesseractHandler } from './TesseractHandler';
import { MatchedElement } from './MatchedElement';
import DOMPurify from 'dompurify';
import useSession from '@/composables/useSession/useSession';
import useUploadData from '@/composables/useUploadData/useUploadData';
import useAPI from '@/composables/useAPI/useAPI';
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
        const ca = new CaptureArea(width, height, top, left);
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
                if (!currentSelectedSource.value) {
                    return;
                }

                this.tesseractHandler.run(
                    currentSelectedSource.value,
                    async (result: { ca_id: number; data: string }[]) => {
                        result.forEach(
                            (value: { ca_id: number; data: string }) => {
                                const ca = this.getCaptureArea(value.ca_id);
                                const regexGrp = ca.getRegexGroups()[0];
                                const constraintRegex0 =
                                    regexGrp.getConstraintRegex()[0];
                                const constraintRegex1 =
                                    regexGrp.getConstraintRegex()[1];

                                if (
                                    constraintRegex0.getRegex().toString() ===
                                        '/(?:)/' &&
                                    constraintRegex1.getRegex().toString() ===
                                        '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex()
                                    );
                                } else if (
                                    constraintRegex0.getRegex().toString() ===
                                    '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        constraintRegex1
                                    );
                                } else if (
                                    constraintRegex1.getRegex().toString() ===
                                    '/(?:)/'
                                ) {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        constraintRegex0
                                    );
                                } else {
                                    this.regexHandler.findValue(
                                        value.data,
                                        regexGrp.getValueRegex(),
                                        constraintRegex0,
                                        constraintRegex1
                                    );
                                }
                            }
                        );
                        // Upload Data to the server
                        const { sessionToken, isSessionActive } = useSession();
                        const { post } = useAPI();
                        const {
                            streamData,
                            streamRegexAndCaptureAreaSettings,
                        } = useUploadData();

                        // Check whether the user streamData or streamRegexAndCaptureAreaSettings is enabled and if the session is active at all
                        if (
                            isSessionActive.value &&
                            (streamData.value ||
                                streamRegexAndCaptureAreaSettings.value)
                        ) {
                            for (let i = 0; i < result.length; i++) {
                                const sanitizedData = DOMPurify.sanitize(
                                    result[i].data
                                ); // Sanitize the data

                                const caBestMatch: MatchedElement =
                                    this.getCaptureArea(result[i].ca_id)
                                        .getRegexGroups()[0]
                                        .getValueRegex()
                                        .getLastBestMatch();

                                await post(
                                    `session/${encodeURIComponent(
                                        sessionToken.value
                                    )}/data/ca/${result[i].ca_id}`,
                                    {
                                        rating: caBestMatch.rating,
                                        match: {
                                            index: caBestMatch.match.index,
                                            element: sanitizedData,
                                        },
                                    }
                                );
                            }
                        } else {
                            console.log(
                                'Session is not active or streamData/streamRegexAndCaptureAreaSettings is not enabled'
                            );
                        }
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
