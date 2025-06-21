const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Health check for this route
router.get('/ping', (req, res) => {
  res.json({ status: 'tts route is alive' });
});

// POST /api/tts - Text-to-Speech endpoint
router.post('/', async (req, res) => {
  try {
    console.log('Received TTS request');
    const { text, userId } = req.body;

    // Validate
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Text is required for text-to-speech conversion',
      });
    }

    // Limit text length to prevent abuse
    const limitedText = text.substring(0, 5000);
    
    // Use ElevenLabs API for high-quality TTS
    // If you have an ElevenLabs API key, you can use it here
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Default professional voice
    
    if (ELEVENLABS_API_KEY) {
      try {
        console.log('Using ElevenLabs for TTS');
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
              text: limitedText,
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.75,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength,
        });
        
        res.send(Buffer.from(audioBuffer));
        return;
      } catch (elevenlabsError) {
        console.error('ElevenLabs TTS error:', elevenlabsError);
        // Fall back to Google TTS if ElevenLabs fails
      }
    }

    // Fallback to Google Text-to-Speech API
    console.log('Using Google TTS as fallback');
    const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
    
    // Check if Google credentials are available
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const client = new TextToSpeechClient();
      
      const request = {
        input: { text: limitedText },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };
      
      const [response] = await client.synthesizeSpeech(request);
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': response.audioContent.length,
      });
      
      res.send(response.audioContent);
      return;
    }
    
    // If no TTS service is available, return an error
    res.status(503).json({
      error: 'Text-to-speech service is not configured',
    });
    
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({
      error: err.message || 'Failed to convert text to speech',
    });
  }
});

module.exports = router;