import { ensureIndex, openDB } from '../idbCrudOperations';
export const roomBillingTable = {
    name: 'room_billings',
    columns: [
      { name: 'billing_no', keypath: 'billing_no', options: { unique: true } },
      { name: 'room_no', keypath: 'room_no' },
      { name: 'month_covered', keypath: 'month_covered' },
      { name: 'water_consumed', keypath: 'water_consumed' },
      { name: 'water_bill', keypath: 'water_bill' },
      { name: 'water_bill_date', keypath: 'water_bill_date' },
      { name: 'water_bill_date_paid', keypath: 'water_bill_date_paid' },
      { name: 'energy_bill', keypath: 'energy_bill' },
      { name: 'energy_consumed', keypath: 'energy_consumed' },
      { name: 'energy_bill_date', keypath: 'energy_bill_date' },  
      { name: 'energy_bill_date_paid', keypath: 'energy_bill_date_paid' },
      { name: 'date_created', keypath: 'date_created' },
    ],
    isInitialized: async () => {
        const db = await openDB();
        return { isInit: db.objectStoreNames.contains(roomBillingTable.name), dbIn: db };
      },
    init: (db) => {
      if (!db.objectStoreNames.contains(roomBillingTable.name)) {
        throw new Error(`Object store ${roomBillingTable.name} does not exist`);
      }
    },
  
    create: (db, newRoomBilling) => {
      const transaction = db.transaction(roomBillingTable.name, 'readwrite');
      const store = transaction.objectStore(roomBillingTable.name);
      const request = store.add(newRoomBilling);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
  
    update: (db, room_no, updatedRoomBilling) => {
      const transaction = db.transaction(roomBillingTable.name, 'readwrite');
      const store = transaction.objectStore(roomBillingTable.name);
      const request = store.put(updatedRoomBilling, room_no);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
  
    delete: (db, room_no) => {
      const transaction = db.transaction(roomBillingTable.name, 'readwrite');
      const store = transaction.objectStore(roomBillingTable.name);
      const request = store.delete(room_no);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
  
    read: (db, room_no) => {
      const transaction = db.transaction(roomBillingTable.name, 'readonly');
      const store = transaction.objectStore(roomBillingTable.name);
      const request = store.get(room_no);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
  
    readAll: (db) => {
      const transaction = db.transaction(roomBillingTable.name, 'readonly');
      const store = transaction.objectStore(roomBillingTable.name);
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
  
    getCurrentBill: (db) => {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();
      const last3Months = [];
      for (let i = 0; i < 3; i++) {
        const month = currentMonth - i;
        const year = month <= 0 ? currentYear - 1 : currentYear;
        last3Months.push(`${year}-${month < 10 ? '0' + month : month}`);
      }
     
      const request = db
        .transaction(roomBillingTable.name, 'readonly')
        .objectStore(roomBillingTable.name)
        .index('month_covered')
        .getAll(IDBKeyRange.only(last3Months));
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
  };

  export default roomBillingTable;