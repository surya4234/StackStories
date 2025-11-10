// backend/utils/aiSentiment.js
// Local sentiment analysis and smart rephrasing without any API calls

const Sentiment = require("sentiment");
const { NlpManager } = require("node-nlp");

const sentiment = new Sentiment();
const manager = new NlpManager({ languages: ["en"], forceNER: true });

/**
 * Analyzes sentiment and rephrases a given text.
 * Works fully offline — no API key or internet needed.
 * @param {string} text
 * @returns {Promise<{ sentiment: string, rephrased: string }>}
 */
async function analyzeAndRephrase(text) {
  if (!text || text.trim() === "") {
    return { sentiment: "neutral", rephrased: "" };
  }

  // Step 1: Sentiment analysis
  const result = sentiment.analyze(text);
  let sentimentLabel = "neutral";
  if (result.score > 1) sentimentLabel = "positive";
  else if (result.score < -1) sentimentLabel = "negative";
  
  // Step 2: Rephrase using NLP-based heuristic method
  let rephrased = text;

  // Simple rephrasing strategy
  if (sentimentLabel === "negative") {
    rephrased = text
      .replace(/\b(bad|poor|worst|hate|angry|awful)\b/gi, "not great")
      .replace(/\b(stupid|useless|terrible|annoying|worst)\b/gi, "less ideal")
      .replace(/\b(ugly|disgusting|hate)\b/gi, "unpleasant")
      .replace(/[!]+/g, ".");
    rephrased = `I felt this could be improved — ${rephrased}`;
  } else if (sentimentLabel === "positive") {
    rephrased = text.replace(/\b(good|nice|great|excellent|love)\b/gi, "wonderful");
    rephrased = `Overall, this seems quite positive — ${rephrased}`;
  } else {
    rephrased = `In general, ${text}`;
  }
  return { sentiment: sentimentLabel, rephrased };
}

module.exports =  analyzeAndRephrase ;
