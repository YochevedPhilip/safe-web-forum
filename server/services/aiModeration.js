import OpenAI from "openai";

let openai;

export const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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

Possible statuses (CONTENT_STATUS):
- OK: Safe to publish.
- SENSITIVE: Needs a warm message, might express distress.
- HARMFUL: Violates rules, cannot be published.

Possible reasons (MOD_REASONS):
'HATE', 'HARASSMENT', 'SELF_HARM', 'VIOLENCE', 'SEXUAL', 'ILLEGAL', 'SPAM', 'PERSONAL_DATA', 'OTHER'

Resource List (Include the relevant link in "messageToUser" if not OK):
- מצוקה/בדידות: ער"ן - https://www.eran.org.il/
- מיניות/יחסים: דלת פתוחה - https://www.opendoor.org.il/
- להט"ב: איגי - https://igy.org.il/
- בריונות: מוקד 105 - https://www.gov.il/he/departments/105-unit
- תקיפה מינית: מרכזי הסיוע - https://www.1202.org.il/

Rules for "messageToUser" (Must be in HEBREW):
1. If status is OK: Short positive message.
2. If status is SENSITIVE: Warm, supportive message. Suggest help and include the most relevant link from the Resource List.
3. If status is HARMFUL: Kind but clear rejection. Include Eran (1201) and the most relevant link from the Resource List.

Return JSON like this:
{
  "status": "OK" | "SENSITIVE" | "HARMFUL",
  "reason": "ONE_OF_MOD_REASONS" | null,
  "messageToUser": "..."
}
`;

  try {
    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      riskLevel: result.status,          // OK | SENSITIVE | HARMFUL
      reason: result.reason || null,     // SELF_HARM, VIOLENCE וכו'
      messageToUser:
        result.messageToUser ||
        (result.status === "OK"
          ? "הפוסט פורסם בהצלחה"
          : "הפוסט לא אושר לפרסום"),
    };
  } catch (err) {
    console.error("AI Moderation Error:", err);

    return {
      riskLevel: "HARMFUL",
      reason: "OTHER",
      messageToUser:
        'היי, חלה שגיאה בבדיקת הפוסט. אם את/ה במצוקה, ניתן לפנות לער"ן ב-1201.',
    };
  }
};
