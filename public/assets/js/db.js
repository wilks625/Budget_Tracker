let db;
// create a new database request named budget
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  // create an object store named budgetStore and set autoIncrement to true
  db.createObjectStore("budgetStore", { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;
  // if conditional to check if app is online before reading from db
  if (navigator.onLine) {
    console.log('Backend is online!');
    checkDatabase();
  }
};

request.onerror = function (e) {
  console.log("Whoops!" + e.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on budgetStore db with readwrite access
  const transaction = db.transaction(["budgetStore"], "readwrite");
  // access budgetStore object
  const store = transaction.objectStore("budgetStore");
  // add record to store
  store.add(record);
}

function checkDatabase() {
  // create a transaction on budgetStore db with readwrite access
  const transaction = db.transaction(["budgetStore"], "readwrite");
  // access budgetStore object
  const store = transaction.objectStore("budgetStore");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on budgetStore db
          const transaction = db.transaction(["budgetStore"], "readwrite");
          // access budgetStore object
          const store = transaction.objectStore("budgetStore");
          // clear all items in store
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);