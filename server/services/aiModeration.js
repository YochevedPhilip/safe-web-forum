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

Return JSON like this:
{
  "safeToPublish": true | false,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "categories": [],
  "messageToUser": "Write a warm, clear message in Hebrew explaining to the user why the post cannot be published, including: 
  1. A clear explanation of why the post was rejected.
  2. Instructions to update the post and try again.
  3. If the content indicates distress (like suicidal thoughts), include resources and support links."
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
