const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, "..", "frontend");
const projectsPath = path.join(__dirname, "projects.json");

app.use(express.static(frontendDir));

app.get("/projects", async (_req, res) => {
  try {
    const rawProjects = await fs.readFile(projectsPath, "utf8");
    const projects = JSON.parse(rawProjects);
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load project data right now."
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
