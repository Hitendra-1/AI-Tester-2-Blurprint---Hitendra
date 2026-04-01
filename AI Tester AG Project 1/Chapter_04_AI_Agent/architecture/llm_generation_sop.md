# LLM Generation SOP

## Goal
To generate a comprehensive test plan markdown string formatted according to the VWO Enterprise Template, taking user stories (Jira payload) and additional context as input.

## Inputs
- `provider`: `ollama` or `groq`.
- `model_name`: The LLM model to use (e.g., `llama3`, `mixtral-8x7b-32768`).
- `api_key`: For GROQ.
- `base_url`: Optional (e.g., `http://localhost:11434` for Ollama).
- `issue_data`: The JSON payload from Jira fetching.
- `additional_context`: User's text notes.

## Tool Logic (`tools/llm_client.py`)
1. Assemble the **System Prompt**, injecting the base `TestPlan.md` template rules and asking the LLM to output ONLY the final markdown for the Enterprise test plan.
2. Assemble the **User Prompt** by injecting the `issue_data` (Title, description, acceptance criteria) alongside the `additional_context`.
3. If `provider == 'groq'`:
   - Initialize `Groq` client using the provided `api_key`.
   - Call `chat.completions.create`.
4. If `provider == 'ollama'`:
   - Send `POST` request to `{base_url}/api/chat` with JSON body.
5. Extract the generated Markdown string from the LLM's response.
6. Return the `Final Delivery Payload`.

## Edge Cases
- **Ollama Offline:** Catch `ConnectionError` and return `Ollama is not responding at {base_url}. Ensure the service is running.`.
- **Invalid GROQ Key:** Catch specific GROQ Auth error and return `Invalid GROQ API Key.`.
- **Timeout:** Ensure an aggressive but realistic timeout (60s) for LLM generation. Return `LLM generation timed out.`
