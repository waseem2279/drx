"use strict";

import {
  onCall,
  HttpsError,
  CallableRequest,
} from "firebase-functions/v2/https";
import axios from "axios";
import { defineSecret } from "firebase-functions/params";

const turnKeyId = defineSecret("TURN_KEY_ID");
const turnApiToken = defineSecret("TURN_API_TOKEN");

/**
 * Generate TURN credentials for the WebRTC connection.
 */
export const getTurnCredentials = onCall(
  { secrets: [turnKeyId, turnApiToken] },

  async (request: CallableRequest<{}>) => {
    if (!turnKeyId || !turnApiToken) {
      throw new Error(
        "TURN_KEY_ID and TURN_API_TOKEN must be defined in environment variables.",
      );
    }

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Only authenticated users can request TURN credentials.",
      );
    }

    try {
      const response = await axios.post(
        `https://rtc.live.cloudflare.com/v1/turn/keys/${turnKeyId.value()}/credentials/generate-ice-servers`,
        { ttl: 3600 }, // 1 hour
        {
          headers: {
            Authorization: `Bearer ${turnApiToken.value()}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data; // contains `iceServers`
    } catch (err: any) {
      console.error(
        "TURN credential generation failed:",
        err?.response?.data || err.message,
      );
      throw new HttpsError(
        "internal",
        "TURN credentials could not be generated.",
      );
    }
  },
);
