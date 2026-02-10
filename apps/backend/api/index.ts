import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { generateDailyPlan } from './ai-engine';
import { handleClerkWebhook } from './webhook'; // Ensure you have this import!

const app = express();
app.use(cors());

// --- CRITICAL: MOUNT WEBHOOK BEFORE express.json() ---
// This ensures the webhook gets the RAW body for signature verification
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Now it's safe to use JSON for all other routes
app.use(express.json());

app.use(clerkMiddleware());

// Public Health Check
app.get('/api/health', (req, res) => res.status(200).send('Myfe AI Backend is Live!'));

// Protected AI Route
app.get('/api/daily-actions', async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Please log in to access your daily actions." 
    });
  }

  try {
    const plan = await generateDailyPlan(userId);
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Engine failed" });
  }
});

export default app;

// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
// import { generateDailyPlan } from './ai-engine';

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Clerk Middleware
// app.use(clerkMiddleware());

// // Public Health Check
// app.get('/api/health', (req, res) => res.status(200).send('Myfe AI Backend is Live!'));

// // Protected AI Route: Mobile app calls this to get suggestions
// // 1. Remove requireAuth() from the route
// app.get('/api/daily-actions', async (req, res) => {
//   // 2. Use getAuth to check the session manually
//   const { userId } = getAuth(req);

//   // 3. If no userId, return a 401 JSON error (No redirect!)
//   if (!userId) {
//     return res.status(401).json({ 
//       error: "Unauthorized", 
//       message: "Please log in to access your daily actions." 
//     });
//   }

//   try {
//     const plan = await generateDailyPlan(userId);
//     res.json(plan);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "AI Engine failed" });
//   }
// });

// // // --- TEMPORARY TESTING BLOCK ---
// // const PORT = process.env.PORT || 3001;

// // // Only runs when you execute the file directly (e.g., npx ts-node)
// // // Vercel will ignore this because it only uses the 'export default app'
// // if (require.main === module || process.env.NODE_ENV !== 'production') {
// //   app.listen(PORT, () => {
// //     console.log(`🚀 Logic check running at http://localhost:${PORT}`);
// //     console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
// //   });
// // }
// // // -------------------------------

// export default app; // Vercel requirement for serverless functions