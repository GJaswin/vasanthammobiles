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

itemsTablehtml = ``;

// document.addEventListener('DOMContentLoaded', () => {
//   // Function to retrieve and display items from local storage
//   function displayItems() {
//       // Retrieve items from local storage
//       const localItems = localStorage.getItem('items');

//       if (localItems) {
//           // Parse the JSON string to get the object
//           const items = JSON.parse(localItems);
//           console.log('Items retrieved from local storage:', items);

//           // Iterate over the object properties to access each item
//           for (const [itemName, itemCategory] of Object.entries(items)) {
//               console.log(`Item: ${itemName}, Category: ${itemCategory}`);
//               // Example: Append each item to a list in the HTML
//               const itemElement = document.createElement('li');
//               itemElement.textContent = `Item: ${itemName}, Category: ${itemCategory}`;
//               document.getElementById('items-list').appendChild(itemElement);
//           }
//       } else {
//           console.log('No items found in local storage.');
//       }
//   }

//   // Call the function to display items
//   displayItems();
// });

document.addEventListener("DOMContentLoaded", () => {
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

    const valueCell = document.createElement("td");
    valueCell.textContent = value;

    const updateCell = document.createElement("td");
    const updateLink = document.createElement("a");
    updateLink.href = `update-item.html?item=${key}`;
    updateLink.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    updateCell.appendChild(updateLink);

    const deleteCell = document.createElement("td");
    const deleteLink = document.createElement("a");
    deleteLink.href = `javascript:itemToBill('${key}')`;
    deleteLink.innerHTML = '<i class="bi bi-bag-plus-fill"></i>';
    deleteCell.appendChild(deleteLink);

    // Append table data cells to the row
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(updateCell);
    row.appendChild(deleteCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
  filterRows("");
  document.getElementById("totalPages").textContent = countPages();
});

// Showing the items for adding them to the Billing Section
// const dbRef = database.ref();
// dbRef
//   .child("items")
//   .get()
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const key = childSnapshot.key;
//         const value = childSnapshot.val();
//         itemsTablehtml += `
//           <tr id='${key}'>
//             <td>${key}</td>
//             <td>${value}</td>
//             <td>
//             <span class="text-primary"
//                 ><a href="update-item.html?item=${key}"><i class="bi bi-pencil-fill"></i
//             ></a></span>
//             </td>
//             <td>
//             <span class="text-danger"
//                 ><a href="javascript:itemToBill('${key}')"><i class="bi bi-bag-plus-fill"></i></a>
//             </span>
//             </td>
//         </tr>
//             `;
//       });
//       document.getElementById("table-body-items").innerHTML = itemsTablehtml;
//       filterRows("");
//       document.getElementById("totalPages").textContent = countPages();
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// Global Variables
var totalItems = 0;
var totalAmount = 0;
var totalBalanceKept = 0;
var prevBalance = 0;
var customerAvl = false;
var whatsappLink;

function itemToBill(itemName) {
  if (checkIdExists(itemName + "bill")) {
    alert(itemName + " is already added!");
  } else {
    var qty = prompt("Enter " + itemName + "'s Quantity", 1);
    var id = itemName + "bill";
    var rateid = itemName + "rate";
    var priceid = itemName + "price";

    var price;
    if (!isNaN(qty)) {
      var docRef = db.collection("items").doc(itemName);
      docRef
        .get()
        .then((doc) => {
          if (selectedOption() == "retail") {
            itemRate = doc.data().retailRate;
            price = qty * itemRate;
          } else if (selectedOption() == "wholesale") {
            itemRate = doc.data().wholesaleRate;
            price = qty * itemRate;
          } else if (selectedOption() == "master") {
            itemRate = doc.data().master;
            price = qty * itemRate;
          }
        })
        .then(() => {
          document.getElementById("table-bill-items").innerHTML += `
            <tr id='${id}' class="bill-item">
              <td>${itemName}</td>
              <td id='${rateid}' onclick="rateClickChange('${itemName}',${qty})">${itemRate}</td>
              <td>${qty}</td>
              <td id='${priceid}' onclick="priceClickChange('${itemName}',${qty})">${price}</td>
              <td class="delete-ico-bill">
                <span class="text-danger"
                  ><a href="javascript:removeItemFromBill('${id}','${priceid}')"><i class="bi bi-trash-fill"></i></a>
                </span>
              </td>
            </tr>
          `;
          totalItems++;
          totalAmount += price;
          document.getElementById("total-items-bill").textContent = totalItems;
          document.getElementById("total-amount-bill").textContent =
            totalAmount;
          totalBalanceKept = totalAmount + prevBalance;
          document.getElementById("customer-total-balance").textContent =
            totalBalanceKept;
        });
    }
  }
}

function removeItemFromBill(id, priceid) {
  totalItems--;
  var price = parseFloat(document.getElementById(priceid).textContent);
  totalAmount -= price;
  document.getElementById("total-items-bill").textContent = totalItems;
  document.getElementById("total-amount-bill").textContent = totalAmount;
  totalBalanceKept = totalAmount + prevBalance;
  document.getElementById("customer-total-balance").textContent =
    totalBalanceKept;
  document.getElementById(id).remove();
}

function searchCustomer() {
  var customerPhone = document.getElementById("customer-ph-input").value;
  if (customerPhone.length != 10) {
    alert("Enter 10 digit!");
  }
  var docRef = db.collection("customers").doc(customerPhone);
  var customerName = document.getElementById("customer-name-input").value;
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        document.getElementById("customer-name-input").value = doc.data().name;
        document.getElementById("customer-name").textContent = doc.data().name;
        document.getElementById("customer-ph").textContent = customerPhone;
        prevBalance = doc.data().balance;
        document.getElementById("customer-prev-balance").textContent =
          prevBalance;
        totalBalanceKept = totalAmount + prevBalance;
        document.getElementById("customer-total-balance").textContent =
          totalBalanceKept;
        customerAvl = true;
      } else {
        // doc.data() will be undefined in this case
        if (customerPhone.length == 10 && customerName != "") {
          var customerRef = db.collection("customers");
          customerRef
            .doc(customerPhone)
            .set({
              name: customerName,
              phone: customerPhone,
              balance: 0,
            })
            .then(() => {
              document.getElementById("customer-name").textContent =
                customerName;
              document.getElementById("customer-ph").textContent =
                customerPhone;
              prevBalance = 0;
              document.getElementById("customer-prev-balance").textContent =
                prevBalance;
              totalBalanceKept = totalAmount + prevBalance;
              document.getElementById("customer-total-balance").textContent =
                totalBalanceKept;
              customerAvl = true;
              alert("Customer Acc Created!!");
            });
        } else {
          alert("Customer not in Database. Please Enter the name!!");
        }
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
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

  document.getElementById("customer-date-time").textContent = formattedDateTime;
  document.getElementById("customer-billid").textContent = formattedBillId;

  return [formattedDateTime, formattedBillId, formattedDate];
}

function amountCheck() {
  payableAmt = document.getElementById("customer-pay-input").value;
  if (payableAmt != "") {
    document.getElementById("customer-currently-paid").textContent = payableAmt;
    document.getElementById("customer-balance-kept").textContent =
      totalBalanceKept - payableAmt;
  } else {
    document.getElementById("customer-pay-input").placeholder = "Amt Please!";
  }
}

function whatsappBill() {
  const itemElements = document.getElementsByClassName("bill-item");
  while (itemElements.length > 0) {
    itemElements[0].parentNode.removeChild(itemElements[0]);
  }
  totalItems = 0;
  totalAmount = 0;
  document.getElementById("total-items-bill").textContent = totalItems;
  document.getElementById("total-amount-bill").textContent = totalAmount;
  document.getElementById(
    "billing-table-head"
  ).innerHTML += `<th class="delete-ico-bill" scope="col">
    <i class="bi bi-trash-fill"></i>
    </th>`;

  cell = document.getElementById("change-colspan");
  cell.colSpan = 3;

  totalBalanceKept = 0;
  prevBalance = 0;
  customerAvl = false;

  document.getElementById("customer-name-input").value = "";
  document.getElementById("customer-ph-input").value = "";
  document.getElementById("customer-name").textContent = "";
  document.getElementById("customer-ph").textContent = "";
  document.getElementById("customer-billid").textContent = "";
  document.getElementById("customer-date-time").textContent = "";
  document.getElementById("customer-prev-balance").textContent = 0;
  document.getElementById("customer-total-balance").textContent = 0;
  document.getElementById("customer-currently-paid").textContent = 0;
  document.getElementById("customer-balance-kept").textContent = 0;
  document.getElementById("customer-pay-input").value = "";

  document.getElementById("whatsappLink").classList.add("invisible");
  document.getElementById("printBtn").classList.remove("disabled");
  window.open(whatsappLink);
}

function selectedOption() {
  // Get all radio buttons with the name "flexRadioDefault"
  var radioButtons = document.getElementsByName("flexRadioDefault");

  // Initialize a variable to store the value of the active radio button
  var selectedValue;

  // Loop through each radio button
  for (var i = 0; i < radioButtons.length; i++) {
    // Check if the current radio button is checked
    if (radioButtons[i].checked) {
      // If checked, store its value
      selectedValue = radioButtons[i].value;
      // Break the loop since we found the checked radio button
      break;
    }
  }

  return selectedValue;
}

async function sendStockOut() {
  var customerPaying;
  if (customerAvl == true) {
    customerPaying = prompt(
      "Amount Payable by Customer",
      document.getElementById("customer-pay-input").value
    );
  } else {
    alert("Enter Customer!");
  }
  if (customerPaying != null && customerAvl == true) {
    document.getElementById("customer-pay-input").value = customerPaying;
    amountCheck();

    const elements = document.getElementsByClassName("delete-ico-bill");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    var cell = document.getElementById("change-colspan");
    cell.colSpan = 2;

    var items = [];
    var itemsRate = [];
    var itemsQty = [];
    var itemsPrice = [];
    var buyerName = document.getElementById("customer-name").textContent;
    var buyerPh = document.getElementById("customer-ph").textContent;
    var sellerName = document.getElementById("seller-name").textContent;
    var buyerAmount = parseInt(
      document.getElementById("total-amount-bill").textContent,
      10
    );
    var balanceKept = parseInt(
      document.getElementById("customer-balance-kept").textContent,
      10
    );
    var paid = false;
    if (customerPaying >= buyerAmount) {
      paid = true;
    } // Get the table element by its id
    const table = document.getElementById("billingTable");
    // Get all the rows from the table
    const rows = table.getElementsByTagName("tr");
    // Loop through each row
    for (let i = 1; i < rows.length - 1; i++) {
      // Get all the cells in the current row
      const cells = rows[i].getElementsByTagName("td");
      items.push(cells[0].innerText);
      itemsRate.push(cells[1].innerText);
      itemsQty.push(cells[2].innerText);
      itemsPrice.push(cells[3].innerText);
    }

    var [timeid, billid, dateid] = updateClock();

    var stockoutRef = db.collection("stockout");

    stockoutRef
      .doc(dateid)
      .set(
        {
          [billid]: {
            buyerName: buyerName,
            buyerPhone: buyerPh,
            sellerName: sellerName,
            amount: buyerAmount,
            items: items,
            qty: itemsQty,
            rate: itemsRate,
            price: itemsPrice,
            paid: paid,
            time: timeid,
          },
        },
        { merge: true }
      )
      .then(() => {
        var itemsRef = db.collection("items");
        for (let i = 0; i < items.length; i++) {
          itemsRef.doc(items[i]).update({
            stock: firebase.firestore.FieldValue.increment(-itemsQty[i]),
          });
        }
      })
      .then(() => {
        var customerRef = db.collection("customers");
        customerRef
          .doc(buyerPh)
          .update({
            balance: totalBalanceKept - customerPaying,
          })
          .then(() => {
            let table = ``;
            for (i = 0; i < items.length; i++) {
              table += `Item: ${items[i]}\nRate: ${itemsRate[i]}\nQty: ${itemsQty[i]}\nPrice: ${itemsPrice[i]}\n\n`;
            }
            var formattedWaBill = encodeURIComponent(table);
            whatsappLink = `https://wa.me/+91${buyerPh}?text=Vasantham Mobiles Bill%0a%0aSeller:${sellerName}%0aTo:${buyerName}%0aBill id:${billid}%0a%0a${formattedWaBill}%0aTotal Amount:${buyerAmount}%0aPrev Balance:${prevBalance}%0aTotal Balance:${totalBalanceKept}%0aCurrently Paid:${customerPaying}%0aBalance Kept:${balanceKept}`;
            document.getElementById("printBtn").classList.add("disabled");
            document
              .getElementById("whatsappLink")
              .classList.remove("invisible");
            document.getElementById("customer-date-time").textContent = timeid;
            document.getElementById("customer-billid").textContent = billid;
          });
      });
    dummyPrint(billid);
  }
}

function dummyPrint(billid) {
  document.title = billid;

  var preContent = `<!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta content="width=device-width, initial-scale=1.0" name="viewport" />
       <title>${billid}</title>
       <!-- Vendor CSS Files -->
       <link
         href="assets/vendor/bootstrap/css/bootstrap.min.css"
         rel="stylesheet"
   
       <!-- Template Main CSS File -->
       <link href="assets/css/style.css" rel="stylesheet" />
     </head>
   
     <body>`;
  var postContent = `<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script></body></html>`;
  var iframe = preContent;
  var contentDiv = document.getElementById("printing-bill");
  var contentHTML = contentDiv.innerHTML;

  // Remove id attributes using a regular expression
  var modifiedHTML = contentHTML; //.replace(/ id="[^"]*"/g, "");

  iframe += modifiedHTML;
  // iframe += postContent
  // Set the modified HTML as the srcdoc of the iframe
  var previewFrame = document.getElementById("iframePrint");
  previewFrame.srcdoc = iframe;

  // Print the content of the iframe
  previewFrame.onload = function () {
    previewFrame.contentWindow.print();
  };
}

function rateClickChange(id, qty) {
  var rate = parseFloat(document.getElementById(id + "rate").textContent);
  var price = parseFloat(document.getElementById(id + "price").textContent);
  var Qty = parseInt(qty, 10);
  var changed = parseFloat(prompt("Enter " + id + "'s New Rate", rate));
  if (!isNaN(changed)) {
    totalAmount = totalAmount - price;
    document.getElementById(id + "rate").textContent = Number.isInteger(changed)
      ? changed.toFixed(0)
      : changed.toFixed(2);
    changedPrice = changed * Qty;
    totalAmount += changedPrice;
    document.getElementById("total-amount-bill").textContent = Number.isInteger(
      totalAmount
    )
      ? totalAmount.toFixed(0)
      : totalAmount.toFixed(2);
    totalBalanceKept = totalAmount + prevBalance;
    document.getElementById("customer-total-balance").textContent =
      totalBalanceKept;
    document.getElementById(id + "price").textContent = Number.isInteger(
      changedPrice
    )
      ? changedPrice.toFixed(0)
      : changedPrice.toFixed(2);
  }
}

function priceClickChange(id, qty) {
  var price = parseFloat(document.getElementById(id + "price").textContent);
  var Qty = parseInt(qty, 10);
  var changed = parseFloat(prompt("Enter " + id + "'s New Price", price));
  if (!isNaN(changed)) {
    totalAmount -= price;
    totalAmount += changed;
    document.getElementById("total-amount-bill").textContent = totalAmount;
    totalBalanceKept = totalAmount + prevBalance;
    document.getElementById("customer-total-balance").textContent =
      totalBalanceKept;
    document.getElementById(id + "price").textContent = changed;
    document.getElementById(id + "rate").textContent = Number.isInteger(
      changed / Qty
    )
      ? (changed / Qty).toFixed(0)
      : (changed / Qty).toFixed(2);
  }
}

function checkIdExists(elementId) {
  return document.getElementById(elementId) !== null;
}
