import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-telegram-bot-api-secret-token',
};

// Verify the request is from Telegram using secret token
function verifyTelegramRequest(req: Request): boolean {
  const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
  const expectedToken = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  
  if (!expectedToken) {
    console.error('TELEGRAM_WEBHOOK_SECRET not configured');
    return false;
  }
  
  if (!secretToken || secretToken !== expectedToken) {
    console.error('Invalid or missing Telegram secret token');
    return false;
  }
  
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request is from Telegram
    if (!verifyTelegramRequest(req)) {
      console.error('Telegram webhook verification failed');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const update = await req.json();
    console.log('Telegram webhook received:', JSON.stringify(update));

    // Handle callback query (button clicks)
    if (update.callback_query) {
      const { callback_query } = update;
      const data = callback_query.data;
      
      // Validate callback data format
      if (typeof data !== 'string' || !data.includes('_')) {
        console.error('Invalid callback data format:', data);
        return new Response(
          JSON.stringify({ error: 'Invalid callback data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const [action, paymentId] = data.split('_');
      
      // Validate action
      if (action !== 'approve' && action !== 'decline') {
        console.error('Invalid action:', action);
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate paymentId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!paymentId || !uuidRegex.test(paymentId)) {
        console.error('Invalid payment ID format:', paymentId);
        return new Response(
          JSON.stringify({ error: 'Invalid payment ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const newStatus = action === 'approve' ? 'approved' : 'declined';

      // Get payment details
      const { data: payment, error: paymentError } = await supabaseClient
        .from('payments')
        .select('*, profiles!inner(email, full_name)')
        .eq('id', paymentId)
        .single();

      if (paymentError || !payment) {
        console.error('Payment not found:', paymentId, paymentError);
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if payment is still pending (prevent replay attacks)
      if (payment.status !== 'pending') {
        console.log('Payment already processed:', paymentId, payment.status);
        return new Response(
          JSON.stringify({ ok: true, message: 'Payment already processed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update payment status
      const { error: updateError } = await supabaseClient
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);
        
      if (updateError) {
        console.error('Failed to update payment:', updateError);
        throw new Error('Failed to update payment status');
      }

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
