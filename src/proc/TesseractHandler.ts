import { createWorker, createScheduler, Worker } from 'tesseract.js';
import { CaptureArea } from './CaptureArea';

export class TesseractHandler {
    private static instance: TesseractHandler;
    private worker: Worker[];
    private enabledCaptureAreas: CaptureArea[];
    private running: boolean;

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.worker = [];
        this.enabledCaptureAreas = [];
        this.running = false;
    }

    /**
     * This function gets the singelton instance of TesseractHandler.ts
     *
     * @return TesseractHandler
     */
    public static getInstance(): TesseractHandler {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    public isRunning(): boolean {
        return this.running;
    }

    public setRunning(running: boolean): void {
        this.running = running;
    }

    /**
     * Enable a capture area so it will be considered by tesseract
     * @param ca
     * @return void
     */
    public async enableCaptureArea(ca: CaptureArea): Promise<void> {
        this.enabledCaptureAreas.push(ca);
        await this.addWorker();
    }

    /**
     * Add and initialize a new tesseract worker
     * @return void
     */
    public async addWorker(): Promise<void> {
        const worker = createWorker({ cachePath: '.' });
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        this.worker.push(worker);
        console.log('added tesseract worker');
    }

    /**
     * Remove a tesseract worker
     * @return void
     */
    public removeWorker(): void {
        this.worker.pop();
    }

    /**
     * Run tesseract image-to-text-recognition on the given stream utilizing the enabled capture areas
     * @param stream: MediaStream
     * @return Promise<void>
     */
    public async run(
        stream: MediaStream,
        callback: Function,
        previewWidth: number,
        previewHeight: number
    ): Promise<void> {
        if (!this.running) {
            this.running = true;
            await new Promise(async () => {
                const scheduler = createScheduler();
                this.worker.forEach((worker) => {
                    scheduler.addWorker(worker);
                });

                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // on first frame loaded
                video.addEventListener('loadeddata', () => {
                    // generate image from video
                    const canvas = document.createElement('canvas');
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    canvas
                        .getContext('2d')!
                        .drawImage(
                            video,
                            0,
                            0,
                            video.videoWidth,
                            video.videoHeight
                        );
                    const img = canvas.toDataURL('image/png');
                    video.pause();

                    // create rectangles from capture areas
                    const rectangles = this.enabledCaptureAreas.map((ca) => {
                        let streamScales = ca.getStreamScales(
                            stream,
                            previewWidth,
                            previewHeight
                        );
                        return {
                            id: ca.getId(),
                            left: streamScales.left,
                            top: streamScales.top,
                            width: streamScales.width,
                            height: streamScales.height,
                        };
                    });

                    // run tesseract
                    (async () => {
                        const results: { ca_id: number; data: string }[] = [];
                        await Promise.all(
                            rectangles.map((rectangle) =>
                                scheduler
                                    .addJob('recognize', img, { rectangle })
                                    .then((x) =>
                                        results.push({
                                            ca_id: rectangle.id,
                                            data: x.data.text,
                                        })
                                    )
                            )
                        );
                        callback(results);
                        this.running = false;
                    })();
                });
            });
        }
    }
}
