import createClient from "openapi-fetch";
import {
  AppStoreOfferCode,
  AppStoreSubscription,
  ErrorObject,
  User,
  UserRewardsGranted,
  UserWithdrawCreditsResult,
} from "../types";
import type { paths } from "../types/schema";

/**
 * WinWinKit Client
 */
export default class WinWinKit {
  private readonly apiKey: string;

  /**
   * Construct a new WinWinKit instance.
   * @param apiKey The API key to configure the client with.
   */
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch a user.
   * @param appUserId The app user id to fetch the user for.
   * @returns An object containing either the user or errors information.
   */
  public async fetchUser({
    appUserId,
  }: {
    appUserId: string;
  }): Promise<
    { user: User | null; errors: null } | { user: null; errors: ErrorObject[] }
  > {
    const client = this.createClient();
    const { data, error } = await client.GET("/users/{app_user_id}", {
      params: {
        path: { app_user_id: appUserId },
        header: this.createAuthHeader(),
      },
    });
    if (error) {
      if (error.errors.pop()?.status === 404)
        return { user: null, errors: null };
      return { user: null, errors: error.errors };
    }
    return { user: data.data.user, errors: null };
  }

  /**
   * Create or update a user.
   * @param appUserId The app user id to create the user for.
   * @param isPremium Whether the user is a premium user. Optional.
   * @param firstSeenAt The date and time the user was first seen. Optional.
   * @param metadata The metadata of the user. Optional.
   * @returns An object containing either the created/updated user or errors information.
   */
  public async createOrUpdateUser({
    appUserId,
    isPremium,
    firstSeenAt,
    metadata,
  }: {
    appUserId: string;
    isPremium?: boolean;
    firstSeenAt?: Date;
    metadata?: Record<string, never>;
  }): Promise<
    { user: User; errors: null } | { user: null; errors: ErrorObject[] }
  > {
    const client = this.createClient();
    const { data, error } = await client.POST("/users", {
      params: {
        header: this.createAuthHeader(),
      },
      body: {
        app_user_id: appUserId,
        is_premium: isPremium,
        first_seen_at: firstSeenAt?.toISOString(),
        metadata,
      },
    });
    if (error) return { user: null, errors: error.errors };
    return { user: data.data.user, errors: null };
  }

  /**
   * Claim a code.
   * @param appUserId The app user id to claim the code for.
   * @param code The code to claim.
   * @returns An object containing either the updated user and granted rewards, or errors information.
   */
  public async claimCode({
    appUserId,
    code,
  }: {
    appUserId: string;
    code: string;
  }): Promise<
    | {
        user: User;
        rewardsGranted: UserRewardsGranted;
        errors: null;
      }
    | {
        user: null;
        rewardsGranted: null;
        errors: ErrorObject[];
      }
  > {
    const client = this.createClient();
    const { data, error } = await client.POST(
      "/users/{app_user_id}/claim-code",
      {
        params: {
          path: { app_user_id: appUserId },
          header: this.createAuthHeader(),
        },
        body: {
          code: code,
        },
      },
    );
    if (error)
      return { user: null, rewardsGranted: null, errors: error.errors };
    return {
      user: data.data.user,
      rewardsGranted: data.data.rewards_granted,
      errors: null,
    };
  }

  /**
   * Withdraw credits.
   * @param appUserId The app user id to withdraw the credits for.
   * @param key The key of the reward to withdraw.
   * @param amount The amount to withdraw.
   * @returns An object containing either the updated user and withdrawal result, or errors information.
   */
  public async withdrawCredits({
    appUserId,
    key,
    amount,
  }: {
    appUserId: string;
    key: string;
    amount: number;
  }): Promise<
    | {
        user: User;
        withdrawResult: UserWithdrawCreditsResult;
        errors: null;
      }
    | { user: null; withdrawResult: null; errors: ErrorObject[] }
  > {
    const client = this.createClient();
    const { data, error } = await client.POST(
      "/users/{app_user_id}/rewards/withdraw-credits",
      {
        params: {
          path: { app_user_id: appUserId },
          header: this.createAuthHeader(),
        },
        body: {
          key: key,
          amount: amount,
        },
      },
    );
    if (error)
      return { user: null, withdrawResult: null, errors: error.errors };
    return {
      user: data.data.user,
      withdrawResult: data.data.withdraw_result,
      errors: null,
    };
  }

  /**
   * Fetch an offer code and subscription from the App Store.
   * @param offerCodeId The offer code id to fetch.
   * @returns An object containing either the App Store offer code and subscription, or errors information.
   */
  public async fetchOfferCode({
    offerCodeId,
  }: {
    offerCodeId: string;
  }): Promise<
    | {
        offerCode: AppStoreOfferCode;
        subscription: AppStoreSubscription;
        errors: null;
      }
    | { offerCode: null; subscription: null; errors: ErrorObject[] }
  > {
    const client = this.createClient();
    const { data, error } = await client.GET(
      "/app-store/offer-codes/{offer_code_id}",
      {
        params: {
          path: { offer_code_id: offerCodeId },
          header: this.createAuthHeader(),
        },
      },
    );
    if (error)
      return {
        offerCode: null,
        subscription: null,
        errors: error.errors,
      };
    return {
      offerCode: data.data.offer_code,
      subscription: data.data.subscription,
      errors: null,
    };
  }

  private createClient() {
    return createClient<paths>({ baseUrl: "https://api.winwinkit.com" });
  }

  private createAuthHeader() {
    return {
      "x-api-key": this.apiKey,
    };
  }
}
