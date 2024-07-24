const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/api/data", async (req, res) => {
  try {
    let d = req.query;
    console.log(req.query);
    const response = await axios.post(
      "https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJSON",
      { OrgId: 506823, ...d }
    );
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?OrgID=506823&Cat1=Summer Classes Worcester&Cat3=Summer ages 3-6&Session=Summer2024&Loc=Worcester&Sort=StartDate&hidecols=Gender,Ages,Openings,Description&showcols=Loc&closed=Full&style=color:Purple&ClassStyle=font-weight:bold
