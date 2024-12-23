import createClient from "openapi-fetch";
import type {paths} from "../types/schema";
import {ReferralUser, ReferralUserCreate, ReferralUserUpdate} from "../types";

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

    public async referralUser(): Promise<ReferralUser | null> {
        const client = this.createClient();
        const {data, error} = await client.GET('/referral/users/{app_user_id}', {
            path: {app_user_id: this.appUserId},
            headers: this.createHeaders()
        });
        if (error) {
            if (error.status === 404) {
                return null;
            }
            throw error;
        }
        return data;
    }

    public async createReferralUser({referralUser}: {
        referralUser: ReferralUserCreate
    }): Promise<ReferralUser | undefined> {
        const client = this.createClient();
        const {data, error} = await client.POST('/referral/users', {
            headers: this.createHeaders(),
            body: referralUser,
        });
        if (error)
            throw error;
        return data;
    }

    public async updateReferralUser({referralUser}: {referralUser: ReferralUserUpdate}): Promise<ReferralUser | undefined> {
        const client = this.createClient();
        const {data, error} = await client.PATCH('/referral/users/{app_user_id}', {
            path: {app_user_id: this.appUserId},
            headers: this.createHeaders(),
            body: referralUser,
        });
        if (error)
            throw error;
        return data;
    }

    public async claimReferralCode({code}: {code: string}): Promise<ReferralUser | undefined> {
        const client = this.createClient();
        const {data, error} = await client.POST('/referral/users/{app_user_id}/codes/{code}/claim', {
            path: {app_user_id: this.appUserId, code: code},
            headers: this.createHeaders(),
        });
        if (error)
            throw error;
        return data;
    }

    private createClient() {
        return createClient<paths>({baseUrl: "https://api.winwinkit.com"})
    }

    private createHeaders() {
        return {
            'Content-Type': 'application/json',
            'X-API-Key': this.projectKey,
        }
    }
}
