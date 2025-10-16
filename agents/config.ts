import dotenv from 'dotenv';
import { ModelSettings } from 'openai-agents';

dotenv.config();

// Validate API key presence
if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
}

// Common model settings
export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
    temperature: 0.2,
    max_tokens: 200
};

// Export API key for agent initialization
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;