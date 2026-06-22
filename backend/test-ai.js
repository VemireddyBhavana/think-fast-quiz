import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testAI() {
  console.log("Testing OpenAI integration...");
  const prompt = `Generate a trivia quiz about "Cats" with 1 questions at a "medium" difficulty level.
    Return the response strictly as a JSON array of objects. 
    Each object must have the following keys:
    - "question": the question string
    - "correct_answer": the correct answer string
    - "incorrect_answers": an array of exactly 3 incorrect answer strings
    Do not wrap the JSON in markdown code blocks, just return the raw JSON array.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    console.log("Response received from OpenAI:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error from OpenAI:");
    console.error(error.message);
  }
}

testAI();
