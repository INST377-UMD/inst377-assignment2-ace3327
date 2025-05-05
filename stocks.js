const POLYGON_API_KEY = 'Y8Bq_ohYOOpG9o2Ln6cpb5hvpc1Wyobc';
let chart;

function lookupStock(ticker = null) {
  const input = ticker || document.getElementById('tickerInput').value.toUpperCase();
  const range = parseInt(document.getElementById('dayRange').value);
  const end = Math.floor(Date.now() / 1000);
  const start = end - (range * 24 * 60 * 60);

  const url = `https://api.polygon.io/v2/aggs/ticker/${input}/range/1/day/${start}/${end}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const labels = data.results.map(r => new Date(r.t).toLocaleDateString());
      const prices = data.results.map(r => r.c);

      if (chart) chart.destroy();
      const ctx = document.getElementById('stockChart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${input} Closing Prices`,
            data: prices,
            borderColor: 'blue',
            fill: false
          }]
        }
      });
    })
    .catch(err => {
      alert('Failed to fetch stock data. Check the ticker symbol.');
      console.error(err);
    });
}

function loadRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(res => res.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector('#redditTable tbody');
      tbody.innerHTML = '';
      top5.forEach(stock => {
        const row = document.createElement('tr');

        const link = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
        const icon = stock.sentiment === 'Bullish' ? '📈' : '📉';

        row.innerHTML = `
          <td>${link}</td>
          <td>${stock.no_of_comments}</td>
          <td>${icon} ${stock.sentiment}</td>
        `;
        tbody.appendChild(row);
      });
    });
}

window.addEventListener('DOMContentLoaded', () => {
  loadRedditStocks();

  if (annyang) {
    annyang.addCommands({
      'lookup *stock': (spoken) => {
        const stockMap = {
          microsoft: 'MSFT',
          apple: 'AAPL',
          google: 'GOOG',
          tesla: 'TSLA',
          amazon: 'AMZN'
        };
        const ticker = stockMap[spoken.toLowerCase()] || spoken.toUpperCase();
        document.getElementById('tickerInput').value = ticker;
        document.getElementById('dayRange').value = '30';
        lookupStock(ticker);
      }
    });
  }
});