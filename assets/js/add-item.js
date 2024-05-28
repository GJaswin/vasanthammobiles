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

function loadItems(){
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
    keyCell.textContent = key;

    // Append table data cells to the row
    row.appendChild(keyCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
  filterRows("");
}


function addItem() {
  var itemName = capitalize(
    document.getElementById("item-name").value.trim().toLowerCase()
  );
  var itemCategory = capitalize(
    document.getElementById("item-category").value.trim().toLowerCase()
  );
  var retailRate = parseInt(
    document.getElementById("item-retail-rate").value,
    10
  );
  var wholesaleRate = parseInt(
    document.getElementById("item-wholesale-rate").value,
    10
  );
  var masterRate = parseInt(
    document.getElementById("master-rate").value,
    10
  );
  const docRef = db.collection("items").doc(itemName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Document exists, handle notification here
        console.log("Item already exists!");
        document.getElementById("alert-msg").textContent =
          "Item Already Exists!";
      } else {
        db.collection("items")
          .doc(itemName)
          .set({
            name: itemName,
            category: itemCategory,
            retailRate: retailRate,
            wholesaleRate: wholesaleRate,
            master: masterRate,
            stock: 0,
          })
          .then(() => {
            database
              .ref("/items")
              .update({ [itemName]: itemCategory })
              .then(() => {
                database.ref("/").update({
                  "item-count": firebase.database.ServerValue.increment(1),
                });
              });
            console.log("Document(Item) successfully written!");
            document.getElementById("alert-msg").textContent =
              itemName + " - Item Added!";
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            document.getElementById("alert-msg").textContent =
              "Error Occured, Try Again!";
          });
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
      document.getElementById("alert-msg").textContent =
        "Error Occured, Try Again!";
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
      const preloader = document.querySelector('#preloader');
      preloader.remove();
    } else {
      alert("Verify your mail in the 'My account' section");
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
    window.location.href = 'login.html';
  }
});