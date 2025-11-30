// API Client for EV Energy Trading System
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  username: string;
  email: string;
  role: 'consumer' | 'provider' | 'admin';
  wallet_address: string;
  metadata?: Record<string, any>;
}

export interface Car {
  car_id: string;
  user_id: string;
  car_type: string;
  battery_capacity_kwh: number;
  current_soc_percent: number;
  max_output_kw: number;
  max_input_kw: number;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface ChargingRequest {
  request_id: string;
  consumer_car_id: string;
  provider_car_id?: string | null;
  requested_energy_kwh: number;
  estimated_time_min?: number | null;
  price_per_kwh: number;
  total_price?: number | null;
  status: string;
  location: Location;
  telemetry?: Record<string, any>[];
  requested_at: string;
  accepted_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  payment_tx?: PaymentTx | null;
}

export interface PaymentTx {
  tx_hash: string;
  token: string;
  amount: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Users API
  async registerUser(user: User): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users/users`);
    return response.json();
  }

  async getUserById(userId: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/users/${userId}`);
    return response.json();
  }

  // Cars API
  async registerCar(car: Car): Promise<any> {
    const response = await fetch(`${this.baseUrl}/cars/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
    return response.json();
  }

  async getAllCars(): Promise<Car[]> {
    const response = await fetch(`${this.baseUrl}/cars/cars`);
    return response.json();
  }

  async getCarById(carId: string): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/cars/cars/${carId}`);
    return response.json();
  }

  // Location API
  async updateLocation(location: { car_id: string; lat: number; lon: number }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/location/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });
    return response.json();
  }

  // Charging API
  async createChargingRequest(request: Omit<ChargingRequest, 'request_id' | 'requested_at'>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/charging/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async acceptChargingRequest(requestId: string, providerCarId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/charging/accept/${requestId}/${providerCarId}`, {
      method: 'POST',
    });
    return response.json();
  }

  async startCharging(requestId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/charging/start/${requestId}`, {
      method: 'POST',
    });
    return response.json();
  }

  async completeCharging(requestId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/charging/complete/${requestId}`, {
      method: 'POST',
    });
    return response.json();
  }

  async getAllChargingRequests(): Promise<ChargingRequest[]> {
    const response = await fetch(`${this.baseUrl}/charging/all`);
    return response.json();
  }

  async getChargingRequestById(requestId: string): Promise<ChargingRequest> {
    const response = await fetch(`${this.baseUrl}/charging/${requestId}`);
    return response.json();
  }

  // Payments API
  async makePayment(requestId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/pay/${requestId}`, {
      method: 'POST',
    });
    return response.json();
  }

  async getAllPayments(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/payments/all`);
    return response.json();
  }

  async getPaymentByHash(txHash: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/${txHash}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
