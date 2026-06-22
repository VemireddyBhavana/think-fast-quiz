import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_startup_crash'
});

export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, amount = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if no API key is provided
      console.warn('No OpenAI API Key provided. Returning mocked AI response.');
      return res.json([
        {
          question: `Mocked Question about ${topic}`,
          correct_answer: 'Correct Answer',
          incorrect_answers: ['Wrong 1', 'Wrong 2', 'Wrong 3']
        }
      ]);
    }

    const prompt = `Generate a trivia quiz about "${topic}" with ${amount} questions at a "${difficulty || 'medium'}" difficulty level.
    Return the response strictly as a JSON array of objects. 
    Each object must have the following keys:
    - "question": the question string
    - "correct_answer": the correct answer string
    - "incorrect_answers": an array of exactly 3 incorrect answer strings
    Do not wrap the JSON in markdown code blocks, just return the raw JSON array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content.trim();
    
    // Attempt to parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseErr) {
      // Strip markdown if it returned it anyway
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
};
