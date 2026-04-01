# Project Constitution

## Data Schemas

### 1. Jira Connection Schema (Input)
```json
{
  "connection_id": "string",
  "connection_name": "string",
  "jira_url": "string (e.g., https://company.atlassian.net)",
  "jira_email": "string",
  "api_token": "string"
}
```

### 2. LLM Connection Schema (Input)
```json
{
  "provider": "string (ollama | groq)",
  "model_name": "string (e.g., llama3, mixtral-8x7b-32768)",
  "api_key": "string (optional for ollama)",
  "base_url": "string (optional)"
}
```

### 3. Fetch Issue Request Schema (Input)
```json
{
  "jira_connection_id": "string",
  "issue_id": "string (or list of IDs depending on scope)",
  "additional_context": "string (optional context about testing goals)",
  "project_key": "string (optional)"
}
```

### 4. Jira Issue Payload (Output Intermediate)
```json
{
  "issue_key": "string",
  "summary": "string",
  "description": "string",
  "acceptance_criteria": "string",
  "status": "string"
}
```

### 5. Final Delivery Payload (Output)
```json
{
  "test_plan_content": "string (markdown matching TestPlan.md template)",
  "status": "success | error",
  "error_message": "string (if any)"
}
```

## Behavioral Rules
- **Deterministic Logic:** The system must strictly fetch data via API boundaries before passing context to the LLM. 
- **Verifiability (Test Connections):** Both the Jira configuration and LLM configuration must have a "Test Connection" step that pings the respected API to verify readiness.
- **Tone:** Enterprise-grade, professional formatting for test plans according to B.L.A.S.T Framework.
- **Fail-Safe:** Implement robust exception handling for invalid API tokens, non-existent Jira IDs, and LLM timeout errors.

## Architectural Invariants
- Use A.N.T 3-layer architecture (Architecture, Navigation, Tools).
- All Python tools in `tools/` must be deterministic.
- Use `.tmp/` for intermediate files.
- Logic updates go to `architecture/` first.
