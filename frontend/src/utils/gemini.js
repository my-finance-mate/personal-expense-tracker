import { GoogleGenerativeAI } from "@google/generative-ai";

const generateRecommendations = async (userProfile, recentActivity) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `As a financial advisor, analyze this user's profile and recent activity to generate personalized recommendations.
      
      User Profile:
      ${JSON.stringify(userProfile, null, 2)}
      
      Recent Activity:
      ${JSON.stringify(recentActivity, null, 2)}
      
      Provide analysis in this exact JSON format:
      {
        "summary": "Brief overview of spending and savings",
        "spendingBreakdown": {
          "category1": amount1,
          "category2": amount2
        },
        "insightsAndPatterns": [
          "insight1",
          "insight2",
          "insight3"
        ],
        "recommendations": [
          "recommendation1",
          "recommendation2",
          "recommendation3"
        ]
      }

      Ensure:
      1. The response is valid JSON
      2. Spending breakdown shows actual amounts
      3. Include 3 insights and 3 recommendations
      4. Focus on actionable advice`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response and parse JSON
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanText);
      
      // Validate response structure
      if (!parsedData.summary || !parsedData.spendingBreakdown || 
          !parsedData.insightsAndPatterns || !parsedData.recommendations) {
        throw new Error("Invalid response structure");
      }
      
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

export { generateRecommendations };
