// propensityController.js
const surveyWeight = (req, res) => {
  const weights = req.body; // 사용자의 응답을 가져옴
  let traits = {
    profit: 0,
    analysis: 0,
    safety: 0,
    obsession: 0,
  };

  // Q1
  if (weights.question1 === "예") {
    traits.profit += 0.731;
    traits.analysis += -0.025;
    traits.safety += -0.013;
    traits.obsession += 0.287;
  }

  // Q2
  if (weights.question2 === "예") {
    traits.profit += 0.707;
    traits.analysis += 0.106;
    traits.safety += 0.059;
    traits.obsession += 0.003;
  }

  // Q3
  if (weights.question3 === "예") {
    traits.profit += 0.705;
    traits.analysis += 0.141;
    traits.safety += 0.042;
    traits.obsession += 0.054;
  }

  // Q4
  if (weights.question4 === "예") {
    traits.profit += 0.695;
    traits.analysis += 0.154;
    traits.safety += 0.15;
    traits.obsession += -0.14;
  }

  // Q5
  if (weights.question5 === "예") {
    traits.profit += 0.659;
    traits.analysis += 0.115;
    traits.safety += -0.084;
    traits.obsession += 0.254;
  }

  // Q6
  if (weights.question6 === "예") {
    traits.profit += 0.648;
    traits.analysis += 0.108;
    traits.safety += -0.054;
    traits.obsession += 0.384;
  }

  // Q7
  if (weights.question7 === "예") {
    traits.profit += 0.489;
    traits.analysis += 0.159;
    traits.safety += 0.086;
    traits.obsession += 0.288;
  }

  // Q8
  if (weights.question8 === "예") {
    traits.profit += 0.095;
    traits.analysis += 0.795;
    traits.safety += 0.225;
    traits.obsession += 0.112;
  }

  // Q9
  if (weights.question9 === "예") {
    traits.profit += 0.1;
    traits.analysis += 0.776;
    traits.safety += 0.231;
    traits.obsession += 0.149;
  }

  // Q10
  if (weights.question10 === "예") {
    traits.profit += 0.098;
    traits.analysis += 0.701;
    traits.safety += 0.148;
    traits.obsession += 0.173;
  }

  // Q11
  if (weights.question11 === "예") {
    traits.profit += 0.248;
    traits.analysis += 0.695;
    traits.safety += 0.209;
    traits.obsession += 0.186;
  }

  // Q12
  if (weights.question12 === "예") {
    traits.profit += 0.142;
    traits.analysis += 0.659;
    traits.safety += 0.235;
    traits.obsession += 0.039;
  }

  // Q13
  if (weights.question13 === "예") {
    traits.profit += -0.012;
    traits.analysis += 0.196;
    traits.safety += 0.761;
    traits.obsession += 0.027;
  }

  // Q14
  if (weights.question14 === "예") {
    traits.profit += -0.145;
    traits.analysis += 0.227;
    traits.safety += 0.731;
    traits.obsession += 0.184;
  }

  // Q15
  if (weights.question15 === "예") {
    traits.profit += 0.003;
    traits.analysis += 0.148;
    traits.safety += 0.708;
    traits.obsession += 0.067;
  }

  // Q16
  if (weights.question16 === "예") {
    traits.profit += 0.216;
    traits.analysis += 0.118;
    traits.safety += 0.7;
    traits.obsession += -0.196;
  }

  // Q17
  if (weights.question17 === "예") {
    traits.profit += 0.126;
    traits.analysis += 0.358;
    traits.safety += 0.613;
    traits.obsession += 0.032;
  }

  // Q18
  if (weights.question18 === "예") {
    traits.profit += 0.169;
    traits.analysis += 0.168;
    traits.safety += -0.08;
    traits.obsession += 0.817;
  }

  // Q19
  if (weights.question19 === "예") {
    traits.profit += 0.22;
    traits.analysis += 0.053;
    traits.safety += 0.011;
    traits.obsession += 0.805;
  }

  // Q20
  if (weights.question20 === "예") {
    traits.profit += 0.058;
    traits.analysis += 0.215;
    traits.safety += 0.213;
    traits.obsession += 0.702;
  }

  // Q21
  if (weights.question21 === "예") {
    traits.profit += 0.347;
    traits.analysis += 0.362;
    traits.safety += -0.006;
    traits.obsession += 0.488;
  }

  // 가장 높은 성향 찾기
  const dominantTrait = Object.keys(traits).reduce((a, b) =>
    traits[a] > traits[b] ? a : b
  );
  req.session.dominantTrait = dominantTrait;
  console.log("가장 높은 성향:", req.session.dominantTrait);
  res.json({
    dominantTrait: req.session.dominantTrait,
  });
};

module.exports = {
  surveyWeight,
};
