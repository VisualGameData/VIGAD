import { CaptureArea } from './CaptureArea';
import { RegexHandler } from './regex/RegexHandler';
import { TesseractHandler } from './TesseractHandler';
import { MatchedElement } from './MatchedElement';
import useSession from '@/composables/useSession/useSession';
import useUploadData from '@/composables/useUploadData/useUploadData';
import useAPI from '@/composables/useAPI/useAPI';
import useStreamHandler from '@/composables/useStreamHandler/useStreamHandler';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

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
     * Add a new capture area with the specified dimensions and position.
     * @param {number} width - The width of the capture area.
     * @param {number} height - The height of the capture area.
     * @param {number} top - The top position of the capture area.
     * @param {number} left - The left position of the capture area.
     * @returns {number} - The ID of the newly added capture area.
     */
    public async addCaptureArea(
        width = 100,
        height = 100,
        top = 0,
        left = 0
    ): Promise<string> {
        const ca = new CaptureArea(width, height, top, left);

        ca.setId(this.generateCaptureAreaId());
        this.captureAreas.push(ca);
        await this.tesseractHandler.enableCaptureArea(ca);

        return ca.getId();
    }

    /**
     * Generates a unique capture area ID.
     * @returns {string} - The generated capture area ID.
     */
    public generateCaptureAreaId(): string {
        const {
            numbers,
            lowercaseLetters,
            uppercaseLetters,
            lowercaseLettersRule,
            uppercaseLettersRule,
            numbersRule,
            generateValidToken,
        } = useTokenGenerator();

        let caId: string;

        do {
            caId = generateValidToken(
                6,
                numbers + lowercaseLetters + uppercaseLetters,
                {
                    lowercase: lowercaseLettersRule,
                    uppercase: uppercaseLettersRule,
                    number: numbersRule,
                }
            );
        } while (this.captureAreaIdExists(caId));

        return caId;
    }

    /**
     * Check if the capture area ID already exists.
     * @param {string} caId - The capture area ID to check.
     * @returns {boolean} - Returns true if the capture area ID exists, false otherwise.
     */
    private captureAreaIdExists(caId: string): boolean {
        return this.captureAreas.some((area) => area.getId() === caId);
    }

    /**
     * Renames a capture area by updating its ID.
     * @param {string} oldId - The old ID of the capture area.
     * @param {string} newId - The new ID to assign to the capture area.
     * @returns {boolean} - Returns true if the renaming was successful, false otherwise.
     */
    public renameCaptureArea(oldId: string, newId: string): boolean {
        // Find the index of the capture area object with the oldId
        const captureAreaIndex = this.captureAreas.findIndex(
            (area) => area.getId() === oldId
        );

        // If the capture area with the oldId doesn't exist, return false
        if (captureAreaIndex === -1) {
            return false;
        }

        // Check if any other capture area already uses the newId
        const isIdAlreadyUsed = this.captureAreas.some(
            (area, index) =>
                index !== captureAreaIndex && area.getId() === newId
        );

        // If the newId is already used, return false
        if (isIdAlreadyUsed) {
            return false;
        }

        // Update the id of the capture area
        // TODO: this causes the problem that the input field is not focused anymore
        this.captureAreas[captureAreaIndex].setId(newId);

        // Return true to indicate successful renaming
        return true;
    }

    /**
     * Delete the capture area with the specified ID.
     * @param {number} id - The ID of the capture area to delete.
     * @returns {boolean} - Returns true if the capture area is successfully deleted, false otherwise.
     */
    public deleteCaptureArea(id: string): boolean {
        const index = this.captureAreas.findIndex((ca) => ca.getId() === id);

        if (index !== -1) {
            this.captureAreas.splice(index, 1);
            this.tesseractHandler.removeCaptureAreaAndWorker(id);
            return true;
        } else {
            console.log('Capture area not found');
            return false;
        }
    }

    /**
     * Retrieves the CaptureArea object with the specified id.
     * @param {number} id - The id of the capture area to retrieve.
     * @returns {CaptureArea} The CaptureArea object with the specified id.
     * @throws {Error} If a capture area with the specified id is not found.
     */
    public getCaptureArea(id: string): CaptureArea {
        // Find the capture area with the given id
        const captureArea = this.captureAreas.find(
            (area) => area.getId() === id
        );

        if (!captureArea) {
            throw new Error(`Capture area with id ${id} not found.`);
        }

        return captureArea;
    }

    /**
     * Gets all capture area
     * @return CaptureArea
     */
    public getAllCaptureAreas(): CaptureArea[] {
        return this.captureAreas;
    }

    /**
     * Checks if the capture area ID is unique.
     * @param {string} id - The capture area ID to check.
     * @returns {boolean} - Returns true if the capture area ID is unique, false otherwise.
     */
    public CaptureAreaIdIsUnique(id: string): boolean {
        return !this.captureAreas.some((area) => area.getId() === id);
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
                    async (result: { ca_id: string; data: string }[]) => {
                        result.forEach(
                            (value: { ca_id: string; data: string }) => {
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
                        const {
                            sessionToken,
                            isSessionActive,
                            encodeSessionToken,
                        } = useSession();
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
                                const caBestMatch: MatchedElement =
                                    this.getCaptureArea(result[i].ca_id)
                                        .getRegexGroups()[0]
                                        .getValueRegex()
                                        .getLastBestMatch();

                                // Encode the session token if it is not already encoded as a fallback
                                encodeSessionToken();

                                await post(
                                    `session/${sessionToken.value}/data/ca/${result[i].ca_id}`,
                                    {
                                        rating: caBestMatch.rating,
                                        match: {
                                            index: caBestMatch.match.index,
                                            element: result[i].data,
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
