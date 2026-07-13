const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');

const pdfParseModule = require('pdf-parse');
const pdfParse = async (buffer) => {
  const Parser = pdfParseModule?.PDFParse || pdfParseModule?.default || pdfParseModule;

  if (typeof Parser === 'function' && Parser.prototype?.getText) {
    const parser = new Parser({ data: buffer });
    return parser.getText();
  }

  if (typeof pdfParseModule === 'function') {
    return pdfParseModule(buffer);
  }

  throw new Error('pdf-parse is not available in the expected format');
};

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', protect, upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'Resume PDF required' });
    if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description required' });

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const prompt = `
You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "matchScore": <number 0-100>,
  "matchLevel": "<Excellent|Good|Average|Poor>",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "summary": "<2 sentence overall assessment>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleaned);

    res.json({ success: true, data: analysis });

  } catch (err) {
    console.error('ATS Error:', err.message);
    res.status(500).json({ success: false, message: 'ATS analysis failed: ' + err.message });
  }
});

module.exports = router;