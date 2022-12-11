import { createWorker, createScheduler, Worker } from 'tesseract.js';
import { CaptureArea } from './CaptureArea';

export class TesseractHandler {
    private static instance: TesseractHandler;
    private worker: Worker[];
    private enabledCaptureAreas: CaptureArea[];

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.worker = [];
        this.enabledCaptureAreas = [];
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

    public async enableCaptureArea(ca: CaptureArea): Promise<void> {
        this.enabledCaptureAreas.push(ca);
        await this.addWorker();
    }

    public async addWorker(): Promise<void> {
        const worker = createWorker({cachePath: "."});
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        this.worker.push(worker);
        console.log("added tesseract worker");
    }

    public removeWorker(): void {
        this.worker.pop();
    }

    public async run(stream:MediaStream): Promise<void> {
        while (true) {
            await new Promise(async (resolve) => {
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
                    canvas.getContext('2d')!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    const img = canvas.toDataURL('image/png');
                    video.pause();

                    // create rectangles from capture areas
                    const rectangles = this.enabledCaptureAreas.map((ca) => {
                        return {
                            left: ca.getLeft(),
                            top: ca.getTop(),
                            width: ca.getWidth(),
                            height: ca.getHeight(),
                        };
                    });

                    // run tesseract
                    (async () => {
                        const results = await Promise.all(rectangles.map((rectangle) => (
                            scheduler.addJob('recognize', img, {rectangle}).then((x) => console.log(x.data.text))
                        )));
                    })();
                });
            });
        }
    }
}