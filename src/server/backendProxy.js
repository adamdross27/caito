import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5001;

// enable CORS
app.use(cors());

const fetchAllJobs = async (searchTerm) => {
  let page = 1;
  let allJobs = [];
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const apiResponse = await axios.get(
        "https://www.jobstreet.com.ph/api/chalice-search/v4/search",
        {
          params: {
            siteKey: "PH-Main",
            sourcesystem: "houston",
            userqueryid: "2aabcfda290a21aaa61bd460da16f131-3442921",
            userid: "aa722429-8ae3-4164-9ec4-46343ce817e8",
            usersessionid: "aa722429-8ae3-4164-9ec4-46343ce817e8",
            eventCaptureSessionId: "aa722429-8ae3-4164-9ec4-46343ce817e8",
            page: page,
            seekSelectAllPages: true,
            keywords: searchTerm,
            pageSize: 30,
            include: "seodata",
            locale: "en-PH",
            solId: "5b5704dd-43b4-4810-abfd-30db8c6ea1be",
          },
        }
      );

      let jsonData = apiResponse.data;

      // clean data
      delete jsonData.solMetadata;
      delete jsonData.facets;
      delete jsonData.joraCrossLink;
      delete jsonData.searchParams;
      delete jsonData.info;
      delete jsonData.userQueryId;
      delete jsonData.sortMode;
      delete jsonData.title;
      delete jsonData.paginationParameters;
      allJobs = allJobs.concat(jsonData);

      const totalPages = apiResponse.data.totalPages || 1;
      page++;

      hasMorePages = page <= totalPages;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      hasMorePages = false;
    }
  }

  return allJobs;
};

app.get("/api/job-search", async (req, res) => {
  const searchTerm = req.query.term;

  try {
    const allJobs = await fetchAllJobs(searchTerm);
    res.json({ jobs: allJobs });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data from external API." });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
