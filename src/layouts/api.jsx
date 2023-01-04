import express from "express";

const app = express();

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

export const handler = app;
