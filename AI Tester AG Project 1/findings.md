# Findings

## Research
- The project is a test case generator for APIs and Web Applications.
- Both functional and non-functional test cases will be generated.
- The output format must be specifically formatted for Jira.

## Discoveries from User Requirements & Design Mockup
- **Tech Stack**:
  - Backend: Node.js with TypeScript.
  - Frontend: React with TypeScript.
- **Input Mechanism**: 
  - Users input Jira requirements via copy-paste or a chat interface.
  - The main UI window includes a 'History' sidebar, a main output area for generated test cases, and an input field at the bottom.
- **Local LLM Infrastructure (Settings Window)**:
  - Supports multiple LLM providers: Ollama API, LM Studio API, Grok (Groq) API, OpenAI, Claude API, and Gemini API.
  - The design mockup (`Plan.jpg.png`) specifies that the settings window will have dedicated setting sections for each provider (e.g., API keys, URLs).
  - The settings window requires a "Test Connection" button to validate API connectivity and a "Save Button".

## Constraints
- **Protocol 0 Enforced**: No code or scripts can be written until Discovery is complete and the Blueprint in `task_plan.md` is approved.
- The Output must follow Jira formatting constraint strictly.
- Typescript must be used for both Frontend and Backend development.
