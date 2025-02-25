import createClient from "openapi-fetch";
import type {paths} from "../types/schema";
import {GrantedRewards, ReferralUser, ReferralUserCreate, ReferralUserUpdate, WithdrawCredits} from "../types";

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
      params: {
        path: {app_user_id: this.appUserId},
        headers: this.createHeaders()
      }
    });
    if (error) {
      if (error.errors.pop()?.status === 404) {
        return null;
      }
      throw error;
    }
    return data.data.referral_user;
  }

  /**
   * Create a new referral user.
   * @param referralUser The referral user to create.
   * @returns The created referral user.
   */
  public async createReferralUser({referralUser}: {
    referralUser: ReferralUserCreate
  }): Promise<ReferralUser> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users', {
      headers: this.createHeaders(),
      body: referralUser,
    });
    if (error)
      throw error;
    return data.data.referral_user;
  }

  /**
   * Update a referral user.
   * @param referralUser The referral user to update.
   * @returns The updated referral user.
   */
  public async updateReferralUser({referralUser}: { referralUser: ReferralUserUpdate }): Promise<ReferralUser> {
    const client = this.createClient();
    const {data, error} = await client.PATCH('/referral/users/{app_user_id}', {
      params: {
        path: {app_user_id: this.appUserId},
        headers: this.createHeaders(),
        body: referralUser,
      }
    });
    if (error)
      throw error;
    return data.data.referral_user;
  }

  /**
   * Claim a referral code.
   * @param code The code to claim.
   * @returns The updated referral user and granted rewards.
   */
  public async claimReferralCode({code}: { code: string }): Promise<{
    referralUser: ReferralUser,
    grantedRewards: GrantedRewards
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users/{app_user_id}/codes/{code}/claim', {
      params: {
        path: {app_user_id: this.appUserId, code: code},
        headers: this.createHeaders(),
      }
    });
    if (error)
      throw error;
    return {referralUser: data.data.referral_user, grantedRewards: data.data.granted_rewards};
  }

  /**
   * Withdraw credits.
   * @param key The key of the reward to withdraw.
   * @param amount The amount to withdraw.
   * @returns The updated referral user and withdraw credits result.
   */
  public async withdrawCredits({key, amount}: { key: string, amount: number }): Promise<{
    referralUser: ReferralUser,
    withdrawCredits: WithdrawCredits
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users/{app_user_id}/rewards/credit/{key}/withdraw', {
      params: {
        path: {app_user_id: this.appUserId, key: key},
        headers: this.createHeaders(),
      }
    });
    if (error)
      throw error;
    return {referralUser: data.data.referral_user, withdrawCredits: data.data.withdraw_result};
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
