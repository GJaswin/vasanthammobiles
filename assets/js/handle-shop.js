const firebaseConfig = {
  apiKey: "AIzaSyA9lsXWjCKInhmQBYOD8Ln0iElBTOaX4tw",
  authDomain: "vasantham-mobiles.firebaseapp.com",
  databaseURL:
    "https://vasantham-mobiles-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vasantham-mobiles",
  storageBucket: "vasantham-mobiles.appspot.com",
  messagingSenderId: "695369590474",
  appId: "1:695369590474:web:a0f8c33a14fb9b2ebc7633",
  measurementId: "G-D1D1ELN8NK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

var database = firebase.database();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shopName = urlParams.get("shop");

var shopData;

async function loadShop() {
  var shopRef = db.collection("shops").doc(shopName);

  await shopRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        shopData = doc.data();
        document.getElementById("shopName").textContent = shopName;
        document.getElementById("shopPhone").textContent = shopData.phone;
        document.getElementById("shopBalance").textContent = shopData.balance;
        var transactionsHTML = ``;
        if (doc.data().hasOwnProperty("payment")) {
          doc.data().payment.forEach((transaction, index) => {
            var timeid = Object.keys(transaction)[0] + "time";
            var trans = Object.values(transaction)[0];
            const tr = document.createElement("tr");
            tr.id = `${timeid}`;

            const td1 = document.createElement("td");
            td1.textContent = `${Object.keys(transaction)[0]}`;
            tr.appendChild(td1);

            const td2 = document.createElement("td");
            td2.textContent = `${trans}`;
            tr.appendChild(td2);

            const td3 = document.createElement("td");
            const span = document.createElement("span");
            span.className = "text-danger";

            const a = document.createElement("a");
            a.href = `javascript:deleteTransaction('${index}')`;

            const i = document.createElement("i");
            i.className = "bi bi-trash-fill";

            a.appendChild(i);
            span.appendChild(a);
            td3.appendChild(span);
            tr.appendChild(td3);

            // Now append the tr element to the desired parent element in the DOM
            // For example, if you want to append it to a tbody with id 'transactions-tbody':
            document
              .getElementById("table-body-shop-transactions")
              .appendChild(tr);
          });
        } else {
          document.getElementById("table-body-shop-transactions").innerHTML = `
            <tr>
                <td colspan='4'>No items</td>
            </tr>
            `;
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      alert("Error getting document:", error);
    });
}
function addTransaction() {
  var shopRef = db.collection("shops").doc(shopName);
  var amountPaying = parseInt(document.getElementById("pay-trans").value, 10);

  if (!isNaN(amountPaying)) {
    var balance = shopData.balance - amountPaying;
    shopData.balance = balance;
    var billid = updateClock();
    return db
      .runTransaction(function (transaction) {
        return transaction.get(shopRef).then(function (doc) {
          if (!doc.exists) {
            throw "Document does not exist!";
          }

          var transactions = doc.data().payment || [];

          // Check if the transactions array length is 20 or more
          if (transactions.length >= 15) {
            // Remove the oldest transaction (first element)
            transactions.shift();
          }

          // Add the new transaction to the array
          transactions.push({
            [billid]: amountPaying,
          });

          // Update the document with the modified transactions array
          transaction.update(shopRef, {
            payment: transactions,
            balance: balance,
          });
        });
      })
      .then(function () {
        console.log("Transaction added successfully.");
        alert("Transaction added successfully");
        window.location.reload();
      })
      .catch(function (error) {
        document.getElementById("alert-msg").textContent = "Transaction Error!";
        console.error("Transaction failed: ", error);
      });
  } else {
    alert("Enter Payment");
  }
}

function updateClock() {
  const date = new Date();

  // Get the individual components of the date and time
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed, so add 1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  // Determine if it's AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // If hours is 0, convert to 12

  // Construct the formatted date and time string
  const formattedDate = `${day}-${month}-${year}`;
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${period}`;
  const formattedBillId = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`;

  return formattedDateTime;
}

// Function to delete a transaction
function deleteTransaction(transactionIndex) {
  var shopRef = db.collection("shops").doc(shopName);
  var confirmation = confirm("Are you sure to delete this Transaction");
  if (confirmation) {
    return db
      .runTransaction(function (transaction) {
        return transaction.get(shopRef).then(function (doc) {
          if (!doc.exists) {
            throw "Document does not exist!";
          }

          var data = doc.data();
          var transactions = data.payment || [];

          // Remove the transaction at the specified index
          if (transactionIndex >= 0 && transactionIndex < transactions.length) {
            transactions.splice(transactionIndex, 1);

            // Update the document with the modified transactions array
            transaction.update(shopRef, {
              payment: transactions,
            });
          } else {
            throw "Invalid transaction index!";
          }
        });
      })
      .then(function () {
        alert("Deleted Transaction!");
        console.log("Transaction deleted successfully.");
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Transaction deletion failed: ", error);
      });
  }
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    if (displayName != null) {
      console.log("Name: " + displayName);
    } else {
      alert("Set your Name in the 'My Account' section");
      window.location.href = "my-account.html";
    }
    var emailVerified = user.emailVerified;
    if (emailVerified) {
      document.getElementById("userName").textContent = displayName;
      await loadShop();
      const preloader = document.querySelector("#preloader");
      preloader.remove();
    } else {
      alert("Verify your mail in the 'My account' section");
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
    window.location.href = "login.html";
  }
});

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Signed Out Successfully!");
    })
    .catch((error) => {
      alert(error);
    });
}
