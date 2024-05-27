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

//DB Schema
//Collection-Items
//  ->Document-Item-Name
//      ->Item
//      ->Rate
//      ->Category

var itemsHTML = ``;
// Showing the items for adding them to the Billing Section
const dbRef = database.ref();
dbRef
  .child("items")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        itemsHTML += `
                          <tr id='${key}'>
                            <td>${key}</td>
                            <td>${value}</td>
                            <td>
                              <span class="text-primary"
                                ><a href="update-item.html?item=${key}"><i class="bi bi-pencil-fill"></i
                              ></a></span>
                            </td>
                            <td>
                              <span class="text-danger"
                                ><a data-bs-toggle="modal" data-bs-target="#addToStock" href="#" onclick="getItem('${key}','${value}')"><i class="bi bi-bag-plus-fill"></i></a>
                              </span>
                            </td>
                          </tr>
        `;
      });
      document.getElementById("table-body-items").innerHTML = itemsHTML;
      filterRows("");
      document.getElementById("totalPages").textContent = countPages();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

function getItem(itemName, itemCat) {
  stockName = capitalize(itemName.trim().toLowerCase()).toString();
  stockCat = itemCat;
  console.log(stockName, stockCat);

  document.querySelector(
    "#addToStock .modal-title"
  ).textContent = `Add to Stock - ${stockName}`;
}

const paidButton = document.getElementById("paid");
var stockPaid = false;

paidButton.addEventListener("change", function () {
  if (this.checked) {
    stockPaid = true;
    console.log(stockPaid);
  } else {
    stockPaid = false;

    console.log(stockPaid);
  }
});

function addItem() {
  // var stockName = stockName
  // var stockCat = stockCat
  var stockSeller = capitalize(
    document.getElementById("stockSeller").value.trim().toLowerCase()
  );
  var stockQty = parseInt(document.getElementById("stockQty").value, 10);
  var stockPrice = parseInt(document.getElementById("stockPrice").value, 10);

  var stockPaidVal = stockPaid.toString();

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

    dateID = `${day}-${month}-${year}`;
    fulltime = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`;
    readableTime = date.toISOString();
    return dateID;
  }

  const docRef = db.collection("stockin").doc(getTimestamp());

  const docData = {
    [fulltime]: {
      item: {
        name: stockName,
        category: stockCat,
        qty: stockQty,
        price: stockPrice,
        time: readableTime,
      },
      seller: stockSeller,
      paid: stockPaidVal,
    },
  };

  docRef
    .get()
    .then(() => {
      db.collection("stockin")
        .doc(getTimestamp())
        .set(docData, { merge: true })
        .then(() => {
          console.log("Document(Item) successfully written!");
          document.getElementById("alert-msg").textContent =
            stockName + " - Item Added!";
          alert(stockname + " - Stock added");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          document.getElementById("alert-msg").textContent =
            "Error Occured, Try Again!";
        });
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
      document.getElementById("alert-msg").textContent =
        "Error Occured, Try Again!";
    });
}
