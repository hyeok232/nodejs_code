// csvController.js
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const iconv = require("iconv-lite");
const axios = require("axios");
const xml2js = require("xml2js");
const math = require("mathjs");

// 설문조사 결과에 맞는 CSV 파일 불러오기
const loadCsv = async (req, res) => {
  const surveyResult = req.body.dominantTrait;
  console.log("Loaded surveyResult from session:", surveyResult);
  try {
    const results = await loadCsvData(surveyResult);
    res.json(results);
  } catch (error) {
    console.error("CSV 로드 중 오류 발생:", error.message);
    res.status(500).send(error.message);
  }
};

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

// function isValidSurveyResult(surveyResult) {
//     const validResults = ['safety', 'analysis', 'profits', 'obsession'];
//     return validResults.includes(surveyResult);
// }

// 원하는 개수만큼 종목 가져오기 (가중치 적용)
const selectStocks = async (req, res) => {
  const surveyResult = req.session.dominantTrait;
  const count = req.session.count;
  console.log("surveyResult:", surveyResult);
  try {
    const csvData = await loadCsvData(surveyResult.trim());
    const rankColumns = req.session.rankedMetrics;
    console.log(req.body);
    console.log(req.session);
    const topStocks = rankAndSort(csvData, rankColumns, parseInt(count));
    return topStocks;
  } catch (error) {
    console.error("주식 선택하는데 있어 에러:", error.message);
    throw new Error(error.message);
  }
};

const weights = [0.4, 0.3, 0.2, 0.1, 0.05];

function rankAndSort(data, rankColumns, headNum) {
  // 각 데이터에 가중치를 계산하여 Weighted_Rank 추가
  data = data.map((row) => {
    let weightedRank = 0;
    rankColumns.forEach((col, index) => {
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

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

// 원하는 개수만큼 종목 가져오기 (가중치 적용 후 종목 추천 및 투자 계획 수립)
const purchaseStocks = async (req, res) => {
  if (!req.session || !req.session.dominantTrait) {
    return res
      .status(400)
      .send("Session data is missing. Please set the session first.");
  }
  const count = req.session.count;
  const amount = req.session.amount;
  // const basDt =getCurrentDate();
  const basDt = "20241108";

  if (!count || !amount || !basDt) {
    return res
      .status(400)
      .send(
        "Missing required query parameters: surveyResult, count, amount, basDt"
      );
  }

  const topStocks = await selectStocks(req);
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

  const limitedPurchasePlan = stockPurchasePlan.map((plan) => ({
    stockPurchaseDetails: Object.entries(plan.stockPurchaseDetails)
      .filter(([_, details]) => details.shares > 0)
      .slice(0, parseInt(count))
      .map(([stockName, details]) => ({
        stock: stockName,
        price: details.price,
        shares: details.shares,
        totalCost: details.totalCost,
      })),
  }));
  res.json(limitedPurchasePlan);
};

function getTopStocks(filteredStocks, count) {
  if (!Array.isArray(filteredStocks) || filteredStocks.length === 0) {
    throw new Error("Invalid stock data.");
  }

  if (typeof count !== "number" || count <= 0) {
    throw new Error("Count must be a positive number.");
  }

  // 요청된 count가 데이터 길이보다 크면 전체 데이터 반환
  return filteredStocks.slice(0, Math.min(count, filteredStocks.length));
}

function calculateMaximumPurchased(topStocks, amount) {
  if (!Array.isArray(topStocks) || topStocks.length === 0) {
    throw new Error("No stocks available.");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const purchased = [];

  for (const stock of topStocks) {
    if (amount <= 0) break;

    const price = parseFloat(stock["배당수익률"]); // 배당수익률
    if (isNaN(price) || price <= 0) {
      console.warn("Invalid stock price for stock: " + stock["Name"]);
      continue; // 유효하지 않은 가격은 건너뜀
    }

    const maxShares = Math.floor(amount / price);
    if (maxShares > 0) {
      purchased.push({
        name: stock["Name"],
        shares: maxShares,
        price: price,
      });
      amount -= maxShares * price;
    }
  }

  return purchased;
}

module.exports = {
  loadCsv,
  loadCsvData,
  selectStocks,
  purchaseStocks,
  rankAndSort,
};
