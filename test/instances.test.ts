import assert from "node:assert/strict";
import { test } from "node:test";
import { MockLanguageModelV1 } from "ai/test";
import { createDeepResearch } from "../src/index";

// One mock model that answers every step of the pipeline, tagged so we can see which instance's model was called
const mockModel = (tag: string, used: string[]) =>
  new MockLanguageModelV1({
    defaultObjectGenerationMode: "json",
    doGenerate: async ({ prompt }) => {
      used.push(tag);
      const text = JSON.stringify(prompt);
      let output = "ok";
      if (text.includes("research planner")) output = JSON.stringify({ subQueries: ["q"], researchPlan: "plan", depth: 1, breadth: 1 });
      else if (text.includes("help decide if the data")) output = JSON.stringify({ isComplete: true, reason: "enough" });
      else if (text.includes("help users answer their prompt")) output = JSON.stringify({ text: "report [1]", phase: "done" });
      return {
        text: output,
        finishReason: "stop",
        usage: { promptTokens: 1, completionTokens: 1 },
        rawCall: { rawPrompt: null, rawSettings: {} },
      };
    },
  });

const mockSearch = (tag: string, used: string[]) => async (query: string) => {
  used.push(tag);
  return { query, search_results: { results: [{ url: `https://${tag}.example.com`, title: tag, content: "content" }] } };
};

test("each DeepResearch instance uses its own models and web search", async () => {
  const models: string[] = [];
  const searches: string[] = [];

  const first = createDeepResearch({
    models: { default: mockModel("first", models), reasoning: mockModel("first", models), output: mockModel("first", models) },
    web_search: mockSearch("first", searches),
  });
  await first.generate("first prompt");

  models.length = 0;
  searches.length = 0;

  const second = createDeepResearch({
    models: { default: mockModel("second", models), reasoning: mockModel("second", models), output: mockModel("second", models) },
    web_search: mockSearch("second", searches),
  });
  await second.generate("second prompt");

  assert.deepEqual([...new Set(models)], ["second"]);
  assert.deepEqual([...new Set(searches)], ["second"]);
});
