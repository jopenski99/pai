import {openDB} from '../idbCrudOperations';

export const roomsTable = {
  name: 'rooms',
  columns: [
    { name: 'room_no', keypath: 'room_no', options: { unique: true } },
    { name: 'renter_name', keypath: 'renter_name' },
   /*  { name: 'status', keypath: 'status' }, */
  ],
    
  isInitialized: async () => {
    const db = await openDB();
    console.log(db)
    return {isInit :db.objectStoreNames.contains(roomsTable.name), dbIn: db};
  },
  init: (db) => {
    if (!db.objectStoreNames.contains(roomsTable.name)) {
        throw new Error(`Object store ${roomsTable.name} does not exist`);
    }
  },
  create: (db, data) => {
    const transaction = db.transaction(roomsTable.name, 'readwrite');
    const store = transaction.objectStore(roomsTable.name);
    const request = store.add(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  read: (db, room_no) => {
    const transaction = db.transaction(roomsTable.name, 'readonly');
    const store = transaction.objectStore(roomsTable.name);
    const request = store.get(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  update: (db, data) => {
    const transaction = db.transaction(roomsTable.name, 'readwrite');
    const store = transaction.objectStore(roomsTable.name);
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  },
  delete: (db, room_no) => {
    const transaction = db.transaction(roomsTable.name, 'readwrite');
    const store = transaction.objectStore(roomsTable.name);
    const request = store.delete(room_no);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  getAll: (db) => {
    const transaction = db.transaction(roomsTable.name, 'readonly');
    const store = transaction.objectStore(roomsTable.name);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

};

export default roomsTable;