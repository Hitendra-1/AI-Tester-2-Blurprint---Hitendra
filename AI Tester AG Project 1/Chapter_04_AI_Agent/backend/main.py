from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add tools to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from tools.jira_client import fetch_jira_issue
    from tools.llm_client import generate_test_plan
except ImportError:
    pass # for initial load if things aren't ready

app = FastAPI(title="Test Planning Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JiraConfig(BaseModel):
    jira_url: str
    jira_email: str
    api_token: str

class LLMConfig(BaseModel):
    provider: str
    model_name: str
    api_key: str = ""
    base_url: str = ""

class FetchRequest(BaseModel):
    jira_config: JiraConfig
    issue_id: str
    additional_context: str = ""
    
class GenerateRequest(BaseModel):
    llm_config: LLMConfig
    issue_data: dict
    additional_context: str = ""

@app.post("/api/connections/jira/test")
def test_jira_connection(config: JiraConfig):
    import requests
    import base64
    url = f"{config.jira_url.rstrip('/')}/rest/api/3/myself"
    auth_string = f"{config.jira_email}:{config.api_token}"
    base64_auth = base64.b64encode(auth_string.encode('ascii')).decode('ascii')
    headers = {"Authorization": f"Basic {base64_auth}", "Accept": "application/json"}
    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        return {"status": "success", "message": "Connected to Jira"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/connections/llm/test")
def test_llm_connection(config: LLMConfig):
    try:
        if config.provider.lower() == "groq":
            from groq import Groq
            client = Groq(api_key=config.api_key)
            client.models.list()
            return {"status": "success", "message": "Connected to GROQ"}
        elif config.provider.lower() == "ollama":
            import requests
            url = f"{config.base_url.rstrip('/')}/api/tags"
            res = requests.get(url)
            res.raise_for_status()
            return {"status": "success", "message": "Connected to Ollama"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/issues/fetch")
def fetch_issue(req: FetchRequest):
    try:
        issue = fetch_jira_issue(
            req.jira_config.jira_url,
            req.jira_config.jira_email,
            req.jira_config.api_token,
            req.issue_id
        )
        return {"status": "success", "issue_data": issue}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/testplan/generate")
def generate_plan(req: GenerateRequest):
    try:
        plan_content = generate_test_plan(
            req.llm_config.provider,
            req.llm_config.model_name,
            req.llm_config.api_key,
            req.llm_config.base_url,
            req.issue_data,
            req.additional_context
        )
        return {"status": "success", "test_plan_content": plan_content}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
