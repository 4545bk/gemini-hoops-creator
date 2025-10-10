import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { receiptUrl, amount } = await req.json();

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount,
        receipt_url: receiptUrl,
        status: 'pending',
        credit_amount: 1000000, // 10000 credits for 25 birr
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Send to Telegram for approval
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = '-4705261885'; // Your Telegram group/channel ID
    
    console.log('Telegram bot token exists:', !!telegramBotToken);
    console.log('Sending to chat ID:', telegramChatId);
    
    if (!telegramBotToken) {
      console.error('TELEGRAM_BOT_TOKEN not found in environment');
      throw new Error('Telegram bot token not configured');
    }
    
    const message = `
🔔 *New Payment Submission*

👤 User: ${profile?.full_name || 'Unknown'}
📧 Email: ${profile?.email}
💰 Amount: ${amount} Birr
🎫 Payment ID: \`${payment.id}\`

📸 Receipt: [View Receipt](${receiptUrl})

Please review and approve/decline this payment.
    `.trim();

    const keyboard = {
      inline_keyboard: [
        [
          { text: '✅ Approve', callback_data: `approve_${payment.id}` },
          { text: '❌ Decline', callback_data: `decline_${payment.id}` }
        ]
      ]
    };

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: keyboard
        })
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram error:', errorText);
    } else {
      const telegramData = await telegramResponse.json();
      // Store telegram message ID
      await supabaseClient
        .from('payments')
        .update({ telegram_message_id: telegramData.result.message_id.toString() })
        .eq('id', payment.id);
    }

    return new Response(
      JSON.stringify({ success: true, paymentId: payment.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
