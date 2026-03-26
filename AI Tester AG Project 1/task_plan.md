# Task Plan

## Phases
1. Discovery (Completed)
2. Blueprint Approval (Completed)
3. Implementation (Completed)
4. Testing (Current Phase)
5. Finalization

## Goals
- Gather requirements for the project. **(Done)**
- Create an approved Blueprint based on requirements. **(Done)**
- Develop a Test Case Generator for APIs and Web applications capable of outputting Jira-formatted functional and non-functional test cases. **(Done)**
- Support local and cloud LLM infrastructure with multiple provider options. **(Done)**

## Blueprint (Approved)

### 1. Architecture & Tech Stack
- **Environment**: Node.js
- **Language**: TypeScript (Strict typing for robustness)
- **Frontend**: React (with TypeScript)
- **Backend**: Node.js/Express (with TypeScript)

### 2. Core Features
- **Input Mechanism**: 
  - Chat interface ("Ask here is here TC for Requirement").
  - Support for copy-pasting Jira requirements.
- **Output**: 
  - Generated Functional and Non-Functional Test Cases.
  - STRICT constraint: Output must be formatted specifically for Jira compatibility.
- **LLM Routing/Configuration**: 
  - Ability to connect to Ollama API, LM Studio API, Grok API, OpenAI API, Claude API, and Gemini API.
  - Test Connection Functionality.
- **History Tracking**:
  - Sidebar to view past generated test cases or prompts.

### 3. UI/UX Design (Based on `Plan.jpg.png`)
- **Main View**: 
  - Left Sidebar for History.
  - Central large text area for LLM response/generated Test Cases.
  - Bottom text input for providing requirements.
- **Settings View**: 
  - Input fields/sections for configuring various LLM providers (Ollama, Groq, OpenAI, Claude, Gemini, LM Studio).
  - "Test Connection" button.
  - "Save Button" to persist configurations locally.

---

## Checklists

### Phase 1: Discovery (Completed)
- [x] Ask discovery questions to understand the project.
- [x] Analyze user's responses and provided designs.
- [x] Draft an initial Blueprint.

### Phase 2: Blueprint Approval (Completed)
- [x] Present Blueprint to the user.
- [x] Refine Blueprint based on feedback (if any).
- [x] Obtain formal approval of the Blueprint.

### Phase 3: Implementation (Completed)
- [x] Initialize Node.js + React + TypeScript repository.
- [x] Build the Main UI layout (History, Chat Output, Input prompt).
- [x] Build the Settings UI layout (Provider configs, Test Connection, Save).
- [x] Implement local configuration storage for API keys/URLs.
- [x] Implement LLM integration service routing to chosen provider.
- [x] Ensure output formatting strictly follows Jira syntax.

### Phase 4: Testing (Current)
- [ ] Verify UI components match the design.
- [ ] Validate configurations can be saved and retrieved.
- [ ] Test connections to implemented LLMs.
- [ ] Validate the generated output conforms to Jira format.
- [ ] Test functional and non-functional query handling.

### Phase 5: Finalization
- [ ] Code cleanup and documentation.
- [ ] Final user review.
