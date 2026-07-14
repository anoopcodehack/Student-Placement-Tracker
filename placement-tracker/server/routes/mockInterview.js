const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

// Generate 5 questions
router.post('/questions', protect, async (req, res) => {
  try {
    const { company, role, round } = req.body;

    const prompt = `
You are an expert interviewer at ${company} hiring for ${role}.
Generate exactly 5 ${round} interview questions.

Respond ONLY with valid JSON array, no extra text:
[
  {
    "question": "question text",
    "topic": "topic name",
    "difficulty": "easy|medium|hard",
    "hint": "optional short hint"
  }
]

Make questions realistic and specific to ${company} and ${role}.
${round === 'aptitude' ? 'Include logical reasoning, quantitative, and verbal questions.' : ''}
${round === 'technical' ? 'Include DSA, CS fundamentals, system design, and coding concepts.' : ''}
${round === 'hr' ? 'Include behavioral, situational, and cultural fit questions.' : ''}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Evaluate single answer
router.post('/evaluate', protect, async (req, res) => {
  try {
    const { question, answer, company, role, round } = req.body;

    const prompt = `
You are an expert interviewer at ${company} for ${role} (${round} round).

Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and respond ONLY with valid JSON, no extra text:
{
  "score": <number 1-10>,
  "shortFeedback": "<one sentence feedback>",
  "idealAnswer": "<what a perfect answer would include in 2-3 sentences>",
  "goodPoints": ["point1", "point2"],
  "missedPoints": ["point1", "point2"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const evaluation = JSON.parse(cleaned);

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Final overall result
router.post('/result', protect, async (req, res) => {
  try {
    const { company, role, round, questions, answers, scores } = req.body;

    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

    const prompt = `
A candidate completed a mock ${round} interview for ${role} at ${company}.
Average score: ${avg}/10

Questions and answers:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i]}`).join('\n\n')}

Respond ONLY with valid JSON, no extra text:
{
  "overallFeedback": "<2-3 sentence overall assessment>",
  "tips": ["tip1", "tip2", "tip3"],
  "readiness": "<Not Ready|Needs Practice|Almost Ready|Interview Ready>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const summary = JSON.parse(cleaned);

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;