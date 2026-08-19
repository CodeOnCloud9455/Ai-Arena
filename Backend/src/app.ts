import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import rungraph from "./ai/graph.ai.js";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-arena-ashen.vercel.app"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());

await connectDB();

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Arena API is running",
  });
});

app.post("/invoke", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    console.log("Received problem:", input);

    const result = await rungraph.invoke({
      problem: input.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Graph executed successfully",
      result,
    });
  } catch (error) {
    console.error("Graph execution error:", error);

    return res.status(500).json({
      success: false,
      message: "Graph execution failed",
      error: error instanceof Error
        ? error.message
        : String(error),
    });
  }
});

export default app;