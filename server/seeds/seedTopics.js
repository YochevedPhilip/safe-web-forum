import Topic from "../data/topicModel.js";

const topics = [
  { title: "רגשות ובריאות נפשית" },
  { title: "התמודדות עם לחץ וחרדה" },
  { title: "דימוי עצמי וביטחון" },
  { title: "איך לבקש עזרה" },
  { title: "חברות וקשרים חברתיים" },
  { title: "גבולות אישיים" },
  { title: "מערכות יחסים רומנטיות" },
  { title: "פרידות ואכזבות" },
  { title: "התבגרות ושינויים בגוף" },
  { title: "זהות אישית ומגדרית" },
  { title: "קבלה עצמית" },
  { title: "לחץ חברתי והשוואות" },
  { title: "בטיחות באינטרנט" },
  { title: "בריונות ובריונות רשת" },
  { title: "פרטיות ברשתות חברתיות" },
  { title: "לימודים ומבחנים" },
  { title: "מוטיבציה ושחיקה" },
  { title: "עתיד, חלומות וקריירה" },
  { title: "יחסים עם הורים ומשפחה" },
  { title: "תקשורת במשפחה" },
  { title: "תחושת בדידות" },
  { title: "השראה וסיפורים מעצימים" },
  { title: "תחביבים ויצירתיות" },
  { title: "כלים להרגעה וחוסן נפשי" }
];

export async function seedTopicsIfEmpty() {
  try {
    const count = await Topic.countDocuments();

    if (count === 0) {
      await Topic.insertMany(topics);
      console.log("✅ Topics seeded");
    } else {
      console.log("ℹ️ Topics already exist");
    }
  } catch (err) {
    console.error("❌ Failed to seed topics", err);
  }
}
