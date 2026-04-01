# Jira Connection & Data Fetching SOP

## Goal
To predictably establish a connection to Jira (or ADO/Xray) and fetch an issue's details to be used as context for Test Plan generation.

## Inputs
- `jira_url`: The base URL of the Atlassian instance.
- `jira_email`: The user's email address.
- `api_token`: The Atlassian API token.
- `issue_id`: The Agile Board Issue Key (e.g., `VWOAPP-123`).

## Tool Logic (`tools/jira_client.py`)
1. Receive input payload parameters.
2. Ensure URL is properly formatted (strip trailing slashes).
3. Attempt to authenticate using `requests` with Basic Auth.
4. Call `GET /rest/api/3/issue/{issue_id}`.
5. Extract the following fields:
   - `summary`
   - `description`
   - `status`
6. Return structured JSON matching the intermediate `Jira Issue Payload` defined in `gemini.md`.

## Edge Cases
- **Invalid Token / Unauthorized (HTTP 401):** Return a clear error message `Invalid Jira API Token or Email.`.
- **Issue Not Found (HTTP 404):** Return a clear error message `Issue ID {issue_id} not found. Check project key and ID.`.
- **Network Failure:** Catch `requests.exceptions.RequestException` and return `Network error while reaching Jira.`.
