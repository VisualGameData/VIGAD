// Stream handler
export class StreamHandler {
    private static instance: StreamHandler;

    private currentSelectedSource: Object;
    private desktopCaptureSources: Object[];
    private allMediaStreams: MediaStream[];
    private isLoadingScreensAndApplications: boolean;

    /**
     * private constructor to prevent multiple instances
     */
    private constructor() {
        this.currentSelectedSource = {};
        this.desktopCaptureSources = [];
        this.allMediaStreams = [];
        this.isLoadingScreensAndApplications = false;
    }

    /**
     * Create a singeltone instance of the DesktopVideoStream class
     */
    static getInstance(): StreamHandler {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * Get all available sources
     */
    private async fetchAllMediaStreams(): Promise<void> {
        this.isLoadingScreensAndApplications = true;
        // Get the available video sources
        this.desktopCaptureSources = await (
            window as any
        ).electronAPI.getMedia();
        this.isLoadingScreensAndApplications = false;
    }

    public setIsLoadingScreensAndApplications(value: boolean): void {
        this.isLoadingScreensAndApplications = value;
    }

    public getIsLoadingScreensAndApplications(): boolean {
        return this.isLoadingScreensAndApplications;
    }

    public getCurrentSelectedSource(): Object {
        return this.currentSelectedSource;
    }

    public async getMainScreenSource(): Promise<Object> {
        await this.fetchAllMediaStreams();
        // TODO: fix this
        return this.desktopCaptureSources[0];
    }

    public async setDefaultVideoStream(): Promise<void> {
        const mainScreenSource: any = await this.getMainScreenSource();

        // MediaStream Constraints
        const constraints: any = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: mainScreenSource.id,
                },
            },
        };

        // Set the main video
        await this.setCurrentSelectedSource(
            await navigator.mediaDevices.getUserMedia(constraints)
        );
    }

    public async setCurrentSelectedSource(source: MediaStream) {
        if (source === this.currentSelectedSource) return;

        this.currentSelectedSource = source;

        const videoElement: HTMLVideoElement | null =
            document.querySelector('#mainVideo');

        videoElement!.srcObject = source;
    }

    public async getAllMediaStreams(): Promise<MediaStream[]> {
        this.allMediaStreams = [];
        await this.fetchAllMediaStreams();
        // Loop through all sources and set the MediaStream to video nodes
        Array.from(this.desktopCaptureSources).forEach(async (element: any) => {
            const constraints: any = {
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: element.id,
                    },
                },
            };

            this.allMediaStreams.push(
                await navigator.mediaDevices.getUserMedia(constraints)
            );
        });
        return this.allMediaStreams;
    }

    public async getOnlyScreenSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'screen'
        );
    }

    public async getOnlyApplicationSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'window'
        );
    }

    async getScreenAndApplicationSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources;
    }
}
