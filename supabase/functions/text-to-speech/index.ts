import { corsHeaders } from '../_shared/cors.ts';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Default professional voice

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY environment variable is not set');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid ElevenLabs API key');
      } else if (response.status === 429) {
        throw new Error('ElevenLabs API rate limit exceeded');
      } else {
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});