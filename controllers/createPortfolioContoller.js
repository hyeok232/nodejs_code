const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const iconv = require("iconv-lite");
const axios = require("axios");
const xml2js = require("xml2js");
const math = require("mathjs");

const getSurveyData = async (req, res) => {
  const {
    surveyAnswers,
    companyValuesRanks,
    numberOfCompanies,
    investmentAmount,
  } = req.body;

  // 21개 질문 데이터 저장
  const { dominantTrait, traits } = calculateDominantTrait(surveyAnswers);

  const rankedMetrics = createRankedMetrics(companyValuesRanks);

  const count = numberOfCompanies;

  const amount = investmentAmount;

  const basDt = "20241206";

  const topStocks = await selectStocks(dominantTrait, count, rankedMetrics);
  const stockPrices = await getStockPricesFromApi(topStocks, basDt);

  const simulationResults = monteCarloSimulation(topStocks, stockPrices, 1000);
  const bestPortfolio = simulationResults.reduce((best, current) => {
    return current.sharpe > best.sharpe ? current : best;
  }, simulationResults[0]);

  const stockPurchasePlan = calculateMaxStocks(
    [bestPortfolio],
    parseFloat(amount),
    stockPrices
  );

  const limitedPurchasePlan = stockPurchasePlan.map((plan) => {
    // 중첩 구조 제거
    return Object.entries(plan.stockPurchaseDetails)
      .filter(([_, details]) => details.shares > 0)
      .slice(0, parseInt(count))
      .map(([stockName, details]) => ({
        stock: stockName,
        price: details.price,
        shares: details.shares,
        totalCost: details.totalCost,
      }));
  });

  // 응답 구조 평면화
  const result = {
    stockPurchaseDetails: limitedPurchasePlan[0], // 첫 번째 플랜 선택
    traits: traits,
  };

  console.log(result);
  res.json(result);
};

module.exports = {
  getSurveyData,
};

function calculateDominantTrait(surveyAnswers) {
  let traits = {
    profit: 0,
    analysis: 0,
    safety: 0,
    obsession: 0,
  };

  // Q1
  if (surveyAnswers.question1 === true) {
    traits.profit += 0.731;
    traits.analysis += -0.025;
    traits.safety += -0.013;
    traits.obsession += 0.287;
  }

  // Q2
  if (surveyAnswers.question2 === true) {
    traits.profit += 0.707;
    traits.analysis += 0.106;
    traits.safety += 0.059;
    traits.obsession += 0.003;
  }

  // Q3
  if (surveyAnswers.question3 === true) {
    traits.profit += 0.705;
    traits.analysis += 0.141;
    traits.safety += 0.042;
    traits.obsession += 0.054;
  }

  // Q4
  if (surveyAnswers.question4 === true) {
    traits.profit += 0.695;
    traits.analysis += 0.154;
    traits.safety += 0.15;
    traits.obsession += -0.14;
  }

  // Q5
  if (surveyAnswers.question5 === true) {
    traits.profit += 0.659;
    traits.analysis += 0.115;
    traits.safety += -0.084;
    traits.obsession += 0.254;
  }

  // Q6
  if (surveyAnswers.question6 === true) {
    traits.profit += 0.648;
    traits.analysis += 0.108;
    traits.safety += -0.054;
    traits.obsession += 0.384;
  }

  // Q7
  if (surveyAnswers.question7 === true) {
    traits.profit += 0.489;
    traits.analysis += 0.159;
    traits.safety += 0.086;
    traits.obsession += 0.288;
  }

  // Q8
  if (surveyAnswers.question8 === true) {
    traits.profit += 0.095;
    traits.analysis += 0.795;
    traits.safety += 0.225;
    traits.obsession += 0.112;
  }

  // Q9
  if (surveyAnswers.question9 === true) {
    traits.profit += 0.1;
    traits.analysis += 0.776;
    traits.safety += 0.231;
    traits.obsession += 0.149;
  }

  // Q10
  if (surveyAnswers.question10 === true) {
    traits.profit += 0.098;
    traits.analysis += 0.701;
    traits.safety += 0.148;
    traits.obsession += 0.173;
  }

  // Q11
  if (surveyAnswers.question11 === true) {
    traits.profit += 0.248;
    traits.analysis += 0.695;
    traits.safety += 0.209;
    traits.obsession += 0.186;
  }

  // Q12
  if (surveyAnswers.question12 === true) {
    traits.profit += 0.142;
    traits.analysis += 0.659;
    traits.safety += 0.235;
    traits.obsession += 0.039;
  }

  // Q13
  if (surveyAnswers.question13 === true) {
    traits.profit += -0.012;
    traits.analysis += 0.196;
    traits.safety += 0.761;
    traits.obsession += 0.027;
  }

  // Q14
  if (surveyAnswers.question14 === true) {
    traits.profit += -0.145;
    traits.analysis += 0.227;
    traits.safety += 0.731;
    traits.obsession += 0.184;
  }

  // Q15
  if (surveyAnswers.question15 === true) {
    traits.profit += 0.003;
    traits.analysis += 0.148;
    traits.safety += 0.708;
    traits.obsession += 0.067;
  }

  // Q16
  if (surveyAnswers.question16 === true) {
    traits.profit += 0.216;
    traits.analysis += 0.118;
    traits.safety += 0.7;
    traits.obsession += -0.196;
  }

  // Q17
  if (surveyAnswers.question17 === true) {
    traits.profit += 0.126;
    traits.analysis += 0.358;
    traits.safety += 0.613;
    traits.obsession += 0.032;
  }

  // Q18
  if (surveyAnswers.question18 === true) {
    traits.profit += 0.169;
    traits.analysis += 0.168;
    traits.safety += -0.08;
    traits.obsession += 0.817;
  }

  // Q19
  if (surveyAnswers.question19 === true) {
    traits.profit += 0.22;
    traits.analysis += 0.053;
    traits.safety += 0.011;
    traits.obsession += 0.805;
  }

  // Q20
  if (surveyAnswers.question20 === true) {
    traits.profit += 0.058;
    traits.analysis += 0.215;
    traits.safety += 0.213;
    traits.obsession += 0.702;
  }

  // Q21
  if (surveyAnswers.question21 === true) {
    traits.profit += 0.347;
    traits.analysis += 0.362;
    traits.safety += -0.006;
    traits.obsession += 0.488;
  }

  // 가장 높은 성향 찾기
  const dominantTrait = Object.keys(traits).reduce((a, b) =>
    traits[a] > traits[b] ? a : b
  );

  return { dominantTrait, traits };
}

function createRankedMetrics(companyValuesRanks) {
  const { per, pbr, roe, dividendYield, dividendPayout } = companyValuesRanks;

  const priorities = {
    [per]: "PER",
    [pbr]: "PBR",
    [roe]: "ROE",
    [dividendYield]: "배당수익률",
    [dividendPayout]: "배당성향",
  };

  const result = Object.keys(priorities)
    .sort((a, b) => a - b)
    .map((rank) => priorities[rank]);

  return result;
}

// 원하는 개수만큼 종목 가져오기 (가중치 적용)
const selectStocks = async (dominantTrait, count, rankedMetrics) => {
  try {
    const csvData = await loadCsvData(dominantTrait.trim());
    const topStocks = rankAndSort(csvData, rankedMetrics, parseInt(count));
    return topStocks;
  } catch (error) {
    console.error("주식 선택하는데 있어 에러:", error.message);
    throw new Error(error.message);
  }
};

// 주식 가격 가져오는 함수 (Open API 호출)
function getStockPricesFromApi(stocks, basDt) {
  const stockNames = stocks.map((stock) => stock["Name"]);
  const apiUrl =
    "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
  const fixedServiceKey =
    "DP%2Ba92zdiSA5P1FCb3DWExEvRWD5do%2Fpg5YnIMz%2BpNbG31wug1xhigDi%2BEaUJjO6%2BKbAD73w2xZdKYeF3eviIQ%3D%3D";

  const priceRequests = stockNames.map((name) => {
    const params = {
      serviceKey: decodeURIComponent(fixedServiceKey),
      basDt,
      itmsNm: name,
      numOfRows: 1,
      pageNo: 1,
    };

    return axios
      .get(apiUrl, { params })
      .then((response) => {
        console.log("API response:", response.data); // 응답 데이터를 콘솔에 출력
        return xml2js.parseStringPromise(response.data);
      })
      .then((parsedData) => {
        const items = parsedData?.response?.body?.[0]?.items?.[0]?.item;

        if (items && Array.isArray(items) && items[0]?.clpr) {
          return {
            name: name.toLowerCase(),
            price: parseFloat(items[0].clpr[0]),
          };
        }
        console.warn(`No price data found for stock name: ${name}`);
        return { name: name.toLowerCase(), price: null };
      })
      .catch((error) => {
        console.error(
          `Error fetching price for stock name ${name}:`,
          error.message
        );
        return { name: name.toLowerCase(), price: null };
      });
  });

  return Promise.all(priceRequests).then((priceResults) => {
    return priceResults.reduce((acc, { name, price }) => {
      if (price) acc[name] = price;
      return acc;
    }, {});
  });
}

// 몬테카를로 시뮬레이션 함수
function monteCarloSimulation(data, stockPrices, numPortfolios = 1000) {
  // 포트폴리오 수를 기본적으로 1000개로 설정
  const stockNames = data.map((stock) => stock["Name"].toLowerCase());
  const annualReturns = stockNames.map((name) =>
    stockPrices[name] ? stockPrices[name] / 100 : 0.1
  );
  const dailyVolatilities = stockNames.map((name) => 0.02); // 가정된 일간 변동성 값 사용

  const portRet = [];
  const portRisk = [];
  const portWeights = [];
  const sharpeRatio = [];

  for (let i = 0; i < numPortfolios; i++) {
    const weights = math.random([stockNames.length]);
    const sumWeights = math.sum(weights);
    const normalizedWeights = weights.map((weight) => weight / sumWeights);

    // 포트폴리오 수익률 계산
    const portfolioReturn = math.dot(normalizedWeights, annualReturns);

    // 포트폴리오 리스크 계산 (공분산 행렬 사용)
    let portfolioRisk = 0;
    for (let j = 0; j < stockNames.length; j++) {
      for (let k = 0; k < stockNames.length; k++) {
        portfolioRisk +=
          normalizedWeights[j] *
          normalizedWeights[k] *
          dailyVolatilities[j] *
          dailyVolatilities[k];
      }
    }
    portfolioRisk = Math.sqrt(portfolioRisk);

    // 샤프 비율 계산
    const sharpe = portfolioReturn / portfolioRisk;

    portRet.push(portfolioReturn);
    portRisk.push(portfolioRisk);
    portWeights.push(normalizedWeights);
    sharpeRatio.push(sharpe);
  }

  return portWeights.map((weights, index) => ({
    returns: portRet[index],
    risk: portRisk[index],
    sharpe: sharpeRatio[index],
    weights: stockNames.reduce((acc, name, i) => {
      acc[name] = weights[i];
      return acc;
    }, {}),
  }));
}

// 최대한의 주식을 구매하는 함수
function calculateMaxStocks(simulationResults, investmentAmount, stockPrices) {
  return simulationResults.map((portfolio) => {
    const stockPurchaseDetails = {};
    let remainingAmount = investmentAmount;

    for (const stockName in portfolio.weights) {
      const stockPrice = stockPrices[stockName];

      // 주식 가격이 투자 가능 금액보다 큰 경우
      if (stockPrice > remainingAmount) {
        console.log(
          `${stockName}의 가격이 ${remainingAmount}보다 큽니다. 구매 불가.`
        );
        stockPurchaseDetails[stockName] = {
          price: stockPrice,
          shares: 0,
          totalCost: 0,
        };
        continue;
      }

      // 최소 한 주를 구매할 수 있는 경우
      let shares = Math.max(
        1,
        Math.floor(
          (remainingAmount * portfolio.weights[stockName]) / stockPrice
        )
      );
      shares = Math.min(shares, Math.floor(remainingAmount / stockPrice));

      if (shares > 0) {
        stockPurchaseDetails[stockName] = {
          price: stockPrice,
          shares: shares,
          totalCost: shares * stockPrice,
        };
        remainingAmount -= shares * stockPrice;
      } else {
        stockPurchaseDetails[stockName] = {
          price: stockPrice,
          shares: 1,
          totalCost: stockPrice,
        };
        remainingAmount -= stockPrice;
      }
    }

    // 남은 금액으로 추가 구매 가능 여부 확인
    const sortedStocks = Object.keys(portfolio.weights).sort(
      (a, b) => portfolio.weights[b] - portfolio.weights[a]
    );
    for (const stockName of sortedStocks) {
      if (remainingAmount <= 0) break;

      const stockPrice = stockPrices[stockName];
      const additionalShares = Math.floor(remainingAmount / stockPrice);

      if (additionalShares > 0) {
        stockPurchaseDetails[stockName].shares += additionalShares;
        stockPurchaseDetails[stockName].totalCost +=
          additionalShares * stockPrice;
        remainingAmount -= additionalShares * stockPrice;
      }
    }

    return {
      stockPurchaseDetails,
    };
  });
}

function rankAndSort(data, rankedMetrics, headNum) {
  const weights = [0.4, 0.3, 0.2, 0.1, 0.05];
  // 각 데이터에 가중치를 계산하여 Weighted_Rank 추가
  data = data.map((row) => {
    let weightedRank = 0;
    rankedMetrics.forEach((col, index) => {
      const value = parseFloat(row[col]) || 0; // NaN 처리
      weightedRank += value * weights[index];
    });
    return { ...row, Weighted_Rank: weightedRank };
  });

  // Weighted_Rank를 기준으로 내림차순 정렬
  data.sort((a, b) => b.Weighted_Rank - a.Weighted_Rank);

  // 필요한 열만 선택하여 상위 headNum개의 행을 반환
  return data.slice(0, headNum).map((row) => {
    return {
      Code: row["Code"],
      Name: row["Name"],
      Weighted_Rank: row["Weighted_Rank"],
      ...Object.fromEntries(Object.entries(row).slice(2)), // 필요한 열만 선택
    };
  });
}

const loadCsvData = async (surveyResult) => {
  const fileName = `${surveyResult.trim()}.csv`;
  // const fileName = 'safety.csv';
  const filePath = path.join(__dirname, "../csvs", fileName);

  const results = [];
  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream("euc-kr")) // 인코딩 변환
    .pipe(csv());

  for await (const data of stream) {
    data["PER"] = parseFloat(data["PER"]) || 0;
    data["PBR"] = parseFloat(data["PBR"]) || 0;
    data["ROE"] = parseFloat(data["ROE"]) || 0;
    data["배당수익률"] = parseFloat(data["배당수익률"]) || 0;
    data["배당성향"] = parseFloat(data["배당성향"]) || 0;
    results.push(data);
  }

  if (results.length === 0) {
    throw new Error("CSV 파일이 비어 있습니다.");
  }

  return results;
};
