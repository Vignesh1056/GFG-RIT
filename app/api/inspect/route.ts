import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch with Anon Key
  const { data: events, error: eventsError } = await supabase.from('events').select('*');
  const { data: internships, error: internshipsError } = await supabase.from('internships').select('*');

  return NextResponse.json({
    events: { data: events, error: eventsError },
    internships: { data: internships, error: internshipsError },
  });
}
