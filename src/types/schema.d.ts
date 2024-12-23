/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/referral/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Referral User
         * @description Creates a new referral user in the database.
         */
        post: operations["createReferralUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/referral/users/{app_user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Referral User
         * @description Returns the referral user by id.
         */
        get: operations["getReferralUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Referral User
         * @description Update the referral user with new properties.
         */
        patch: operations["updateReferralUser"];
        trace?: never;
    };
    "/referral/users/{app_user_id}/codes/{code}/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Claim Referral Code
         * @description Claim referral code for the referral user.
         */
        post: operations["claimReferralUserCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/referral/users/{app_user_id}/push-token/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Push Token
         * @description Register push token for referral user.
         */
        post: operations["registerReferralUserPushToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/referral/users/{app_user_id}/push-token/unregister": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Unregister Push Token
         * @description Unregisters push token for referral user.
         */
        delete: operations["unregisterReferralUserPushToken"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Create a new referral user. */
        ReferralUserCreate: components["schemas"]["ReferralUser"];
        /** @description Update a referral user with new properties. */
        ReferralUserUpdate: {
            /**
             * @description Is the user premium.
             * @example true
             */
            is_premium?: boolean | null;
            /**
             * @description Date when the user was first seen at.
             * @example 2020-11-20T08:47:11.782+00:00
             */
            first_seen_at?: string | null;
            /**
             * @description Date when the user was last seen at.
             * @example 2020-11-20T08:47:11.782+00:00
             */
            last_seen_at?: string | null;
            /**
             * @description Metadata object.
             * @example {
             *       "key": "value"
             *     }
             */
            metadata?: Record<string, never> | unknown[];
        };
        /** @description Register a new push token for a referral user. */
        RegisterReferralUserPushToken: {
            /**
             * @description Device identifier where the push token was received.
             * @example 0dfae4b5-1a2d-4c1e-9152-5297086a161c
             */
            device_id: string;
            /**
             * @description Push token value.
             * @example 0dfae4b5-1a2d-4c1e-9152-5297086a161c
             */
            token: string;
            /**
             * @description Push token type. Must be 'apns' or 'fcm'.
             * @example apns
             */
            token_type: string;
        };
        /** @description Unregister push token for a referral user. */
        UnregisterReferralUserPushToken: {
            /**
             * @description Device identifier where the push token was received.
             * @example 0dfae4b5-1a2d-4c1e-9152-5297086a161c
             */
            device_id: string;
        };
        /** @description Referral user. */
        ReferralUser: {
            app_user_id: components["schemas"]["ReferralUserAppUserId"];
            /**
             * @description Is the user premium.
             * @example true
             */
            is_premium?: boolean | null;
            /**
             * @description Date when the user was first seen at.
             * @example 2020-11-20T08:47:11.782+00:00
             */
            first_seen_at?: string | null;
            /**
             * @description Date when the user was last seen at.
             * @example 2020-11-20T08:47:11.782+00:00
             */
            last_seen_at?: string | null;
            /**
             * @description Metadata object.
             * @example {
             *       "key": "value"
             *     }
             */
            metadata?: Record<string, never> | unknown[];
        };
        /**
         * @description The unique identifier of the referral user.
         * @example 821fae4b5-1a2d-4c1e-9152-5297086a161c
         */
        ReferralUserAppUserId: string;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createReferralUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The referral user to create. */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ReferralUserCreate"];
            };
        };
        responses: {
            /** @description The referral user was created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferralUser"];
                };
            };
        };
    };
    getReferralUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The referral user. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferralUser"];
                };
            };
        };
    };
    updateReferralUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The referral user properties to update. */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ReferralUserUpdate"];
            };
        };
        responses: {
            /** @description The referral user. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferralUser"];
                };
            };
        };
    };
    claimReferralUserCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The referral user. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferralUser"];
                };
            };
        };
    };
    registerReferralUserPushToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The referral user to create. */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RegisterReferralUserPushToken"];
            };
        };
        responses: {
            /** @description Empty content. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    unregisterReferralUserPushToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The referral user to create. */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UnregisterReferralUserPushToken"];
            };
        };
        responses: {
            /** @description Empty content. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
