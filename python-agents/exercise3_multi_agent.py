from openai_agents import Agent, ModelSettings
import os

# Minimal multi-agent routing simulation

class SimpleRouter:
    def __init__(self, agents):
        self.agents = agents

    def route(self, query):
        q = query.lower()
        if "design" in q or "test case" in q:
            return self.agents['test_design']
        if "selenium" in q or "script" in q or "automation" in q:
            return self.agents['automation']
        return self.agents['triage']


def make_agent(name, instructions, model="gpt-4o"):
    return Agent(name=name, instructions=instructions, model=model, model_settings=ModelSettings(temperature=0.2, max_tokens=300))


def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set. Please set it in your environment and rerun.")
        return

    test_design = make_agent("TestDesignAgent", "Design test cases and explain test strategies.")
    automation = make_agent("AutomationAgent", "Write automation test scripts (Selenium/Pytest) given requirements.")
    triage = make_agent("TriageAgent", "Route requests to the correct specialist and summarize.")

    agents = {'test_design': test_design, 'automation': automation, 'triage': triage}

    router = SimpleRouter(agents)

    samples = [
        "How do I design test cases for login?",
        "Write Selenium script for login test."
    ]

    for s in samples:
        chosen = router.route(s)
        print(f"Query: {s}\nRouted to: {chosen.name}\n")
        resp = chosen.run(s)
        print(f"Response from {chosen.name}:\n{resp}\n{'-'*40}\n")

if __name__ == '__main__':
    main()
