// statementsController.js
const getRanked = (req, res) => {
  const { per, pbr, roe, dividendYield, dividendPayout } = req.body;

  const priorities = {
    [per]: "PER",
    [pbr]: "PBR",
    [roe]: "ROE",
    [dividendYield]: "배당수익률",
    [dividendPayout]: "배당성향",
  };

  const rankedMetrics = Object.keys(priorities)
    .sort((a, b) => a - b)
    .map((rank) => priorities[rank]);

  req.session.rankedMetrics = rankedMetrics;
  res.json({ rankedMetrics });
  req.session.save((err) => {
    if (err) {
      console.error("세션 저장 오류:", err);
      return res.status(500).send("세션 저장 오류 발생");
    }
    const rankColumns = req.session.rankedMetrics;
  });
};

module.exports = {
  getRanked,
};
