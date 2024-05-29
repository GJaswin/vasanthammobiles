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

var fetchingDate;

var formattedDate = getTimestamp();

function getTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  var timestamp = `${day}-${month}-${year}`;
  document.getElementById("stock-in-date").textContent = timestamp;
  fulltime = Date.now().toString();
  return timestamp;
}
function convertTo12HourFormat(hr, min, sec) {
  let period = "AM";

  // Convert hours to 12-hour format and determine AM/PM
  if (hr >= 12) {
    period = "PM";
    if (hr > 12) {
      hr -= 12;
    }
  } else if (hr === 0) {
    hr = 12; // Midnight case
  }

  // Ensure minutes and seconds are two digits
  min = min.toString().padStart(2, "0");
  sec = sec.toString().padStart(2, "0");

  // Format the time
  const time = `${hr}:${min}:${sec} ${period}`;
  return time;
}
function fetchByDate(dateString) {
  const date = dateString;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  fetchingDate = `${day}-${month}-${year}`;

  var docRef = db.collection("stockin").doc(fetchingDate);
  docRef.get().then((doc) => {
    if (doc.exists) {
      var itemKeys = Object.keys(doc.data()).sort();
      var itemNo = itemKeys.length;
      var stocks = doc.data();

      document.getElementById("stock-in-date-length").textContent = itemNo;
      var stocksHTML = ``;
      for (i = 0; i < itemNo; i++) {
        var hr = itemKeys[i].slice(11, 13);
        var min = itemKeys[i].slice(14, 16);
        var sec = itemKeys[i].slice(17, 19);
        var time = convertTo12HourFormat(hr, min, sec);
        stocksHTML += `<div class="col-lg-4" id="${itemKeys[i]}">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${fetchingDate} ${time}</h5>
                  <h5 class="card-subtitle mb-2 mt-2 text-muted">Paid: ${
                    stocks[itemKeys[i]].paid
                  } </h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Rate: ${Number(
                      (
                        stocks[itemKeys[i]].item.price /
                        stocks[itemKeys[i]].item.qty
                      ).toFixed(2)
                    )} </span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#editStock" class="btn btn-primary" onclick="getItem('${
                      itemKeys[i]
                    }')">Edit</a>
                    <a href="javascript:deleteItem('${itemKeys[i]}', '${
          stocks[itemKeys[i]].item.name
        }')" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>`;
      }
      document.getElementById("stocks").innerHTML = stocksHTML;
    } else {
      alert("No Stock in found on " + fetchingDate + " !");
    }
  });
}

async function loadStockIn() {
  docRef = db.collection("stockin").doc(formattedDate);
  await docRef.get().then((doc) => {
    if (doc.exists) {
      var itemKeys = Object.keys(doc.data()).sort();
      var itemNo = itemKeys.length;
      var stocks = doc.data();

      document.getElementById("stock-in-date-length").textContent = itemNo;

      var stocksHTML = ``;
      for (i = 0; i < itemNo; i++) {
        var hr = itemKeys[i].slice(11, 13);
        var min = itemKeys[i].slice(14, 16);
        var sec = itemKeys[i].slice(17, 19);
        var time = convertTo12HourFormat(hr, min, sec);

        stocksHTML += `
        <div class="col-lg-4" id="${itemKeys[i]}">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${getTimestamp()} ${time}</h5>
                  <h5 class="card-subtitle mb-2 mt-2 text-muted">Paid: ${
                    stocks[itemKeys[i]].paid
                  } </h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Rate: ${Number(
                      (
                        stocks[itemKeys[i]].item.price /
                        stocks[itemKeys[i]].item.qty
                      ).toFixed(2)
                    )} </span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#editStock" class="btn btn-primary" onclick="getItem('${
                      itemKeys[i]
                    }')">Edit</a>
                    <a href="javascript:deleteItem('${itemKeys[i]}', '${
          stocks[itemKeys[i]].item.name
        }')" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>
            `;
      }
      document.getElementById("stocks").innerHTML = stocksHTML;
    } else {
      alert("No Stock in Found on " + formattedDate + " !");
    }
  });
}

function deleteItem(key, stockName) {
  console.log(key, stockName);
  var result = confirm("Are you sure you want to delete " + key + " ?");
  if (result) {
    db.collection("stockin")
      .doc(key.slice(0, 10))
      .update({
        [key]: firebase.firestore.FieldValue.delete(),
      })
      .then(alert(`${key} deleted successfully`))
      .then(document.getElementById(`${key}`).remove())
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
}

var itemData;
var itemKey;

function getItem(key) {
  itemKey = key;
  console.log(key);
  var docRef = db.collection("stockin").doc(key.slice(0, 10));

  docRef.get().then((doc) => {
    var itemDetails = doc.data()[key];
    document.querySelector(
      "#editStock .modal-title"
    ).innerHTML = `Edit Stock - ${itemDetails.item.name}`;
    itemData = {
      name: itemDetails.item.name,
      cat: itemDetails.item.category,
      qty: itemDetails.item.qty,
      price: itemDetails.item.price,
      time: itemDetails.item.time,
      seller: itemDetails.seller,
      paid: itemDetails.paid,
    };
    document.querySelector("#editStock .iteminputs #stockName").value =
      itemData.name;
    document.querySelector("#editStock .iteminputs #stockSeller").value =
      itemData.seller;
    document.querySelector("#editStock .iteminputs #stockQty").value =
      itemData.qty;
    document.querySelector("#editStock .iteminputs #stockPrice").value =
      itemData.price;
    document.querySelector("#editStock .iteminputs #paid").checked =
      itemData.paid;
    console.log(document.querySelector("#editStock .iteminputs #paid").checked);
  });
}

function editItem() {
  db.collection("stockin")
    .doc(itemKey.slice(0, 10))
    .update({
      [itemKey]: {
        item: {
          name: document.querySelector("#editStock .iteminputs #stockName")
            .value,
          qty: document.querySelector("#editStock .iteminputs #stockQty").value,
          price: document.querySelector("#editStock .iteminputs #stockPrice")
            .value,
        },
        paid: document.querySelector("#editStock .iteminputs #paid").checked,
        seller: document.querySelector("#editStock .iteminputs #stockSeller")
          .value,
      },
    })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.log("Error editing the item: ", error);
    });
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
      await loadStockIn();
      const preloader = document.querySelector("#preloader");
      preloader.remove();
      await deleteOldDocuments();
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

function getFormattedDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Calculate the date 31 days ago
function getCutoffDate() {
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - 31);
  return cutoffDate;
}

// Delete old documents
async function deleteOldDocuments() {
  const cutoffDate = getCutoffDate();
  const todayFormatted = getFormattedDate(new Date());

  // Get localStorage data
  const stockInDeletion =
    JSON.parse(localStorage.getItem("stockInDeletion")) || {};

  // Check if the deletion for today has already been done
  if (stockInDeletion.date === todayFormatted && stockInDeletion.deleted) {
    console.log("Deletion already performed today.");
    return;
  }

  // Delete documents older than the cutoff date
  let deletionOccurred = false;
  for (let i = 0; i < 31; i++) {
    const dateToDelete = new Date(cutoffDate);
    dateToDelete.setDate(cutoffDate.getDate() - i);
    const dateToDeleteFormatted = getFormattedDate(dateToDelete);

    try {
      await db.collection("stockin").doc(dateToDeleteFormatted).delete();
      console.log(`Deleted document with ID: ${dateToDeleteFormatted}`);
      deletionOccurred = true;
    } catch (error) {
      console.error(
        `Error deleting document (ID: ${dateToDeleteFormatted}): `,
        error
      );
    }
  }

  // Update localStorage
  stockInDeletion.date = todayFormatted;
  stockInDeletion.deleted = deletionOccurred;
  localStorage.setItem("stockInDeletion", JSON.stringify(stockInDeletion));
}
