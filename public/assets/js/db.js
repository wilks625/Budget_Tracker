let db;
// create a new database request named BudgetDB
const request = indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = function (e) {

    const db = e.target.result;
    // create an object store named budgetStore and set autoIncrement to true
    db.createObjectStore('budgetStore', { autoIncrement: true });
};

request.onsuccess = function (e) {
    db = e.target.result;
    // if conditional to check if app is online before reading from db
    if (navigator.onLine) {
        checkDataBase()
    }
};

request.onerror = function (e) {
    console.log("Whoops!" + e.target.errorCode)
};

function saveRecord(record) {
    // create a transaction on budgetStore db with readwrite access
    const transaction = db.transaction(['budgetStore'], 'readwrite');
    // access budgetStore object
    const store = transaction.objectStore('budgetStore');
    // add record to store
    store.add(record);
  }