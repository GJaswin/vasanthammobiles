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

function capitalize(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function initialiseItems() {
  // Check if items are already in local storage
  const localItems = localStorage.getItem("items");
  if (localItems) {
    //console.log('Items already in local storage:', JSON.parse(localItems));
    console.log("Local Storage - Items Available");
  } else {
    // Fetch items from Firebase Realtime Database
    const itemsRef = database.ref("/items");
    itemsRef
      .once("value")
      .then((snapshot) => {
        const items = snapshot.val();
        if (items) {
          // Store items in local storage
          localStorage.setItem("items", JSON.stringify(items));
          console.log("Local Storage - Items Loaded");
        } else {
          console.log("No items found in database.");
        }
      })
      .catch((error) => {
        alert("Items Loading: " + error);
      });
  }
}

function loadItems() {
  const localItems = JSON.parse(localStorage.getItem("items"));

  // Reference to the table body element
  const tableBody = document.getElementById("table-body-items");

  // Iterate over the items and append rows to the table
  for (const [key, value] of Object.entries(localItems)) {
    // Create a new row element
    const row = document.createElement("tr");
    row.id = key; // Set the id attribute to the key

    // Create table data cells and set their content
    const keyCell = document.createElement("td");
    const keyCellLink = document.createElement("a");
    keyCellLink.href = `javascript:setItem('${key}')`;
    keyCellLink.textContent = key;
    keyCell.appendChild(keyCellLink);

    // Append table data cells to the row
    row.appendChild(keyCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
  filterRows("");
}

function setItem(itemName) {
  stockName = capitalize(itemName.trim().toLowerCase()).toString();
  document.getElementById("item-name").value = stockName;
}

function getTimestamp() {
  //fulltime = new Date();
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

  return [formattedDate, formattedBillId];
}


function addItem() {
  var stockName = capitalize(
    document.getElementById("item-name").value.trim().toLowerCase()
  );
  var stockSeller = capitalize(
    document.getElementById("seller-name").value.trim().toLowerCase()
  );
  var stockQty = parseInt(document.getElementById("item-qty").value, 10);
  var stockPrice = parseInt(document.getElementById("item-price").value, 10);

  var stockPaidVal = document.getElementById("stock-paid").value == "true" ? true : false;

  const docData = {
    [getTimestamp()[1]]: {
      item: {
        name: stockName,
        qty: stockQty,
        price: stockPrice,
      },
      seller: stockSeller,
      paid: stockPaidVal,
    },
  };

  db.collection("items")
    .doc(stockName)
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        // Document exists, update the field
        db.collection("items")
          .doc(stockName)
          .update({
            stock: firebase.firestore.FieldValue.increment(stockQty),
          })
          .then(() => {
            db.collection("stockin")
              .doc(getTimestamp()[0])
              .set(docData, { merge: true })
              .then(() => {
                console.log("Document(Item) successfully written!");
                document.getElementById("alert-msg").textContent =
                  stockName + " - Stock Added!";
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
                document.getElementById("alert-msg").textContent = error;
              });
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else {
        alert("No item !");
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
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
      initialiseItems();
      loadItems();
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
