export class DesktopVideoStream {
    private static instance: DesktopVideoStream;

    private currentSelectedSource: Object;
    private desktopCaptureSources: Object[];
    private isLoadingScreensAndApplications: boolean;

    /**
     * private constructor to prevent multiple instances
     */
    private constructor() {
        this.currentSelectedSource = {};
        this.desktopCaptureSources = [];
        this.isLoadingScreensAndApplications = false;
    }

    /**
     * Create a singeltone instance of the DesktopVideoStream class
     */
    static getInstance(): DesktopVideoStream {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * Get all available sources
     */
    async fetchAllMediaStreams(): Promise<void> {
        await this.getDesktopCaptureSources();
    }

    /**
     * Get all the video sources available on the system
     */
    async getDesktopCaptureSources(): Promise<void> {
        // Get the available video sources
        this.desktopCaptureSources = await (
            window as any
        ).electronAPI.getMedia();
    }

    /**
     * Get the stream source
     * @param {string} source
     */
    async getStreamSource(source: any): Promise<MediaStream> {
        const constraints: Object = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        };
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    setCurrentSelectedSource(source: Object): void {
        this.currentSelectedSource = source;
    }

    setIsLoadingScreensAndApplications(value: boolean): void {
        this.isLoadingScreensAndApplications = value;
    }

    getIsLoadingScreensAndApplications(): boolean {
        return this.isLoadingScreensAndApplications;
    }

    getCurrentSelectedSource(): Object {
        return this.currentSelectedSource;
    }

    getMainScreenSource(): Object {
        // TODO: fix this
        return this.desktopCaptureSources[0];
    }

    //   TODO: comments you should always refetch the sources
    getOnlyScreenSources(): Object[] {
        // Maybe recall the getDesktopCaptureSources() method here
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'screen'
        );
    }

    getOnlyApplicationSources(): Object[] {
        // Maybe recall the getDesktopCaptureSources() method here
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'window'
        );
    }

    getScreenAndApplicationSources(): Object[] {
        // Maybe recall the getDesktopCaptureSources() method here
        return this.desktopCaptureSources;
    }
}
