// src/server.ts
import express from 'express';
import { retrieveData } from './DataRetriever';
import { getEuroExchangeRates, ExchangeRateResponse } from './MockFetchEuroPrice';

const app = express();
const port = process.env.PORT || 3005;

app.get('/current-price', async (req, res) => {
  try {
    console.log('Request received for /current-price');

    // Fetch the price from DataRetriever
    console.log('Fetching current price from DataRetriever...');
    const currentPrice = await retrieveData();
    console.log(`Current price retrieved: ${currentPrice}`);

    // Fetch the euro exchange rate
    console.log('Fetching euro exchange rate from MockFetchEuroPrice...');
    const exchangeRates: ExchangeRateResponse = await getEuroExchangeRates();
    const euroToUsd = exchangeRates.rates.USD;
    console.log(`Euro to USD exchange rate retrieved: ${euroToUsd}`);

    // Respond with the data
    console.log('Sending response with current price and exchange rate...');
    res.json({
      currentPrice,
      euroToUsd,
    });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error occurred while retrieving current price and exchange rate:', error);
    res.status(500).json({ error: 'Failed to retrieve current price and exchange rate' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
