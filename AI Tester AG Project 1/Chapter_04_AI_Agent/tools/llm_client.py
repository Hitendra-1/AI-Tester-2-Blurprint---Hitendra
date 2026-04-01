import requests
from groq import Groq

def generate_test_plan(provider: str, model_name: str, api_key: str, base_url: str, issue_data: dict, additional_context: str) -> str:
    system_prompt = """You are an Intelligent Test Planning Agent. 
Generate a comprehensive enterprise-grade test plan in Markdown format based strictly on the provided Jira issue context.
Use the exact structure from standard VWO Login Enterprise Test Plan template:
1. Test Plan Identifier
2. Introduction
3. Test Objectives
4. Scope of Testing (In-Scope, Out-of-Scope)
5. Features to be Tested
6. Features Not to be Tested
7. Test Strategy
8. Test Environment
9. Test Data Requirements
10. Entry Criteria
11. Exit Criteria
12. Test Deliverables
13. Risk and Mitigation.

Respond ONLY with the raw Markdown. Do not include markdown code block wrapper symbols.
"""
    user_prompt = f"Issue: {issue_data.get('issue_key')} - {issue_data.get('summary')}\nDescription: {issue_data.get('description')}\nAdditional Context: {additional_context}"
    
    if provider.lower() == "groq":
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=model_name or "mixtral-8x7b-32768",
        )
        return chat_completion.choices[0].message.content
        
    elif provider.lower() == "ollama":
        url = f"{base_url.rstrip('/')}/api/chat"
        payload = {
            "model": model_name or "llama3",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False
        }
        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json().get("message", {}).get("content", "")
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
