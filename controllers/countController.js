// countController.js
const getCount = (req, res) => {
  const { count } = req.body;

  req.session.count = count;
  res.json({ count });

  req.session.save((err) => {
    if (err) {
      console.error("세션 저장 오류:", err);
      return res.status(500).send("세션 저장 오류 발생");
    }
    const countNum = req.session.count;
  });
};

module.exports = {
  getCount,
};
