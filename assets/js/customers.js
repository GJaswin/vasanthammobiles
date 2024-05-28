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

const db = firebase.firestore();

var database = firebase.database();

// Showing the items for adding them to the Billing Section
const dbRef = database.ref();

function initialiseShops() {
  // Check if items are already in local storage
  const localShops = localStorage.getItem("shops");
  if (localShops) {
    console.log("Local Storage - Shops Available");
  } else {
    // Fetch items from Firebase Realtime Database
    const shopsRef = database.ref("/shops");
    shopsRef
      .once("value")
      .then((snapshot) => {
        const items = snapshot.val();
        if (items) {
          // Store items in local storage
          localStorage.setItem("shops", JSON.stringify(items));
          console.log("Local Storage - Shops Loaded");
        } else {
          console.log("No shops found in database.");
        }
      })
      .catch((error) => {
        alert("Shops Loading: " + error);
      });
  }
}


function loadShops() {
  const localshops = JSON.parse(localStorage.getItem("shops"));

  // Reference to the table body element
  const tableBody = document.getElementById("table-body-shops");

  // Iterate over the items and append rows to the table
  for (const [key, value] of Object.entries(localshops)) {
    // Create a new row element
    const row = document.createElement("tr");
    row.id = key; // Set the id attribute to the key

    // Create table data cells and set their content
    const keyCell = document.createElement("td");
    const keyCellLink = document.createElement("a");
    keyCellLink.href = `handle-shop.html?shop=${key}`;
    keyCellLink.textContent = key;
    keyCell.appendChild(keyCellLink);

    const valueCell = document.createElement("td");
    valueCell.textContent = value;

    const updateCell = document.createElement("td");
    const updateLink = document.createElement("a");
    updateLink.href = `update-shop.html?shop=${key}`;
    updateLink.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    updateCell.appendChild(updateLink);

    const deleteShopCell = document.createElement("td");
    const deleteShopLink = document.createElement("a");
    deleteShopLink.href = `javascript:deleteShop('${key}')`;
    deleteShopLink.innerHTML = '<i class="bi bi-trash-fill"></i>';
    deleteShopCell.appendChild(deleteShopLink);

    // Append table data cells to the row
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(updateCell);
    row.appendChild(deleteShopCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
}


function deleteShop(shopName) {
  var result = confirm("Are you sure you want to delete " + shopName + " ?");
  if (result) {
    db.collection("shops")
      .doc(shopName)
      .delete()
      .then(function () {
        database
          .ref("shops/" + shopName)
          .remove()
          .then(() => {
            document.getElementById(shopName).remove();
            console.log(shopName + " Document successfully deleted!");
            alert(shopName + " Deleted Successfully");
          });
      })
      .catch(function (error) {
        console.error("Error removing document docid: ", error);
      });
  }
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
      document.getElementById("userName").textContent = displayName;
      initialiseShops();
      loadShops();
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