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

const dbRef = database.ref();
dbRef
  .child("items")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        document.getElementById("table-body-items").innerHTML += `
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
                                ><a href="javascript:itemToBill('${key}','${value}')"><i class="bi bi-bag-plus-fill"></i></a>
                              </span>
                            </td>
                          </tr>
        `;
      });
      filterRows("");
      document.getElementById("totalPages").textContent = countPages();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

function itemToBill(itemName, itemRate) {
  var qty = prompt("Enter " + itemName + "'s Quantity", 1);
  var id = itemName + "bill";
  if (qty != null) {
    document.getElementById("table-bill-items").innerHTML += `
    <tr id='${id}'>
      <td>${itemName}</td>
      <td>${itemRate}</td>
      <td>${qty}</td>
      <td>${qty * itemRate}</td>
      <td class="delete-ico-bill">
        <span class="text-danger"
          ><a href="javascript:removeItemFromBill('${id}')"><i class="bi bi-trash-fill"></i></a>
        </span>
      </td>
    </tr>
    `;
  }
}

function removeItemFromBill(id) {
  document.getElementById(id).remove();
}

function searchCustomer() {
  var customerPhone = document.getElementById("customer-ph-input").value;
  var docRef = db.collection("customers").doc(customerPhone);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        document.getElementById("customer-name-input").value = doc.data().name;
        document.getElementById("customer-name").textContent = doc.data().name;
        document.getElementById("customer-ph").textContent = customerPhone;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
async function printPageArea() {
  const elements = document.getElementsByClassName("delete-ico-bill");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  const cell = document.getElementById("change-colspan");
  cell.colSpan = 2;

  var printContent = document.getElementById("printing-bill").innerHTML;
  var originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  await sleep(1000);
  document.body.innerHTML = originalContent;
}

// const date = new Date();

// // Get day, month, and year components
// const day = date.getDate().toString().padStart(2, "0"); // Ensure 2 digits with leading zero if necessary
// const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed, so add 1
// const year = date.getFullYear();

// // Construct the formatted date string
// const formattedDate = `${day}-${month}-${year}`;

// console.log(formattedDate);

// Create a new Date object

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
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${period}`;
  const formattedBillId = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;

  document.getElementById("customer-date-time").textContent = formattedDateTime;
  document.getElementById("customer-billid").textContent = formattedBillId;
}

setInterval(updateClock, 1);

// var docData = {
//   [formattedDateTime]: {
//     vendor: "Hello world!",
//     paid: true,
//     dateExample: firebase.firestore.FieldValue.serverTimestamp(),
//     arrayExample: [5, 6, 7],
//   },
// };
// db.collection("stockin")
//   .doc(formattedDate)
//   .set(docData)
//   .then(() => {
//     console.log("Document successfully written!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
