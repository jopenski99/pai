import {openDB, ensureIndex} from '../idbCrudOperations';

export const energyBillingTable = {
  name: 'apt_electricity_bills',
  columns: [
    { name: 'billing_no', keypath: 'billing_no', options: { unique: true } },
    { name: 'consumed_kwh', keypath: 'consumed_kwh' },
    { name: 'energy_rate', keypath: 'energy_rate' },
    { name: 'month_covered', keypath: 'month_covered' },
    { name: 'total_amount', keypath: 'total_amount' },
    { name: 'date_created', keypath: 'date_created' }
  ],
  
  isInitialized: async () => {
    const db = await openDB();
    return {isInit :db.objectStoreNames.contains(energyBillingTable.name), dbIn: db};
  },
  init: (db) => {
    if (!db.objectStoreNames.contains(energyBillingTable.name)) {
        throw new Error(`Object store ${energyBillingTable.name} does not exist`);
    }
  },
  getLatest: (db) => {
    const transaction = db.transaction(energyBillingTable.name, 'readonly');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.openCursor(null, 'prev');
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
      request.onerror = () => reject(request.error);
    });
  },
  create: (db, data) => {
    const transaction = db.transaction(energyBillingTable.name, 'readwrite');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.add(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  read: (db, room_no) => {
    const transaction = db.transaction(energyBillingTable.name, 'readonly');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.get(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  update: (db, data) => {
    const transaction = db.transaction(energyBillingTable.name, 'readwrite');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  delete: (db, room_no) => {
    const transaction = db.transaction(energyBillingTable.name, 'readwrite');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.delete(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  getAll: (db) => {
    const transaction = db.transaction(energyBillingTable.name, 'readonly');
    const store = transaction.objectStore(energyBillingTable.name);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

};

export default energyBillingTable;