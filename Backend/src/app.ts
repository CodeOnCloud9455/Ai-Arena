import express from "express";
import rungraph from "./ai/graph.ai.js";
import cors from "cors"



const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}))

app.get("/", async (req, res) => {

    const result = await rungraph.invoke({
  problem: "Write a factorial function in JavaScript",
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

    console.log("Graph completed successfully");

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