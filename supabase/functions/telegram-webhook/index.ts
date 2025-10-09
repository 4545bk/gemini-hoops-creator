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

    const update = await req.json();
    console.log('Telegram webhook:', JSON.stringify(update));

    // Handle callback query (button clicks)
    if (update.callback_query) {
      const { callback_query } = update;
      const data = callback_query.data;
      const [action, paymentId] = data.split('_');

      if (action === 'approve' || action === 'decline') {
        const newStatus = action === 'approve' ? 'approved' : 'declined';

        // Get payment details
        const { data: payment } = await supabaseClient
          .from('payments')
          .select('*, profiles!inner(email, full_name)')
          .eq('id', paymentId)
          .single();

        if (!payment) {
          throw new Error('Payment not found');
        }

        // Update payment status
        await supabaseClient
          .from('payments')
          .update({ status: newStatus })
          .eq('id', paymentId);

        // If approved, add credits
        if (action === 'approve') {
          const { data: creditData } = await supabaseClient
            .from('credits')
            .select('balance')
            .eq('user_id', payment.user_id)
            .single();

          if (creditData) {
            await supabaseClient
              .from('credits')
              .update({ balance: creditData.balance + payment.credit_amount })
              .eq('user_id', payment.user_id);
          }
        }

        // Update Telegram message
        const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const statusEmoji = action === 'approve' ? '✅' : '❌';
        const statusText = action === 'approve' ? 'APPROVED' : 'DECLINED';

        await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/editMessageText`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: callback_query.message.chat.id,
              message_id: callback_query.message.message_id,
              text: `${callback_query.message.text}\n\n${statusEmoji} *Status: ${statusText}*`,
              parse_mode: 'Markdown'
            })
          }
        );

        // Answer callback query
        await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callback_query.id,
              text: `Payment ${statusText.toLowerCase()} successfully!`
            })
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
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
