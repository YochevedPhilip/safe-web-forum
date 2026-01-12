import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../data/db.js";
import User from "../data/userModel.js";
import Topic from "../data/topicModel.js";
import Post from "../data/postModel.js";
import Comment from "../data/commentModel.js";
import Like from "../data/likeModel.js";
import bcrypt from "bcrypt";

// Demo users data
const demoUsers = [
  { email: "alice@demo.com", username: "alice_wonder", password: "demo123", role: "user" },
  { email: "bob@demo.com", username: "bob_builder", password: "demo123", role: "user" },
  { email: "charlie@demo.com", username: "charlie_brown", password: "demo123", role: "user" },
  { email: "diana@demo.com", username: "diana_prince", password: "demo123", role: "user" },
  { email: "eve@demo.com", username: "eve_adams", password: "demo123", role: "user" },
  { email: "admin@demo.com", username: "admin_user", password: "admin123", role: "admin" },
];

// Demo posts content for different topics
const demoPosts = [
  {
    title: "איך להתמודד עם חרדה לפני מבחנים?",
    content: "אני מרגיש חרדה גדולה לפני כל מבחן. הלב שלי דופק מהר, אני לא יכול לישון בלילה, ואני מרגיש שאני לא זוכר כלום. מישהו יכול לעזור לי עם טכניקות הרגעה?",
  },
  {
    title: "תחושת בדידות - איך להתמודד?",
    content: "לפעמים אני מרגיש מאוד לבד, גם כשיש לי חברים סביבי. זה לא קשור לכמות האנשים, אלא לתחושה פנימית. מישהו חווה משהו דומה?",
  },
  {
    title: "דימוי עצמי נמוך - איך לשפר?",
    content: "אני כל הזמן משווה את עצמי לאחרים ורואה רק את החסרונות שלי. איך אפשר להתחיל לראות את עצמי באור חיובי יותר?",
  },
  {
    title: "לחץ חברתי - איך להתמודד?",
    content: "אני מרגיש לחץ גדול לעשות דברים שאני לא רוצה רק כדי להתאים. איך אפשר להיות נאמן לעצמי ולהישאר חלק מהקבוצה?",
  },
  {
    title: "קשיים בתקשורת עם ההורים",
    content: "אני מרגיש שאני לא יכול לדבר עם ההורים שלי על דברים חשובים. כל שיחה הופכת לוויכוח. איך אפשר לשפר את התקשורת?",
  },
  {
    title: "איך לבקש עזרה כשקשה?",
    content: "אני יודע שאני צריך עזרה אבל קשה לי לבקש. אני מרגיש שאני מטיל עול על אחרים. איך אפשר להתגבר על המבוכה?",
  },
  {
    title: "בריונות רשת - מה לעשות?",
    content: "מישהו מציק לי ברשתות החברתיות. אני לא יודע מה לעשות - האם להתעלם או להגיב? איך אפשר להתמודד עם זה?",
  },
  {
    title: "פרידה מחבר טוב",
    content: "חבר טוב שלי עבר לגור במקום אחר ואנחנו כבר לא מדברים כמו פעם. אני מרגיש עצוב וחסר. איך אפשר להתמודד עם הפרידה?",
  },
  {
    title: "מוטיבציה בלימודים - איך למצוא?",
    content: "אני מרגיש שאני מאבד מוטיבציה בלימודים. הכל נראה משעמם וקשה. איך אפשר למצוא את הכוח להמשיך?",
  },
  {
    title: "קבלה עצמית - איך להתחיל?",
    content: "אני רוצה ללמוד לאהוב את עצמי כמו שאני, אבל זה כל כך קשה. מישהו יכול לשתף טיפים או חוויות אישיות?",
  },
  {
    title: "גבולות אישיים - איך להציב?",
    content: "אני מרגיש שאנשים מנצלים את הטוב שלי. איך אפשר להציב גבולות בלי להיראות רע או אנוכי?",
  },
  {
    title: "תחביבים ויצירתיות - איך להתחיל?",
    content: "אני רוצה למצוא תחביב חדש או לפתח יצירתיות, אבל אני לא יודע מאיפה להתחיל. מה עזר לכם?",
  },
  {
    title: "זהות אישית - מי אני?",
    content: "אני מרגיש שאני לא בטוח מי אני באמת. לפעמים אני משנה את עצמי לפי הסביבה. איך אפשר לגלות את העצמי האמיתי?",
  },
  {
    title: "כלים להרגעה - מה עובד?",
    content: "כשאני מרגיש לחוץ או חרד, אני לא יודע מה לעשות. מישהו יכול לשתף טכניקות הרגעה שעובדות?",
  },
  {
    title: "חברות אמיתית - איך לזהות?",
    content: "איך אפשר לדעת מי חבר אמיתי ומי לא? לפעמים קשה לי להבדיל בין חברים אמיתיים לבין אנשים שפשוט נמצאים בסביבה.",
  },
  {
    title: "התבגרות ושינויים - איך להתמודד?",
    content: "הגוף שלי משתנה ואני מרגיש לא בנוח. איך אפשר להתמודד עם השינויים ולהרגיש טוב עם עצמי?",
  },
  {
    title: "לחץ מבחינות - איך להתמודד?",
    content: "המבחנים מתקרבים ואני מרגיש לחץ עצום. איך אפשר להישאר רגוע ולהצליח?",
  },
  {
    title: "תקשורת במשפחה - איך לשפר?",
    content: "התקשורת במשפחה שלי לא טובה. כולם מדברים אבל אף אחד לא באמת מקשיב. איך אפשר לשפר את זה?",
  },
  {
    title: "סיפורים מעצימים - שתפו את שלכם",
    content: "אני אוהב לשמוע סיפורים של אנשים שהתגברו על קשיים. מישהו מוכן לשתף סיפור מעצים?",
  },
  {
    title: "ביטחון עצמי - איך לבנות?",
    content: "אני רוצה להיות יותר בטוח בעצמי אבל לא יודע איך. מה עזר לכם לבנות ביטחון עצמי?",
  },
  {
    title: "מערכות יחסים - איך לדעת אם זה נכון?",
    content: "אני במערכת יחסים אבל לא בטוח אם זה נכון לי. איך אפשר לדעת אם מערכת יחסים טובה או לא?",
  },
  {
    title: "שחיקה - איך להתמודד?",
    content: "אני מרגיש שחוק ומותש כל הזמן. אין לי אנרגיה לכלום. מישהו חווה משהו דומה ויכול לעזור?",
  },
  {
    title: "עתיד וקריירה - איך לבחור?",
    content: "אני לא יודע מה אני רוצה לעשות בעתיד. יש כל כך הרבה אפשרויות ואני מבולבל. איך אפשר להחליט?",
  },
  {
    title: "פרטיות ברשת - איך לשמור?",
    content: "אני מודאג מהפרטיות שלי ברשתות החברתיות. מה חשוב לדעת ואיך אפשר לשמור על הפרטיות?",
  },
];

// Demo comments
const demoComments = [
  "תודה על השיתוף! אני חווה משהו דומה ואני מבין אותך.",
  "זה מאוד קשה, אבל אתה לא לבד. יש הרבה אנשים שמרגישים כמוך.",
  "נסה טכניקות נשימה - זה עזר לי מאוד!",
  "אני ממליץ לדבר עם מישהו שאתה סומך עליו. זה עושה הבדל גדול.",
  "תזכור שזה לא לנצח - דברים משתנים.",
  "אתה חזק יותר ממה שאתה חושב!",
  "נסה לכתוב יומן - זה עוזר להבין את הרגשות.",
  "תרגול מדיטציה עזר לי מאוד להתמודד עם חרדה.",
  "אל תתייאש - כל צעד קטן חשוב!",
  "יש לך את הכוח להתגבר על זה!",
  "תודה על האומץ לשתף. זה עוזר גם לאחרים.",
  "אני כאן בשבילך אם תרצה לדבר.",
];

async function seedDemoData() {
  try {
    console.log("🌱 Starting demo data seeding...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await Like.deleteMany({});
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    // Keep topics - they might already be seeded
    console.log("✅ Existing data cleared");

    // Create demo users
    console.log("👥 Creating demo users...");
    const users = [];
    for (const userData of demoUsers) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        email: userData.email,
        username: userData.username,
        passwordHash,
        role: userData.role,
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Get all topics
    let topics = await Topic.find({});
    if (topics.length === 0) {
      console.log("📚 No topics found, creating basic topics...");
      topics = await Topic.insertMany([
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
        { title: "כלים להרגעה וחוסן נפשי" },
      ]);
    }
    console.log(`✅ Found ${topics.length} topics`);

    // Create posts for each topic
    console.log("📝 Creating posts...");
    const posts = [];
    const now = new Date();
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const postIndex = i % demoPosts.length;
      const postData = demoPosts[postIndex];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Create 2-4 posts per topic
      const postsPerTopic = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < postsPerTopic; j++) {
        const postIndex2 = (i + j) % demoPosts.length;
        const postData2 = demoPosts[postIndex2];
        const publishedAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days
        
        const post = await Post.create({
          publisherId: randomUser._id,
          topicId: topic._id,
          title: postData2.title,
          content: postData2.content,
          publishedAt,
          anonymous: Math.random() > 0.7, // 30% anonymous
          moderation: {
            status: "OK",
            evaluatedAt: publishedAt,
          },
          stats: {
            commentCount: 0,
            likeCount: 0,
          },
        });
        posts.push(post);
      }
    }
    console.log(`✅ Created ${posts.length} posts`);

    // Create comments for posts
    console.log("💬 Creating comments...");
    let totalComments = 0;
    for (const post of posts) {
      // 2-5 comments per post
      const commentsCount = Math.floor(Math.random() * 4) + 2;
      const postComments = [];
      
      for (let i = 0; i < commentsCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const commentText = demoComments[Math.floor(Math.random() * demoComments.length)];
        const publishedAt = new Date(post.publishedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        const comment = await Comment.create({
          postId: post._id,
          publisherId: randomUser._id,
          content: commentText,
          publishedAt,
          moderation: {
            status: "OK",
            evaluatedAt: publishedAt,
          },
          stats: {
            likeCount: 0,
            replyCount: 0,
          },
        });
        postComments.push(comment);
        totalComments++;
        
        // Update post comment count
        post.stats.commentCount++;
      }
      
      // Create some nested comments (replies)
      if (postComments.length > 0) {
        const replyCount = Math.floor(Math.random() * 3);
        for (let i = 0; i < replyCount && i < postComments.length; i++) {
          const parentComment = postComments[i];
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const replyText = "תודה על התגובה! זה עוזר לי מאוד.";
          
          await Comment.create({
            postId: post._id,
            publisherId: randomUser._id,
            content: replyText,
            parentCommentId: parentComment._id,
            publishedAt: new Date(parentComment.publishedAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000),
            moderation: {
              status: "OK",
              evaluatedAt: new Date(),
            },
            stats: {
              likeCount: 0,
              replyCount: 0,
            },
          });
          
          parentComment.stats.replyCount++;
          await parentComment.save();
          totalComments++;
        }
      }
      
      await post.save();
    }
    console.log(`✅ Created ${totalComments} comments`);

    // Create likes for posts and comments
    console.log("❤️  Creating likes...");
    let totalLikes = 0;
    
    // Like posts
    for (const post of posts) {
      const likesCount = Math.floor(Math.random() * 8) + 2; // 2-10 likes per post
      const likedUsers = new Set();
      
      for (let i = 0; i < likesCount && likedUsers.size < users.length; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!likedUsers.has(randomUser._id.toString())) {
          likedUsers.add(randomUser._id.toString());
          await Like.create({
            userId: randomUser._id,
            targetType: "post",
            targetId: post._id,
          });
          post.stats.likeCount++;
          totalLikes++;
        }
      }
      await post.save();
    }
    
    // Like comments
    const comments = await Comment.find({});
    for (const comment of comments) {
      const likesCount = Math.floor(Math.random() * 5) + 1; // 1-6 likes per comment
      const likedUsers = new Set();
      
      for (let i = 0; i < likesCount && likedUsers.size < users.length; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!likedUsers.has(randomUser._id.toString())) {
          likedUsers.add(randomUser._id.toString());
          await Like.create({
            userId: randomUser._id,
            targetType: "comment",
            targetId: comment._id,
          });
          comment.stats.likeCount++;
          totalLikes++;
        }
      }
      await comment.save();
    }
    console.log(`✅ Created ${totalLikes} likes`);

    // Update topic stats
    console.log("📊 Updating topic statistics...");
    for (const topic of topics) {
      const topicPosts = await Post.find({ topicId: topic._id });
      topic.postsCount = topicPosts.length;
      
      const lastPost = await Post.findOne(
        { topicId: topic._id, publishedAt: { $ne: null } },
        null,
        { sort: { publishedAt: -1 } }
      );
      topic.lastPostAt = lastPost ? lastPost.publishedAt : null;
      
      await topic.save();
    }
    console.log("✅ Topic statistics updated");

    console.log("\n🎉 Demo data seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Topics: ${topics.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Comments: ${totalComments}`);
    console.log(`   - Likes: ${totalLikes}`);
    console.log("\n💡 Demo login credentials:");
    console.log("   User: alice@demo.com / demo123");
    console.log("   Admin: admin@demo.com / admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDemoData();
