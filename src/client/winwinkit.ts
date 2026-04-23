import createClient from "openapi-fetch";
import {
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
  private readonly baseUrl: string;

  /**
   * Construct a new WinWinKit instance.
   * @param apiKey The API key to configure the client with.
   * @param baseUrl The base URL to configure the client with. Optional.
   */
  constructor({ apiKey, baseUrl }: { apiKey: string; baseUrl?: string }) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || "https://api.winwinkit.com";
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
   * @param isTrial Whether the user is a trial user. Optional.
   * @param firstSeenAt The date and time the user was first seen. Optional.
   * @param metadata The metadata of the user. Optional.
   * @param stripeCustomerId The stripe customer id of the user. Optional.
   * @returns An object containing either the created/updated user or errors information.
   */
  public async createOrUpdateUser({
    appUserId,
    isPremium,
    isTrial,
    firstSeenAt,
    metadata,
    stripeCustomerId,
  }: {
    appUserId: string;
    isPremium?: boolean;
    isTrial?: boolean;
    firstSeenAt?: Date;
    metadata?: Record<string, never>;
    stripeCustomerId?: string;
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
        is_trial: isTrial,
        first_seen_at: firstSeenAt?.toISOString(),
        metadata,
        stripe_customer_id: stripeCustomerId,
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
   * @param operationId The operation id to withdraw the credits for. Optional.
   * @returns An object containing either the updated user and withdrawal result, or errors information.
   */
  public async withdrawCredits({
    appUserId,
    key,
    amount,
    operationId,
  }: {
    appUserId: string;
    key: string;
    amount: number;
    operationId?: string | null;
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
          operation_id: operationId,
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
   * Register an App Store transaction.
   * Registers the mapping between a user and their Apple originalTransactionId.
   * @param appUserId The app user id to register the transaction for.
   * @param originalTransactionId Apple's originalTransactionId from StoreKit.
   * @param appAccountToken StoreKit 2 appAccountToken UUID. Optional.
   * @returns An object containing errors information, or null errors on success.
   */
  public async registerAppStoreTransaction({
    appUserId,
    originalTransactionId,
    appAccountToken,
  }: {
    appUserId: string;
    originalTransactionId: string;
    appAccountToken?: string | null;
  }): Promise<{ errors: ErrorObject[] | null }> {
    const client = this.createClient();
    const { error } = await client.POST(
      "/users/{app_user_id}/transactions/app-store",
      {
        params: {
          path: { app_user_id: appUserId },
          header: this.createAuthHeader(),
        },
        body: {
          original_transaction_id: originalTransactionId,
          app_account_token: appAccountToken,
        },
      },
    );
    if (error) return { errors: error.errors };
    return { errors: null };
  }

  /**
   * Register a Google Play transaction.
   * Registers the mapping between a user and their Google Play purchaseToken.
   * @param appUserId The app user id to register the transaction for.
   * @param purchaseToken Google Play's purchaseToken from the purchase flow.
   * @param obfuscatedExternalAccountId Value set in BillingFlowParams.setObfuscatedAccountId() — used for better matching. Optional.
   * @returns An object containing errors information, or null errors on success.
   */
  public async registerGooglePlayTransaction({
    appUserId,
    purchaseToken,
    obfuscatedExternalAccountId,
  }: {
    appUserId: string;
    purchaseToken: string;
    obfuscatedExternalAccountId?: string | null;
  }): Promise<{ errors: ErrorObject[] | null }> {
    const client = this.createClient();
    const { error } = await client.POST(
      "/users/{app_user_id}/transactions/google-play",
      {
        params: {
          path: { app_user_id: appUserId },
          header: this.createAuthHeader(),
        },
        body: {
          purchase_token: purchaseToken,
          obfuscated_external_account_id: obfuscatedExternalAccountId,
        },
      },
    );
    if (error) return { errors: error.errors };
    return { errors: null };
  }

  /**
   * Grant a reward.
   * Note: only granting for credit rewards is currently supported.
   * Note: secret API key must be used with this operation.
   * @param appUserId The app user id to grant the reward for.
   * @param key The key of the reward to grant.
   * @param operationId The operation id to grant the reward for. Optional.
   * @returns An object containing either the updated user and granted rewards, or errors information.
   */
  public async grantReward({
    appUserId,
    key,
    operationId,
  }: {
    appUserId: string;
    key: string;
    operationId?: string | null;
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
      "/users/{app_user_id}/rewards/grant",
      {
        params: {
          path: { app_user_id: appUserId },
          header: this.createAuthHeader(),
        },
        body: {
          key: key,
          operation_id: operationId,
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

  private createClient() {
    return createClient<paths>({ baseUrl: this.baseUrl });
  }

  private createAuthHeader() {
    return {
      "x-api-key": this.apiKey,
    };
  }
}
