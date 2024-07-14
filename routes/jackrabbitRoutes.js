const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?OrgID=506823"
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
