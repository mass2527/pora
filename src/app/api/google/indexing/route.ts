import { getUser } from "~/lib/auth";
import { google } from "googleapis";
import { z } from "zod";

const schame = z.object({
  url: z.string().url(),
  type: z.union([z.literal("URL_UPDATED"), z.literal("URL_DELETED")]),
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { url, type } = schame.parse(body);

    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/indexing"],
      undefined
    );
    const tokens = await jwtClient.authorize();
    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type,
        }),
      }
    );

    const result = await response.json();
    return new Response(result, { status: 500 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
