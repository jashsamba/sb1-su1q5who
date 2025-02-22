import { HfInference } from '@huggingface/inference';

const HF_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

// Secure singleton instance
let hf: HfInference | null = null;
try {
  if (HF_API_KEY && typeof HF_API_KEY === 'string' && HF_API_KEY.trim() !== '') {
    hf = new HfInference(HF_API_KEY);
  } else {
    console.warn('Invalid or missing Hugging Face API key');
  }
} catch (error) {
  console.warn('Failed to initialize Hugging Face client');
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Limit input length
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

export async function getAIResponse(input: string): Promise<string> {
  if (!hf) {
    return "I'm currently operating in offline mode. Let me help you find a game based on your preferences!";
  }

  try {
    const sanitizedInput = sanitizeInput(input);
    
    if (!sanitizedInput) {
      throw new Error('Invalid input');
    }

    const result = await Promise.race([
      hf.textGeneration({
        model: 'gpt2',
        inputs: `As a gaming AI assistant, recommend a game based on this input: ${sanitizedInput}`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_k: 50,
          top_p: 0.9,
          repetition_penalty: 1.2,
        },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
    ]);

    if (typeof result === 'object' && 'generated_text' in result) {
      return result.generated_text.trim();
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('AI response generation failed:', error);
    return "I'm having trouble connecting to my AI brain right now, but I can still help you find a great game!";
  }
}