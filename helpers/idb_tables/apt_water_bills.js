import { openDB } from '../idbCrudOperations';

export const waterBillingTable = {
  name: 'apt_water_bills',
  columns: [
    { name: 'billing_no', keypath: 'billing_no', options: { unique: true } },
    { name: 'water_consumed', keypath: 'water_consumed' },
    { name: 'water_rate', keypath: 'water_rate' },
    { name: 'month_covered', keypath: 'month_covered' },
    { name: 'total_amount', keypath: 'total_amount' },
    { name: 'date_created', keypath: 'date_created' }
  ],

  isInitialized: async () => {
    const db = await openDB();
    return { isInit: db.objectStoreNames.contains(waterBillingTable.name), dbIn: db };
  },
  init: (db) => {
    if (!db.objectStoreNames.contains(waterBillingTable.name)) {
      throw new Error(`Object store ${waterBillingTable.name} does not exist`);
    }
  },
  getLatest: (db) => {
    const transaction = db.transaction(waterBillingTable.name, 'readonly');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.openCursor(null, 'prev');
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
      request.onerror = () => reject(request.error);
    });
  },
  create: (db, data) => {
    console.log(data)
    let waterRate
    let waterRateString
    if (data.total_amount && data.water_consumed) {
      waterRate = parseFloat(data.total_amount) / parseFloat(data.water_consumed);
      waterRateString = isNaN(waterRate) ? '' : waterRate.toFixed(2);
    }

    let newData = {...data, water_rate: waterRateString};
    console.log(newData)
    const transaction = db.transaction(waterBillingTable.name, 'readwrite');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.add(newData);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  read: (db, room_no) => {
    const transaction = db.transaction(waterBillingTable.name, 'readonly');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.get(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  update: (db, data) => {
    const transaction = db.transaction(waterBillingTable.name, 'readwrite');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  delete: (db, room_no) => {
    const transaction = db.transaction(waterBillingTable.name, 'readwrite');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.delete(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  getAll: (db) => {
    const transaction = db.transaction(waterBillingTable.name, 'readonly');
    const store = transaction.objectStore(waterBillingTable.name);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

};

export default waterBillingTable;