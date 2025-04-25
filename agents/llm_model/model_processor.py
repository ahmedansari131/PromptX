from utillity.prompts import available_tools
import json


def process_step(parsed_output, messages):
    if parsed_output.get("step") == "plan":
        print(f"🧠: {parsed_output.get('content')}")
        return False

    if parsed_output.get("step") == "action":
        tool_name = parsed_output.get("function")
        tool_input = parsed_output.get("input")
        print(f"🔧: {tool_name}({tool_input})")

        if available_tools.get(tool_name, False):
            output = available_tools[tool_name]["fn"](**tool_input)
            messages.append(
                {
                    "role": "user",
                    "parts": [
                        {"text": json.dumps({"step": "observe", "output": output})}
                    ],
                }
            )
        return False

    if parsed_output.get("step") == "output":
        print(f"🤖: {parsed_output.get('content')}")
        return True
    return False
