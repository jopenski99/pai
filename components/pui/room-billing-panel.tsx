export const roomBillingTable = {
  name: 'room_billings',
  columns: [
    { name: 'billing_no', keypath: 'billing_no', options: { unique: true } },
    { name: 'room_no', keypath: 'room_no' },
    { name: 'month_covered', keypath: 'month_covered' },
    { name: 'water_consumed', keypath: 'water_consumed' },
    { name: 'water_bill', keypath: 'water_bill' },
    { name: 'water_bill_date', keypath: 'water_bill_date' },
    { name: 'energy_bill', keypath: 'energy_bill' },
    { name: 'energy_consumed', keypath: 'energy_consumed' },
    { name: 'energy_bill_date', keypath: 'energy_bill_date' },  
    { name: 'date_created', keypath: 'date_created' },
  ],

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
};
