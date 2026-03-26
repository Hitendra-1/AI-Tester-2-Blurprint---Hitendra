import axios from 'axios';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export interface LLMConfig {
  provider: string;
  apiKey: string;
  apiUrl?: string;
  model: string;
}

const SYSTEM_PROMPT = `You are an expert QA Engineer. Your task is to generate comprehensive Functional and Non-Functional Test Cases based on the provided Jira requirement. 
IMPORTANT CONSTRAINT: You MUST output the test cases strictly in Jira format. 
Each test case must include: Summary, Description, Preconditions, Steps (numbered), Expected Results, and Priority. Use proper Markdown for formatting.`;

export async function generateTestCases(prompt: string, config: LLMConfig): Promise<string> {
  const { provider, apiKey, apiUrl, model } = config;

  try {
    if (provider === 'OpenAI' || provider === 'Grok') {
      const baseURL = provider === 'Grok' ? 'https://api.x.ai/v1' : undefined;
      const openai = new OpenAI({ apiKey, baseURL });
      const response = await openai.chat.completions.create({
        model: model || (provider === 'Grok' ? 'grok-beta' : 'gpt-4o'),
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ]
      });
      return response.choices[0].message.content || '';
    }

    if (provider === 'Claude') {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: model || 'claude-3-opus-20240229',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      });
      return (response.content[0] as any).text;
    }

    if (provider === 'Gemini') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model: model || 'gemini-1.5-pro',
        systemInstruction: SYSTEM_PROMPT 
      });
      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    }

    if (provider === 'Ollama' || provider === 'LM Studio') {
      const url = apiUrl || (provider === 'Ollama' ? 'http://127.0.0.1:11434' : 'http://127.0.0.1:1234/v1');
      if (provider === 'Ollama') {
        const response = await axios.post(`${url}/api/generate`, {
          model: model || 'llama3',
          prompt: `${SYSTEM_PROMPT}\n\nRequirement: ${prompt}`,
          stream: false
        });
        return response.data.response;
      } else {
        // LM Studio uses OpenAI compatible endpoint
        const response = await axios.post(`${url}/chat/completions`, {
          model: model || 'local-model',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ]
        }, { headers: { 'Authorization': `Bearer ${apiKey || 'dummy'}` }});
        return response.data.choices[0].message.content;
      }
    }

    throw new Error(`Unsupported provider: ${provider}`);
  } catch (error: any) {
    console.error('LLM generation error:', error);
    let errorMessage = error.message || 'Failed to generate test cases';
    
    // Handle Axios HTTP errors
    if (error.response?.data?.error) {
      errorMessage = typeof error.response.data.error === 'string' 
        ? error.response.data.error 
        : error.response.data.error.message || errorMessage;
    } 
    // Handle SDK-specific errors (OpenAI/Authropic)
    else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    throw new Error(errorMessage);
  }
}
