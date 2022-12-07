import { StreamHandler } from './StreamHandler';

export class Vigad {
    private static instance: Vigad;
    private streamHandler: StreamHandler;

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.streamHandler = StreamHandler.getInstance();
    }

    /**
     * This function gets the singelton instance of the StreamHandler
     *
     * @returns the singelton instance of the StreamHandler
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
}
