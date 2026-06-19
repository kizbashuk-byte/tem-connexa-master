#!/bin/bash
source .env.local
for col in original_time live_time event_is_delayed delay_message ai_knowledge_base auto_reply_enabled; do
  RES=$(curl -s -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/events?select=${col}&limit=1")
  if echo "$RES" | grep -q "42703"; then
    echo "$col: NOT FOUND"
  else
    echo "$col: EXISTS"
  fi
done
