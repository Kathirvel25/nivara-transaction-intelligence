import {
  Transaction,
  TransactionStatus,
  CheckEvent,
  AppSettings,
} from '../types';
import {
  CITIES,
  CUSTOMERS_DATA,
  AMOUNTS,
  haversineDistance,
  maskName,
  generateTransactionId,
  generateOTP,
  getRandomElement,
  generateDemoPhone,
} from './data';

let txnCounter = 10000;

export const getNextTxnId = () => {
  txnCounter++;
  return txnCounter;
};

export const generateSafeTransaction = (
  customerMap: Map<string, Transaction>,
  settings: AppSettings
): Transaction => {
  const customer = getRandomElement(CUSTOMERS_DATA);
  const prevTxn = customerMap.get(customer.id);

  let city: (typeof CITIES)[0];
  let timestamp: Date;
  let distanceKm: number | undefined;
  let timeDiffMinutes: number | undefined;

  if (prevTxn) {
    // Safe: either same city or large time gap
    const sameCity = Math.random() < 0.6;
    if (sameCity) {
      city = prevTxn.city;
      timestamp = new Date(prevTxn.timestamp.getTime() + (15 + Math.random() * 120) * 60000);
      distanceKm = 0;
      timeDiffMinutes = Math.round((timestamp.getTime() - prevTxn.timestamp.getTime()) / 60000);
    } else {
      // Different city but long time gap
      const candidateCities = CITIES.filter(c => c.name !== prevTxn.city.name);
      city = getRandomElement(candidateCities);
      distanceKm = haversineDistance(prevTxn.city.lat, prevTxn.city.lng, city.lat, city.lng);
      // Ensure time gap > threshold (safe scenario)
      timeDiffMinutes = settings.timeThresholdMinutes + Math.floor(Math.random() * 240) + 30;
      timestamp = new Date(prevTxn.timestamp.getTime() + timeDiffMinutes * 60000);
    }
  } else {
    city = getRandomElement(CITIES);
    timestamp = new Date(Date.now() - Math.random() * 3600000);
  }

  const amount = getRandomElement(AMOUNTS);
  const devices: ['Mobile', 'Desktop', 'Tablet'] = ['Mobile', 'Desktop', 'Tablet'];
  const device = devices[Math.floor(Math.random() * devices.length)];
  const idx = getNextTxnId();

  const txn: Transaction = {
    id: generateTransactionId(idx),
    customerId: customer.id,
    customerName: customer.name,
    amount,
    recipientMasked: maskName(getRandomElement(CUSTOMERS_DATA).name),
    device,
    city,
    timestamp,
    status: 'processing',
    previousTransaction: prevTxn,
    distanceKm,
    timeDiffMinutes,
    isSuspicious: false,
    otpCode: undefined,
    otpAttempts: 0,
    otpMaxAttempts: 3,
    checkTimeline: [],
    demoPhone: generateDemoPhone(),
  } as Transaction & { demoPhone: string };

  return txn;
};

export const generateSuspiciousTransaction = (
  customerMap: Map<string, Transaction>,
  settings: AppSettings
): Transaction => {
  const customer = getRandomElement(CUSTOMERS_DATA);
  const prevTxn = customerMap.get(customer.id);

  let city: (typeof CITIES)[0];
  let timestamp: Date;
  let distanceKm: number = 0;
  let timeDiffMinutes: number;
  let prevCity: (typeof CITIES)[0];

  if (prevTxn) {
    prevCity = prevTxn.city;
    // Find a city that is far enough
    let farCity: typeof CITIES[0] | null = null;
    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = getRandomElement(CITIES.filter(c => c.name !== prevCity.name));
      const d = haversineDistance(prevCity.lat, prevCity.lng, candidate.lat, candidate.lng);
      if (d > settings.distanceThresholdKm) {
        farCity = candidate;
        distanceKm = d;
        break;
      }
    }
    if (!farCity) {
      // Fallback: use Chennai -> Mumbai
      const ch = CITIES.find(c => c.name === 'Chennai')!;
      const mb = CITIES.find(c => c.name === 'Mumbai')!;
      farCity = prevCity.name === 'Mumbai' ? ch : mb;
      distanceKm = haversineDistance(prevCity.lat, prevCity.lng, farCity.lat, farCity.lng);
    }
    city = farCity ?? (CITIES.find(c => c.name === 'Mumbai') ?? CITIES[0]);
    // Time diff must be < threshold (suspicious)
    timeDiffMinutes = Math.floor(Math.random() * (settings.timeThresholdMinutes - 1)) + 1;
    timestamp = new Date(prevTxn.timestamp.getTime() + timeDiffMinutes * 60000);
  } else {
    // No prev: create a fake prev for this txn
    prevCity = getRandomElement(CITIES);
    city = getRandomElement(CITIES.filter(c => c.name !== prevCity.name));
    distanceKm = haversineDistance(prevCity.lat, prevCity.lng, city.lat, city.lng);
    if (distanceKm <= settings.distanceThresholdKm) {
      const ch = CITIES.find(c => c.name === 'Chennai')!;
      const mb = CITIES.find(c => c.name === 'Mumbai')!;
      prevCity = ch;
      city = mb;
      distanceKm = haversineDistance(ch.lat, ch.lng, mb.lat, mb.lng);
    }
    timeDiffMinutes = Math.floor(Math.random() * (settings.timeThresholdMinutes - 1)) + 1;
    timestamp = new Date();
    const fakeIdx = getNextTxnId() - 1;
    const fakePrev: Transaction = {
      id: generateTransactionId(fakeIdx),
      customerId: customer.id,
      customerName: customer.name,
      amount: getRandomElement(AMOUNTS),
      recipientMasked: maskName(getRandomElement(CUSTOMERS_DATA).name),
      device: 'Mobile',
      city: prevCity,
      timestamp: new Date(timestamp.getTime() - timeDiffMinutes * 60000),
      status: 'approved',
      isSuspicious: false,
      otpAttempts: 0,
      otpMaxAttempts: 3,
      checkTimeline: [],
    };
    const amount2 = getRandomElement(AMOUNTS);
    const devices: ['Mobile', 'Desktop', 'Tablet'] = ['Mobile', 'Desktop', 'Tablet'];
    const device2 = devices[Math.floor(Math.random() * devices.length)];
    const idx = getNextTxnId();
    const txn2: Transaction = {
      id: generateTransactionId(idx),
      customerId: customer.id,
      customerName: customer.name,
      amount: amount2,
      recipientMasked: maskName(getRandomElement(CUSTOMERS_DATA).name),
      device: device2,
      city,
      timestamp,
      status: 'processing',
      previousTransaction: fakePrev,
      distanceKm,
      timeDiffMinutes,
      isSuspicious: true,
      otpCode: generateOTP(),
      otpAttempts: 0,
      otpMaxAttempts: 3,
      checkTimeline: [],
      fraudReason: 'Location changed too quickly',
      demoPhone: generateDemoPhone(),
    } as Transaction & { demoPhone: string };
    return txn2;
  }

  const amount = getRandomElement(AMOUNTS);
  const devices: ['Mobile', 'Desktop', 'Tablet'] = ['Mobile', 'Desktop', 'Tablet'];
  const device = devices[Math.floor(Math.random() * devices.length)];
  const idx = getNextTxnId();

  const txn: Transaction = {
    id: generateTransactionId(idx),
    customerId: customer.id,
    customerName: customer.name,
    amount,
    recipientMasked: maskName(getRandomElement(CUSTOMERS_DATA).name),
    device,
    city,
    timestamp,
    status: 'processing',
    previousTransaction: prevTxn,
    distanceKm,
    timeDiffMinutes,
    isSuspicious: true,
    otpCode: generateOTP(),
    otpAttempts: 0,
    otpMaxAttempts: 3,
    checkTimeline: [],
    fraudReason: 'Location changed too quickly',
    demoPhone: generateDemoPhone(),
  } as Transaction & { demoPhone: string };

  return txn;
};

export const generateTransaction = (
  customerMap: Map<string, Transaction>,
  settings: AppSettings,
  forceType?: 'safe' | 'suspicious'
): Transaction => {
  const suspicious = forceType === 'suspicious' ||
    (forceType !== 'safe' && Math.random() < 0.25);

  if (suspicious) {
    return generateSuspiciousTransaction(customerMap, settings);
  }
  return generateSafeTransaction(customerMap, settings);
};

export const generateInitialTransactions = (
  count: number,
  settings: AppSettings
): { transactions: Transaction[]; customerMap: Map<string, Transaction> } => {
  const customerMap = new Map<string, Transaction>();
  const transactions: Transaction[] = [];
  const baseTime = new Date(Date.now() - count * 15000);

  for (let i = 0; i < count; i++) {
    const t = generateTransaction(customerMap, settings);
    // Adjust timestamp to be in the past
    t.timestamp = new Date(baseTime.getTime() + i * 12000 + Math.random() * 5000);
    if (t.previousTransaction) {
      t.previousTransaction.timestamp = new Date(
        t.timestamp.getTime() - (t.timeDiffMinutes || 30) * 60000
      );
    }
    // These initial ones are already processed
    if (t.isSuspicious) {
      t.status = Math.random() < 0.5 ? 'blocked' : 'approved';
    } else {
      t.status = 'approved';
    }
    customerMap.set(t.customerId, t);
    transactions.unshift(t);
  }

  return { transactions, customerMap };
};
