export function calculate(prompt: string): string {
  try {
    // Very basic and safe eval
    // Reject any non-math characters
    if (!/^[0-9+\-*/().\s]+$/.test(prompt)) {
      throw new Error("Invalid characters in expression");
    }

    // Evaluate using Function constructor (sandboxed)
    const result = Function(`"use strict"; return (${prompt})`)();
    return `The result is ${result}`;
  } catch {
    return "Sorry, I couldn't evaluate that expression.";
  }
}
