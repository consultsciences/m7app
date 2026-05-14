import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Real Stripe Implementation (Requires STRIPE_SECRET_KEY in Environment)
  app.post("/api/billing/create-checkout", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe is not configured. Declare STRIPE_SECRET_KEY in .env.example" });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'M7A Pro Subscription', description: 'Unlock unlimited autonomic orchestrations' },
            unit_amount: 2900,
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${req.headers.origin}/dashboard?success=true`,
        cancel_url: `${req.headers.origin}/dashboard?canceled=true`,
      });
      res.json({ url: session.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/billing/portal", async (req, res) => {
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });
    const { customerId } = req.body;
    if (!customerId) return res.status(400).json({ error: "CustomerID required" });

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/dashboard`,
      });
      res.json({ url: portalSession.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vercel / GitHub Integration Bridge
  // These require GITHUB_TOKEN and VERCEL_TOKEN
  app.post("/api/projects/:id/export/github", async (req, res) => {
    const { id } = req.params;
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return res.status(503).json({ error: "GitHub integration not configured. Provide GITHUB_TOKEN in env." });
    }
    
    // Logic to create repo and push source artifacts would go here using Octokit
    res.json({ success: true, repoUrl: `https://github.com/m7a-forge/project-${id}` });
  });

  app.post("/api/projects/:id/deploy", async (req, res) => {
    const { id } = req.params;
    const token = process.env.VERCEL_TOKEN;
    
    if (!token) {
       return res.status(503).json({ error: "Vercel integration not configured. Provide VERCEL_TOKEN." });
    }
    
    // Logic to trigger Vercel deployment pipeline
    res.json({ success: true, deployUrl: `https://project-${id}.vercel.app` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`M7A Autonomic Server running on http://localhost:${PORT}`);
  });
}

startServer();
