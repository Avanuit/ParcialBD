const express = require("express");
const talentRoutes = require("./routes/talent.routes");
const jobsRoutes = require("./routes/jobs.routes");

const PORT = 5000;
const api = express();

api.use(express.json());
api.use(express.static("public"));

api.use("/talent", talentRoutes);
api.use("/jobs", jobsRoutes);

api.listen(PORT, () => {
    console.log("Server running in http://localhost:5000");
});