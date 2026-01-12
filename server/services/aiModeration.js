import OpenAI from "openai";

let openai;

export const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

export const checkPostContent = async (title, content) => {
  const ai = getOpenAI();

  const prompt = `
You are a content moderation system for a youth social platform.
Analyze this post and respond ONLY in valid JSON format with no extra text.

Post title: "${title}"
Post content: "${content}"

Rules for "messageToUser" (Must be in HEBREW):
1. If riskLevel is LOW: Write a short, positive message like "איזה כיף, הפוסט שלך פורסם!".
2. If riskLevel is MEDIUM: Write a warm, supportive message in Hebrew. Explain that the post was flagged as sensitive because it might express distress or sadness. Tell them they are not alone and it's okay to share, but suggest reaching out to a friend or a hotline if they feel overwhelmed.
3. If riskLevel is HIGH: Explain clearly (and kindly) that the post violates community rules (violence/harm) and cannot be published. Include support resources like Eran (1201).
Return JSON like this:
{
  "safeToPublish": Boolean,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "categories": [],
  "messageToUser": "..." 
}
`;



  const response = await ai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const contentString = response.choices[0].message.content;

  try {
    const result = JSON.parse(contentString);
  
    // אם אין messageToUser, נוסיף הודעה ברירת מחדל
    if (!result.messageToUser) {
      result.messageToUser = result.safeToPublish
        ? `הפוסט שלך תקין וניתן לפרסום.`
        : `משתמש יקר, הפוסט שלך לא ניתן להעלות. עדכן את הפוסט ונסה שוב.`;
    }
  
    return result;
  
  } catch (err) {
    console.error("AI returned invalid JSON or error occurred:", err);
    return {
      safeToPublish: false,
      riskLevel: "HIGH",
      categories: ["ParsingError"],
      messageToUser: `
  היי [שם],
  שמנו לב שאת אולי במצוקה. חשוב שתדעי שאת לא לבד ויש מי שיכול לעזור. 💛
  
  אם את מרגישה רע או חושבת על פגיעה בעצמך, אפשר לפנות למישהו שמבין ויכול לתמוך:
  
  מוקד 1201 – סיוע לנוער במצוקה
  איגי – תמיכה לנוער מהקהילה הגאה: https://igy.org.il/
  דלת פתוחה – תמיכה והכוונה: https://www.opendoor.org.il/
  
  גם אפשר לדבר עם מישהי קרובה שאת סומכת עליה – הורה, קרובת משפחה או מורה. אם את רוצה, אפשר לקבל עזרה לנסח את השיחה.
  
  זכרי – יש מי שמקשיב, ואת לא לבד. 🌸
  `
    };
  }
  

};
