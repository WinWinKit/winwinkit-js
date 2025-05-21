import createClient from "openapi-fetch";
import type {paths} from "../types/schema";
import { UserRewardsGranted, User, UserWithdrawCreditsResult, AppStoreOfferCode, AppStoreSubscription } from "../types";

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

    /**
   * Fetch a user.
   * @param appUserId The app user id to fetch the user for.
   * @returns The user.
   */
  public async user({appUserId}: {appUserId: string}): Promise<User | null> {
    const client = this.createClient();
    const {data, error} = await client.GET('/users/{app_user_id}', {
      params: {
        path: {app_user_id: appUserId},
        header: this.createAuthHeader()
      }
    });
    if (error) {
      if (error.errors.pop()?.status === 404) {
        return null;
      }
      throw error;
    }
    return data.data.user;
  }

  /**
   * Create or update a user.
   * @param appUserId The app user id to create the user for.
   * @param isPremium Whether the user is a premium user. Optional.
   * @param firstSeenAt The date and time the user was first seen. Optional.
   * @param lastSeenAt The date and time the user was last seen. Optional.
   * @param metadata The metadata of the user. Optional.
   * @returns The created or updated user.
   */
  public async createOrUpdateUser({ appUserId, isPremium, firstSeenAt, lastSeenAt, metadata }: {
    appUserId: string,
    isPremium?: boolean,
    firstSeenAt?: Date,
    lastSeenAt?: Date,
    metadata?: Record<string, never>
  }): Promise<User> {
    const client = this.createClient();
    const {data, error} = await client.POST('/users', {
      params: {
      header: this.createAuthHeader(),
      },
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
    return data.data.user;
  }

  /**
   * Claim a referral code.
   * @param appUserId The app user id to claim the code for.
   * @param code The code to claim.
   * @returns The updated user and granted rewards.
   */
  public async claimReferralCode({appUserId, code}: { appUserId: string, code: string }): Promise<{
    user: User,
    rewardsGranted: UserRewardsGranted
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/users/{app_user_id}/claim/referral-code', {
      params: {
        path: {app_user_id: appUserId},
        header: this.createAuthHeader(),
      },
      body: {
        code: code,
      },
    });
    if (error)
      throw error;
    return {user: data.data.user, rewardsGranted: data.data.rewards_granted};
  }

  /**
   * Withdraw credits.
   * @param appUserId The app user id to withdraw the credits for.
   * @param key The key of the reward to withdraw.
   * @param amount The amount to withdraw.
   * @returns The updated user and withdraw result.
   */
  public async withdrawCredits({appUserId, key, amount}: { appUserId: string, key: string, amount: number }): Promise<{
    user: User,
    withdrawResult: UserWithdrawCreditsResult
  }> {
    const client = this.createClient();
    const {data, error} = await client.POST('/users/{app_user_id}/rewards/withdraw', {
      params: {
        path: {app_user_id: appUserId},
        header: this.createAuthHeader(),
      },
      body: {
        key: key,
        amount: amount,
      },
    });
    if (error)
      throw error;
    return {user: data.data.user, withdrawResult: data.data.withdraw_result};
  }

  /**
   * Fetch an offer code and subscription from the App Store.
   * @param offerCodeId The offer code id to fetch.
   * @returns The offer code and subscription.
   */
  public async offerCode({offerCodeId}: {offerCodeId: string}): Promise<{
    offerCode: AppStoreOfferCode,
    subscription: AppStoreSubscription
  }> {
    const client = this.createClient();
    const {data, error} = await client.GET('/app-store/offer-codes/{offer_code_id}', {
      params: {
        path: {offer_code_id: offerCodeId},
        header: this.createAuthHeader(),
      },
    });
    if (error)
      throw error;
    return {offerCode: data.data.offerCode, subscription: data.data.subscription};
  }

  private createClient() {
    return createClient<paths>({baseUrl: "https://api-v1.winwinkit.com"})
  }

  private createAuthHeader() {
    return {
      'x-api-key': this.apiKey,
    }
  }
}
