// Stream handler
export class StreamHandler {
    private static instance: StreamHandler;

    private currentSelectedSource: Object;
    private desktopCaptureSources: Object[];
    private allMediaStreams: MediaStream[];
    private isLoadingScreensAndApplications: boolean;

    /**
     * Create a private constructor to prevent multiple instances
     */
    private constructor() {
        this.currentSelectedSource = {};
        this.desktopCaptureSources = [];
        this.allMediaStreams = [];
        this.isLoadingScreensAndApplications = false;
    }

    /**
     * This function gets the singelton instance of the StreamHandler
     *
     * @returns the singelton instance of the StreamHandler
     */
    public static getInstance(): StreamHandler {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * This function fetches all media streams via the electron desktopCapture API
     *
     * @returns void
     */
    private async fetchAllMediaStreams(): Promise<void> {
        this.isLoadingScreensAndApplications = true;
        // Get the available video sources
        this.desktopCaptureSources = await (
            window as any
        ).electronAPI.getMedia();
        this.isLoadingScreensAndApplications = false;
    }

    /**
     * This function is for setting the loading state
     *
     * @param value - set isLoadingScreensAndApplications to value new boolean value
     * @returns void
     */
    public setIsLoadingScreensAndApplications(value: boolean): void {
        this.isLoadingScreensAndApplications = value;
    }

    /**
     * This function returns a boolean which indicates if the StreamHandler is currently loading screens and applications
     *
     * @returns boolean value if the screens and applications are loading
     */
    public getIsLoadingScreensAndApplications(): boolean {
        return this.isLoadingScreensAndApplications;
    }

    /**
     * This function sets the current selected source as the new main video source
     *
     * @returns the current selected source Object
     */
    public getCurrentSelectedSource(): Object {
        return this.currentSelectedSource;
    }

    /**
     * This function returns the media stream from the given source object
     *
     * @param source - Source object
     * @returns a MediaStream from the given source as a Promise
     */
    public async getMediaStreamFromSource(source: any): Promise<MediaStream> {
        // MediaStream Constraints
        const constraints: any = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        };

        return await navigator.mediaDevices.getUserMedia(constraints);
    }

    /**
     * This function sets the main screen of the user as the fault video source
     *
     * @returns a the main screen of the user as a source via a Promise
     */
    public async getMainScreenSource(): Promise<Object> {
        await this.fetchAllMediaStreams();
        // TODO: fix this
        return this.desktopCaptureSources[0];
    }

    /**
     * This function sets the main monitor screen of the user as the default video source
     *
     * @returns only a Promise
     */
    public async setDefaultVideoStream(): Promise<void> {
        const mainScreenSource: any = await this.getMainScreenSource();

        const mediaStream = await this.getMediaStreamFromSource(
            mainScreenSource
        );

        // Set the main video
        await this.setCurrentSelectedSource(mediaStream);
    }

    /**
     * This function sets the current selected source as the new main video source
     *
     * @param source - MediaStream object
     * @returns a MediaStreams as a Promise
     */
    public async setCurrentSelectedSource(source: MediaStream) {
        if (source === this.currentSelectedSource) return;

        this.currentSelectedSource = source;

        const videoElement: HTMLVideoElement | null =
            document.querySelector('#mainVideo');

        videoElement!.srcObject = source;

        // console.log('MediaStream properties');
        // console.log(
        //     'Device ID',
        //     source.getVideoTracks()[0].getSettings().deviceId
        // );
        // console.log(
        //     'Framerate',
        //     source.getVideoTracks()[0].getSettings().frameRate
        // );
        // console.log('Height', source.getVideoTracks()[0].getSettings().height);
        // console.log('Width', source.getVideoTracks()[0].getSettings().width);
        // console.log(
        //     'Apsectratio',
        //     source.getVideoTracks()[0].getSettings().aspectRatio
        // );
    }

    /**
     * This function returns all available Screen and Application Objects
     *
     * @returns an array of all available MediaStreams as a Promise
     */
    public async getAllMediaStreams(): Promise<MediaStream[]> {
        this.allMediaStreams = [];
        await this.fetchAllMediaStreams();

        // Loop through all sources and set the MediaStream to video nodes
        Array.from(this.desktopCaptureSources).forEach(async (element: any) => {
            this.populateMediaStreamsArray(element);
        });

        return this.allMediaStreams;
    }

    /**
     * This function will populate the allMediaStreams array with all available MediaStreams
     *
     * @param source - source object
     * @returns only a Promise
     */
    private async populateMediaStreamsArray(source: any): Promise<void> {
        const constraints: any = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        };

        this.allMediaStreams.push(
            await navigator.mediaDevices.getUserMedia(constraints)
        );
    }

    /**
     * This function will return a Mediastream via a specific index which is given as a parameter
     *
     * @param index - values to search from the allMediaStreams array
     * @returns a MediaStream from the given source as a Promise
     */
    public async getSpecificMediaStreams(index: number): Promise<MediaStream> {
        return this.allMediaStreams[index];
    }

    /**
     * This function returns all available Screen Objects
     *
     * @returns an array of all available Screen Objects as a Promise
     */
    public async getOnlyScreenSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'screen'
        );
    }

    /**
     * This function returns all available Application Objects
     *
     * @returns an array of all available Application Objects as a Promise
     */
    public async getOnlyApplicationSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources.filter(
            (source: any) =>
                source.id.substring(0, source.id.indexOf(':')) === 'window'
        );
    }

    /**
     * This function returns all available Application and Screen Objects
     *
     * @returns an array of all available Application and Screen Objects as a Promise
     */
    async getScreenAndApplicationSources(): Promise<Object[]> {
        await this.fetchAllMediaStreams();
        return this.desktopCaptureSources;
    }
}
