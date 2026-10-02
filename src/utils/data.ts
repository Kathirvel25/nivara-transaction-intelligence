import { GeoCity, Transaction, DeviceType, Customer } from '../types';

export const CITIES: GeoCity[] = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
];

export const CUSTOMERS_DATA = [
  { id: 'C001', name: 'Shri Vishnu' },
  { id: 'C002', name: 'Rahul Kumar' },
  { id: 'C003', name: 'Priya Sharma' },
  { id: 'C004', name: 'Amit Singh' },
  { id: 'C005', name: 'Neha Patel' },
  { id: 'C006', name: 'Suresh Reddy' },
  { id: 'C007', name: 'Ritika Singh' },
  { id: 'C008', name: 'Karan Mehta' },
  { id: 'C009', name: 'Pooja Verma' },
  { id: 'C010', name: 'Arjun Nair' },
  { id: 'C011', name: 'Divya Krishnan' },
  { id: 'C012', name: 'Manish Agarwal' },
  { id: 'C013', name: 'Sneha Iyer' },
  { id: 'C014', name: 'Vikram Malhotra' },
  { id: 'C015', name: 'Anjali Desai' },
  { id: 'C016', name: 'Rohit Gupta' },
  { id: 'C017', name: 'Meera Nambiar' },
  { id: 'C018', name: 'Sanjay Pillai' },
  { id: 'C019', name: 'Kavitha Rajan' },
  { id: 'C020', name: 'Deepak Joshi' },
];

export const AMOUNTS = [
  450, 1200, 2450, 3500, 4500, 6000, 7500, 8750, 10000,
  12000, 15000, 18600, 22000, 25000, 35000, 50000, 75000, 125000, 200000,
];

export const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export const maskName = (name: string): string => {
  const parts = name.split(' ');
  const first = parts[0];
  const last = parts[parts.length - 1];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${first.slice(0, 2)}****${last.slice(-2)}${num}`;
};

export const formatINR = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatINRFull = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const generateTransactionId = (index: number): string => {
  return `NV-2026-${String(index).padStart(5, '0')}`;
};

export const generateOTP = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const formatISTTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
};

export const formatISTDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
};

export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateDemoPhone = (): string => {
  const prefixes = ['98765', '87654', '76543', '91234', '99876', '88765'];
  const prefix = getRandomElement(prefixes);
  const suffix = String(Math.floor(10 + Math.random() * 90));
  return `+91 ${prefix}****${suffix}0`;
};
