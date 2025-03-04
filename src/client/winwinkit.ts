import createClient from "openapi-fetch";
import type {paths} from "../types/schema";
import { GrantedRewards, ReferralUser, WithdrawCredits } from "../types";

/**
 * WinWinKit Client
 */
export default class WinWinKit {
  private readonly apiKey: string;

  /**
   * Construct a new WinWinKit instance.
   * @param apiKey The API key to configure the client with.
   */
  constructor({
    apiKey,
  }: {
    apiKey: string;
  }) {
    this.apiKey = apiKey;
  }

  public async referralUser({appUserId}: {appUserId: string}): Promise<ReferralUser | null> {
    const client = this.createClient();
    const {data, error} = await client.GET('/referral/users/{app_user_id}', {
      params: {
        path: {app_user_id: appUserId},
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
   * @param appUserId The app user id to create the referral user for.
   * @param isPremium Whether the user is a premium user. Optional.
   * @param firstSeenAt The date and time the user was first seen. Optional.
   * @param lastSeenAt The date and time the user was last seen. Optional.
   * @param metadata The metadata of the referral user. Optional.
   * @returns The created referral user.
   */
  public async createReferralUser({ appUserId, isPremium, firstSeenAt, lastSeenAt, metadata }: {
    appUserId: string,
    isPremium?: boolean,
    firstSeenAt?: Date,
    lastSeenAt?: Date,
    metadata?: Record<string, never>
  }): Promise<ReferralUser> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users', {
      headers: this.createHeaders(),
      body: {
        app_user_id: appUserId,
        is_premium: isPremium,
        first_seen_at: firstSeenAt?.toISOString(),
        last_seen_at: lastSeenAt?.toISOString(),
        metadata,
      },
    });
    if (error)
      throw error;
    return data.data.referral_user;
  }

  /**
   * Update a referral user.
   * @param appUserId The app user id to update the referral user for.
   * @param isPremium Whether the user is a premium user. Optional.
   * @param firstSeenAt The date and time the user was first seen. Optional.
   * @param lastSeenAt The date and time the user was last seen. Optional.
   * @param metadata The metadata of the referral user. Optional.
   * @returns The updated referral user.
   */
  public async updateReferralUser({ appUserId, isPremium, firstSeenAt, lastSeenAt, metadata }: {
    appUserId: string,
    isPremium?: boolean,
    firstSeenAt?: Date,
    lastSeenAt?: Date,
    metadata?: Record<string, never>
  }): Promise<ReferralUser> {
    const client = this.createClient();
    const {data, error} = await client.PATCH('/referral/users/{app_user_id}', {
      params: {
        path: {app_user_id: appUserId},
        headers: this.createHeaders(),
        body: {
          is_premium: isPremium,
          first_seen_at: firstSeenAt?.toISOString(),
          last_seen_at: lastSeenAt?.toISOString(),
          metadata,
        },
      }
    });
    if (error)
      throw error;
    return data.data.referral_user;
  }

  /**
   * Claim a referral code.
   * @param appUserId The app user id to claim the code for.
   * @param code The code to claim.
   * @returns The updated referral user and granted rewards.
   */
  public async claimReferralCode({appUserId, code}: { appUserId: string, code: string }): Promise<{
    referralUser: ReferralUser,
    grantedRewards: GrantedRewards
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users/{app_user_id}/codes/{code}/claim', {
      params: {
        path: {app_user_id: appUserId, code: code},
        headers: this.createHeaders(),
      }
    });
    if (error)
      throw error;
    return {referralUser: data.data.referral_user, grantedRewards: data.data.granted_rewards};
  }

  /**
   * Withdraw credits.
   * @param appUserId The app user id to withdraw the credits for.
   * @param key The key of the reward to withdraw.
   * @param amount The amount to withdraw.
   * @returns The updated referral user and withdraw credits result.
   */
  public async withdrawCredits({appUserId, key, amount}: { appUserId: string, key: string, amount: number }): Promise<{
    referralUser: ReferralUser,
    withdrawCredits: WithdrawCredits
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/referral/users/{app_user_id}/rewards/credit/{key}/withdraw', {
      params: {
        path: {app_user_id: appUserId, key: key},
        headers: this.createHeaders(),
        body: {amount: amount},
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
      'X-API-Key': this.apiKey,
    }
  }
}
