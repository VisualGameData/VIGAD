import { createWorker } from 'tesseract.js';
import { CaptureArea } from './CaptureArea';

export class TesseractHandler {
    private stream?: MediaStream;
    private worker: Worker[] = [];
    private enabledCaptureAreas: CaptureArea[] = [];
}