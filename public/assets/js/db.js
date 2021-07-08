let db;
// Create a new database request named BudgetDB
const request = indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = function (e) {

    const db = e.target.result;
    // created an object store named pending and set autoIncrement to true
    db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function (e) {
    db = e.target.result;
    // if conditional to check if app is online before reading from db
    if (navigator.onLine) {
        checkDataBase()
    }
}