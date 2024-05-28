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
    keyCell.textContent = key;

    const valueCell = document.createElement("td");
    valueCell.textContent = value;

    const updateCell = document.createElement("td");
    const updateLink = document.createElement("a");
    updateLink.href = `update-item.html?item=${key}`;
    updateLink.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    updateCell.appendChild(updateLink);

    const addItemCell = document.createElement("td");
    const addItemLink = document.createElement("a");
    addItemLink.href = `javascript:itemToBill('${key}')`;
    addItemLink.innerHTML = '<i class="bi bi-bag-plus-fill"></i>';
    addItemCell.appendChild(addItemLink);

    // Append table data cells to the row
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(updateCell);
    row.appendChild(addItemCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
  filterRows("");
  document.getElementById("totalPages").textContent = countPages();
}

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
    keyCell.textContent = key;

    const valueCell = document.createElement("td");
    valueCell.textContent = value;

    const updateCell = document.createElement("td");
    const updateLink = document.createElement("a");
    updateLink.href = `update-shop.html?shop=${key}`;
    updateLink.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    updateCell.appendChild(updateLink);

    const setShopCell = document.createElement("td");
    const setShopLink = document.createElement("a");
    setShopLink.href = `javascript:setShop('${key}','${value}')`;
    setShopLink.innerHTML = '<i class="bi bi-check2-circle"></i>';
    setShopCell.appendChild(setShopLink);

    // Append table data cells to the row
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(updateCell);
    row.appendChild(setShopCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
  filterRowsShops("");
}

// Global Variables
var totalItems = 0;
var totalAmount = 0;
var totalBalanceKept = 0;
var prevBalance = 0;
var customerAvl = false;
var whatsappLink;
var shopCustomer;

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
  shopCustomer = "";
  document.getElementById("customer-name").textContent = "";
  document.getElementById("customer-ph").textContent = "";
  document.getElementById("customer-billid").textContent = "";
  document.getElementById("customer-date-time").textContent = "";
  document.getElementById("customer-prev-balance").textContent = 0;
  document.getElementById("customer-total-balance").textContent = 0;
  document.getElementById("customer-currently-paid").textContent = 0;
  document.getElementById("customer-balance-kept").textContent = 0;
  document.getElementById("customer-pay-input").value = "";

  document.getElementById("page-alert-out").classList.add("invisible");
  document.getElementById("page-alert-transaction").classList.add("invisible");
  document.getElementById("billLoopItems").innerHTML = ``;

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
    var buyerAmount = parseFloat(
      document.getElementById("total-amount-bill").textContent
    ).toFixed(0);
    var balanceKept = parseFloat(
      document.getElementById("customer-balance-kept").textContent
    ).toFixed(0);
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
            customerPaid: customerPaying,
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
        var loopItems = ``;
        for (let i = 0; i < items.length; i++) {
          itemsRef
            .doc(items[i])
            .update({
              stock: firebase.firestore.FieldValue.increment(-itemsQty[i]),
            })
            .then(() => {
              document.getElementById(
                "billLoopItems"
              ).innerHTML += `<a>${items[i]} - stock reduced by ${itemsQty[i]}</a><br>`;
            });
        }
        document.getElementById("page-alert-out").classList.remove("invisible");
      })
      .then(() => {
        var balance = totalBalanceKept - customerPaying;
        addTransaction(buyerName, timeid, customerPaying, balance).then(() => {
          let table = ``;
          for (i = 0; i < items.length; i++) {
            table += `Item: ${items[i]}\nRate: ${itemsRate[i]}\nQty: ${itemsQty[i]}\nPrice: ${itemsPrice[i]}\n\n`;
          }
          var formattedWaBill = encodeURIComponent(table);
          whatsappLink = `https://wa.me/+91${buyerPh}?text=Vasantham Mobiles Bill%0a%0aSeller:${sellerName}%0aTo:${buyerName}%0aBill id:${billid}%0a%0a${formattedWaBill}%0aTotal Amount:${buyerAmount}%0aPrev Balance:${prevBalance}%0aTotal Balance:${totalBalanceKept}%0aCurrently Paid:${customerPaying}%0aBalance Kept:${balanceKept}`;
          document.getElementById("printBtn").classList.add("disabled");
          document.getElementById("whatsappLink").classList.remove("invisible");
          document.getElementById("customer-date-time").textContent = timeid;
          document.getElementById("customer-billid").textContent = billid;
        });
      });
    dummyPrint();
  }
}

function dummyPrint() {
  var preContent = `<!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta content="width=device-width, initial-scale=1.0" name="viewport" />
       <!-- Vendor CSS Files -->
       <link
         href="assets/vendor/bootstrap/css/bootstrap.min.css"
         rel="stylesheet"
   
       <!-- Template Main CSS File -->
       <link href="assets/css/style.css" rel="stylesheet" />
     </head>
   
     <body>`;
  var postContent = `</body></html>`;
  var iframe = preContent;
  var contentDiv = document.getElementById("printing-bill");
  var contentHTML = contentDiv.innerHTML;

  // Remove id attributes using a regular expression
  var modifiedHTML = contentHTML; //.replace(/ id="[^"]*"/g, "");

  iframe += modifiedHTML;
  iframe += postContent;
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

function setShop(shopName, shopPhone) {
  document.getElementById("customer-name").textContent = shopName;
  document.getElementById("customer-ph").textContent = shopPhone;
  customerAvl = true;
  var docRef = db.collection("shops").doc(shopName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        shopCustomer = doc.data();
        document.getElementById("customer-prev-balance").textContent =
          shopCustomer.balance;
        prevBalance = shopCustomer.balance;
        totalBalanceKept = shopCustomer.balance + totalAmount;
        (document.getElementById("total-amount-bill").textContent =
          totalAmount),
          (document.getElementById("customer-total-balance").textContent =
            totalBalanceKept);
        alert(shopName + " Set");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function capitalize(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function addShop() {
  var shopName = capitalize(
    document.getElementById("shopName").value.trim().toLowerCase()
  );
  var shopPhone = parseInt(document.getElementById("shopNumber").value, 10);

  const docRef = db.collection("shops").doc(shopName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Document exists, handle notification here

        console.log("Shop already exists!");
        document.getElementById("addShopModal-alert").textContent =
          "Shop Already Exists!";
      } else {
        db.collection("shops")
          .doc(shopName)
          .set({
            name: shopName,
            phone: shopPhone,
            balance: 0,
            payment: [],
          })
          .then(() => {
            database.ref("/shops").update({ [shopName]: shopPhone });
            console.log("Document(shop) successfully written!");
            document.getElementById("addShopModal-alert").textContent =
              shopName + " - Shop Added!";
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            document.getElementById("addShopModal-alert").textContent =
              "Error Occured, Try Again!";
          });
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
      document.getElementById("addShopModal-alert").textContent =
        "Error Occured, Try Again!";
    });
}

function checkIdExists(elementId) {
  return document.getElementById(elementId) !== null;
}

function addTransaction(shopName, billid, amt, blnce) {
  var shopRef = db.collection("shops").doc(shopName);

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
          [billid]: amt,
        });

        // Update the document with the modified transactions array
        transaction.update(shopRef, { payment: transactions, balance: blnce });
      });
    })
    .then(function () {
      console.log("Transaction added successfully.");
      document
        .getElementById("page-alert-transaction")
        .classList.remove("invisible");
    })
    .catch(function (error) {
      alert("Transaction Error");
      console.error("Transaction failed: ", error);
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
      document.getElementById("userName").textContent = displayName;
      document.getElementById("seller-name").textContent = displayName;
      initialiseItems();
      loadItems();
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