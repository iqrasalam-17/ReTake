export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: "unavailable", sources: [], message: "method" });
  }

  const key = process.env.PARALLEL_API_KEY;
  const query =
    (req.body && (req.body.query || req.body.objective || req.body.q)) || "";

  if (!key || !query) {
    return res.status(200).json({
      status: "unavailable",
      message: "parallel search unavailable",
      sources: [],
    });
  }

  try {
    const r = await fetch("https://api.parallel.ai/v1beta/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify({
        objective: query,
        search_queries: [query],
        max_results: 5,
      }),
    });

    const data = await r.json();
    const raw = data.results || data.hits || [];
    const sources = raw
      .map((item) => {
        const url = item.url || item.link || "";
        let domain = item.domain || "";
        try {
          if (url) domain = new URL(url).hostname.replace(/^www\./, "");
        } catch {}
        const excerpt =
          (item.excerpts && item.excerpts[0]) ||
          item.excerpt ||
          item.snippet ||
          item.content ||
          "";
        return {
          title: item.title || item.name || domain || "source",
          url,
          domain,
          excerpt: String(excerpt).slice(0, 220),
        };
      })
      .filter((s) => s.url);

    return res.status(200).json({
      status: sources.length ? "ok" : "unavailable",
      message: sources.length ? undefined : "parallel search unavailable",
      sources,
    });
  } catch (err) {
    return res.status(200).json({
      status: "unavailable",
      message: "parallel search unavailable",
      sources: [],
    });
  }
}
