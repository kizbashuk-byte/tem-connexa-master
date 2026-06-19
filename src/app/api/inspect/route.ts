import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const testColumns = [
    "id", "conversation_id", "tenant_id", "sender_type",
    "message_type", "content", "created_at", "provider_message_id"
  ];

  const existingColumns = [];
  const missingColumns = [];

  for (const col of testColumns) {
    const { error } = await supabase.from("messages").select(col).limit(1);
    if (!error) {
      existingColumns.push(col);
    } else {
      missingColumns.push(col);
    }
  }

  return NextResponse.json({
    table: "messages",
    verified_existing_columns: existingColumns,
    missing_columns: missingColumns,
  });
}
