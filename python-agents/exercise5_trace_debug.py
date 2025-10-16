from openai_agents import Agent, ModelSettings
import os
import json

# Simple tracing wrapper around Agent.run

class TracingAgent(Agent):
    def run_with_trace(self, prompt):
        trace = {"agent": self.name, "prompt": prompt, "tool_calls": []}
        # If real API supports hooks for tools, capture them; here we just call run
        resp = self.run(prompt)
        trace["response"] = resp
        return trace


def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set. Please set it in your environment and rerun.")
        return

    triage = TracingAgent(name="TriageAgent", instructions="Route requests.", model="gpt-4o", model_settings=ModelSettings(temperature=0.2, max_tokens=300))

    prompt = "How do I design test cases for login?"
    trace = triage.run_with_trace(prompt)
    print("Trace: \n")
    print(json.dumps(trace, indent=2))

if __name__ == '__main__':
    main()
