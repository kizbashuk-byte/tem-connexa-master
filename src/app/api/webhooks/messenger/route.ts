import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("FACEBOOK WEBHOOK VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify this is a webhook from a Facebook Page
    if (body.object === "page") {
      // Iterate over each entry. There may be multiple if batched.
      body.entry?.forEach((entry: any) => {
        // Gets the body of the webhook event
        const webhook_event = entry.messaging?.[0];
        
        // Log the payload for now as requested (no processing yet)
        console.log("FACEBOOK WEBHOOK PAYLOAD RECEIVED:", JSON.stringify(webhook_event, null, 2));
      });

      // Returns a '200 OK' response to all requests
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("FACEBOOK WEBHOOK ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
