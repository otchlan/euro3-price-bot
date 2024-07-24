// src/MockFetchEuroPrice.ts

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

const mockExchangeRateData: ExchangeRateResponse = {
  success: true,
  timestamp: Math.floor(Date.now() / 1000),
  base: 'EUR',
  date: new Date().toISOString().split('T')[0],
  rates: {
    USD: 1.12 // Mock rate for USD only
  }
};

export async function getEuroExchangeRates(): Promise<ExchangeRateResponse> {
  console.log(`Using mock data for exchange rates for USD`);
  
  return mockExchangeRateData;
}
