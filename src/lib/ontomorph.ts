// src/lib/ontomorph.ts
import { DTP } from "@ontomorph/dtp-sdk";

const dtpApiKey = process.env.DTP_API_KEY || "dtp_live_demo_key";
const holonApiKey = process.env.HOLON_API_KEY || "holon_demo_key";
const holonUrl = process.env.NEXT_PUBLIC_HOLON_API_URL || "https://holon-api.ontomorph.com";

/**
 * Global DTP platform client configured with default environment keys
 */
export const dtpServer = new DTP({
  apiKey: dtpApiKey,
  holonApiUrl: holonUrl,
  holonApiKey: holonApiKey,
});

/**
 * Creates an Ontomorph DTP SDK client instance tailored to a specific user session.
 * Used for user-authenticated operations like API key lifecycle management.
 */
export function getOntomorphClientForUser(sessionToken?: string) {
  return new DTP({
    apiKey: dtpApiKey,
    sessionToken: sessionToken,
    holonApiUrl: holonUrl,
    holonApiKey: holonApiKey,
  });
}

/**
 * Helper to connect to a digital twin instance using a user's grant token
 */
export async function connectTwinWithGrantToken(grantToken: string) {
  try {
    return await dtpServer.twins.connect(grantToken);
  } catch (error) {
    console.warn("Ontomorph twin connect fallback (demo mode):", error);
    return null;
  }
}