
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);
    const systemPrompt = 'You are LystynZ-Agent, an AI assistant specialized in helping store owners and resellers succeed. Provide expert advice on reselling strategies, product sourcing, pricing, marketing, and business optimization. Be helpful, professional, and focused on practical solutions.';
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: { max_new_tokens: 256 }
      })
    });

    const data = await response.json();
    let aiResponse = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text;
    } else if (data?.generated_text) {
      aiResponse = data.generated_text;
    } else {
      aiResponse = "AI did not return a response.";
    }

    return {
      statusCode: 200,
      body: aiResponse
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from AI' })
    };
  }
};