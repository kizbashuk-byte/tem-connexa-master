import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(request: Request) {
  const data = await request.json();
  fs.appendFileSync("/tmp/browser-debug.log", JSON.stringify(data) + "\n");
  console.log("\n\n--- BROWSER EVIDENCE FROM USER'S CHROME ---");
  console.log(JSON.stringify(data, null, 2));
  console.log("-------------------------------------------\n\n");
  return NextResponse.json({ success: true });
}
