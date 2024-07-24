//src/FetchEuroPrice.ts
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

async function getEuroExchangeRates(symbols?: string[]): Promise<ExchangeRateResponse> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    throw new Error('API key not found in environment variables');
  }

  const baseUrl = 'https://api.apilayer.com/exchangerates_data/latest';
  const symbolsParam = symbols ? `&symbols=${symbols.join(',')}` : '';
  const url = `${baseUrl}?base=EUR${symbolsParam}`;

  try {
    const response = await axios.get<ExchangeRateResponse>(url, {
      headers: {
        apikey: apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

// Usage example
const symbols = ['USD'];

getEuroExchangeRates(symbols)
  .then((data) => {
    console.log('Euro exchange rates:', data.rates);
  })
  .catch((error) => {
    console.error('Failed to get exchange rates:', error);
  });
