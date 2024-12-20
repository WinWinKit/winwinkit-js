/**
 * WinWinKit Client
 */
export default class WinWinKit {
    private readonly appUserId: string;
    private readonly projectKey: string;

    /**
     * Construct a new WinWinKit instance.
     * @param appUserId Unique identifier of your app's user.
     * @param projectKey The project key you wish to use to configure ``WinWinKit``.
     */
    constructor({
                    appUserId,
                    projectKey,
                }: {
        appUserId: string;
        projectKey: string;
    }) {
        this.appUserId = appUserId;
        this.projectKey = projectKey;
    }
}
