const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = 'You are LystynZ-Agent, an AI assistant specialized in helping store owners and resellers succeed. Provide expert advice on reselling strategies, product sourcing, pricing, marketing, and business optimization. Be helpful, professional, and focused on practical solutions.';
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    
    return {
      statusCode: 200,
      body: response
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from AI' })
    };
  }
};