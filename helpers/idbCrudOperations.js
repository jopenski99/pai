const dbVersion = 3;
const dbName = 'PAI_DB';
const storeName = 'Pai Store';

// Open the database and create the store if it doesn't exist
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('rooms')) {
                const roomsStore = db.createObjectStore('rooms', { keyPath: 'room_no' });
                // Create indexes on the rooms object store here
                roomsStore.createIndex('room_no', 'room_no', { unique: true });
            }
            if (!db.objectStoreNames.contains('apt_water_bills')) {
                const roomsStore = db.createObjectStore('apt_water_bills', { keyPath: 'billing_no' });
                // Create indexes on the rooms object store here
                roomsStore.createIndex('billing_no', 'billing_no', { unique: true });
            }
            if (!db.objectStoreNames.contains('apt_electricity_bills')) {
                const roomsStore = db.createObjectStore('apt_electricity_bills', { keyPath: 'billing_no' });
                // Create indexes on the rooms object store here
                roomsStore.createIndex('billing_no', 'billing_no', { unique: true });
            }
            if (!db.objectStoreNames.contains('room_billings')) {
                const roomsStore = db.createObjectStore('room_billings', { keyPath: 'billing_no' });
                roomsStore.createIndex('billing_no', 'billing_no', { unique: true });
                roomsStore.createIndex('room_no', 'room_no', { unique: false });
                roomsStore.createIndex('month_covered', 'month_covered', { unique: false });
            }
        };
        request.onsuccess = () => resolve(request.result);
    });
}

export function ensureIndex(db, storeName, indexName, keyPath) {
    if (!db.transaction(storeName).objectStore(indexName)) {
        db.transaction(storeName, 'versionchange').objectStore(storeName).createIndex(indexName, keyPath, { unique: false });
    }
}

// Create a new record
function create(record) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(record);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(record);
            request.onerror = () => reject(request.error);
        });
    });
}

// Read a record by ID
function read(id) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// Update a record
function update(record) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(record);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(record);
            request.onerror = () => reject(request.error);
        });
    });
}

// Delete a record by ID
function remove(id) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    });
}

// Batch operation: create multiple records
function createBatch(records) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const promises = records.map((record) => store.add(record));
        return Promise.all(promises);
    });
}

// Batch operation: update multiple records based on a condition
function updateBatch(condition, updates) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const index = store.index('conditionIndex');
        const request = index.getAll(condition);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const records = request.result;
                const promises = records.map((record) => {
                    Object.assign(record, updates);
                    return store.put(record);
                });
                Promise.all(promises).then(() => resolve());
            };
            request.onerror = () => reject(request.error);
        });
    });
}

// Batch operation: delete multiple records based on a condition
function removeBatch(condition) {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const index = store.index('conditionIndex');
        const request = index.getAll(condition);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const records = request.result;
                const promises = records.map((record) => store.delete(record.id));
                Promise.all(promises).then(() => resolve());
            };
            request.onerror = () => reject(request.error);
        });
    });
}

export {
    create,
    read,
    update,
    remove,
    createBatch,
    updateBatch,
    removeBatch,
};