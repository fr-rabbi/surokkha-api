const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const BASE = "https://medex.com.bd";

// 🔎 SEARCH API
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    const url = `${BASE}/ajax/search?searchtype=search&searchkey=${q}`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let results = [];

    $("a.lsri").each((i, el) => {
      const name = $(el).find("span").text().trim();
      const link = BASE + $(el).attr("href");
      const img = $(el).find("img").attr("src");

      results.push({ name, link, img });
    });

    res.json(results);

  } catch (err) {
    res.json({ error: "Search failed" });
  }
});


// 📄 DETAIL API
app.get("/detail", async (req, res) => {
  try {
    const url = req.query.url;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $("h1.brand").text().trim();
    const generic = $('[title="Generic Name"]').text().trim();
    const strength = $('[title="Strength"]').text().trim();
    const company = $('[title="Manufactured by"] a').text().trim();
    const price = $(".package-container span:contains('৳')").first().text().trim();
    const img = $(".innovator-brand-badge").attr("href");

    res.json({
      name,
      generic,
      strength,
      company,
      price,
      img
    });

  } catch (err) {
    res.json({ error: "Detail failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
