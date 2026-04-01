import requests
import base64

def fetch_jira_issue(jira_url: str, email: str, api_token: str, issue_id: str) -> dict:
    url = f"{jira_url.rstrip('/')}/rest/api/3/issue/{issue_id}"
    auth_string = f"{email}:{api_token}"
    auth_bytes = auth_string.encode('ascii')
    base64_auth = base64.b64encode(auth_bytes).decode('ascii')
    
    headers = {
        "Authorization": f"Basic {base64_auth}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 401:
        raise ValueError("Invalid Jira API Token or Email. Authentication failed.")
    elif response.status_code == 404:
        raise ValueError(f"Issue ID {issue_id} not found. Check project key and ID.")
    
    response.raise_for_status()
    data = response.json()
    
    summary = data.get("fields", {}).get("summary", "")
    description_obj = data.get("fields", {}).get("description", {})
    description = str(description_obj)
    status = data.get("fields", {}).get("status", {}).get("name", "")
    
    return {
        "issue_key": issue_id,
        "summary": summary,
        "description": description,
        "status": status,
        "acceptance_criteria": "TBD"
    }
