// amountController.js
const getAmount = (req, res) => {
  const { amount } = req.body;

  req.session.amount = amount;
  res.json({ amount });

  req.session.save((err) => {
    if (err) {
      console.error("세션 저장 오류:", err);
      return res.status(500).send("세션 저장 오류 발생");
    }
    const amountNum = req.session.amount;
  });
};

module.exports = {
  getAmount,
};
