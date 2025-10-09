import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const categoryPrompts: Record<string, string> = {
  nba_player: "Transform this person into a professional NBA basketball player in action, wearing a team jersey with a number, dunking or dribbling on a basketball court during a game. Photorealistic, high quality.",
  baseball_player: "Transform this person into a professional baseball player in action, wearing a team uniform, batting or pitching on a baseball field. Photorealistic, high quality.",
  footballer: "Transform this person into a professional soccer player in action, wearing a team kit, kicking or celebrating on a soccer field. Photorealistic, high quality.",
  meme: "Transform this photo into a funny meme with exaggerated expressions and humorous elements.",
  wedding: "Transform this person into a wedding photo, dressed in elegant wedding attire, beautiful ceremony setting. Romantic, high quality.",
  boyfriend: "Add a handsome boyfriend standing next to this person, romantic couple photo, natural and realistic.",
  girlfriend: "Add a beautiful girlfriend standing next to this person, romantic couple photo, natural and realistic.",
  sketch: "Transform this photo into a detailed pencil sketch drawing, artistic black and white style.",
  paint: "Transform this photo into a beautiful oil painting, artistic brush strokes, vibrant colors.",
  graduation: "Transform this person into a graduation photo, wearing cap and gown, happy celebration.",
  famous_location: "Place this person at the Eiffel Tower in Paris, tourist photo style, realistic and natural.",
  with_celebrity: "Add a famous celebrity standing next to this person, red carpet style photo, professional quality.",
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

    const { imageUrl, category, customPrompt } = await req.json();

    // Check credits
    const { data: creditData } = await supabaseClient
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!creditData || creditData.balance < 10000) {
      throw new Error('Insufficient credits');
    }

    // Build prompt
    const prompt = category === 'custom' ? customPrompt : categoryPrompts[category];
    const fullPrompt = `${prompt}\n\nBase this transformation on the following image:`;

    // Call Lovable AI Gateway for image generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: fullPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }

    // Deduct credits
    await supabaseClient
      .from('credits')
      .update({ balance: creditData.balance - 10000 })
      .eq('user_id', user.id);

    // Save generation record
    await supabaseClient
      .from('generations')
      .insert({
        user_id: user.id,
        category,
        prompt: fullPrompt,
        image_url: generatedImageUrl,
        original_image_url: imageUrl,
        cost: 10000,
        status: 'completed'
      });

    return new Response(
      JSON.stringify({ imageUrl: generatedImageUrl }),
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
