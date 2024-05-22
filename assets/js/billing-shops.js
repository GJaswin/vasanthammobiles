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

itemsTablehtml = ``;

dbRef
  .child("items")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        itemsTablehtml += `
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
                ><a data-bs-toggle="modal"
                data-bs-target="#addShopItem" onclick="javascript:addToItemModal('${key}')"><i class="bi bi-bag-plus-fill"></i></a>
              </span>
            </td>
        </tr>
        `
      });
      document.getElementById("table-body-items").innerHTML = itemsTablehtml;
      filterRows("");
      document.getElementById("totalPages").textContent = countPages();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

dbRef
  .child("shops")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        document.getElementById("table-body-shops").innerHTML += `
                          <tr id='${key}'>
                            <td>${key}</td>
                            <td>${value}</td>
                            <td>
                              <span class="text-primary"
                                ><a href="update-shop.html?shop=${key}"><i class="bi bi-pencil-fill"></i
                              ></a></span>
                            </td>
                            <td>
                              <span class="text-danger"
                                ><a href="javascript:setShop('${key}','${value}')"><i class="bi bi-check2-circle"></i></a>
                              </span>
                            </td>
                          </tr>
        `;
      });
      filterRowsShops("");
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

// Global Variables
var totalItems = 0;
var totalAmount = 0;
var totalBalanceKept = 0;
var prevBalance = 0;
var customerAvl = false;
var whatsappLink;
var shopCustomer;

function itemToBill(itemName) {
  var qty = prompt("Enter " + itemName + "'s Quantity", 1);
  var id = itemName + "bill";
  var price;
  if (qty != null) {
    var docRef = db.collection("items").doc(itemName);
    docRef
      .get()
      .then((doc) => {
        if (selectedOption() == "retail") {
          itemRate = doc.data().retailRate;
          price = qty * itemRate;
        } else {
          itemRate = doc.data().wholesaleRate;
          price = qty * itemRate;
        }
      })
      .then(() => {
        document.getElementById("table-bill-items").innerHTML += `
          <tr id='${id}' class="bill-item">
            <td>${itemName}</td>
            <td>${itemRate}</td>
            <td>${qty}</td>
            <td>${price}</td>
            <td class="delete-ico-bill">
              <span class="text-danger"
                ><a href="javascript:removeItemFromBill('${id}',${price})"><i class="bi bi-trash-fill"></i></a>
              </span>
            </td>
          </tr>
        `;
        totalItems++;
        totalAmount += price;
        document.getElementById("total-items-bill").textContent = totalItems;
        document.getElementById("total-amount-bill").textContent = totalAmount;
        totalBalanceKept = totalAmount + prevBalance;
        document.getElementById("customer-total-balance").textContent =
          totalBalanceKept;
      });
  }
}

function removeItemFromBill(id, price) {
  document.getElementById(id).remove();
  totalItems--;
  totalAmount -= price;
  document.getElementById("total-items-bill").textContent = totalItems;
  document.getElementById("total-amount-bill").textContent = totalAmount;
  totalBalanceKept = totalAmount + prevBalance;
  document.getElementById("customer-total-balance").textContent =
    totalBalanceKept;
}

function searchCustomer() {
  var customerPhone = document.getElementById("customer-ph-input").value;
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function printPageArea() {
  var customerPaying = prompt(
    "Amount Payable by Customer",
    document.getElementById("customer-pay-input").value
  );
  if (prompt != null && customerAvl == true) {
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
      .get(billid)
      .then((doc) => {
        if (doc.exists) {
          console.log("Doc exists");
          stockoutRef.doc(dateid).set(
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
          );
        } else {
          console.log("Doesn't not exist");
          stockoutRef.doc(dateid).set(
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
          );
        }
      })
      .then(() => {
        var itemsRef = db.collection("items");
        for (let i = 0; i < items.length; i++) {
          itemsRef.doc(items[i]).update({
            stock: firebase.firestore.FieldValue.increment(-itemsQty[i]),
          });
        }
      })
      .then(() => {
        var customerRef = db.collection("shops");
        customerRef
          .doc(buyerName)
          .update({
            balance: totalBalanceKept - customerPaying,
            //purchase: firebase.firestore.FieldValue.arrayUnion(billid),
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

    await sleep(1000);
    var printContent = document.getElementById("printing-bill").innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    await sleep(1000);
    document.body.innerHTML = originalContent;
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
  }
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
  const formattedDate = `${day}-${month}-${year}`;
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${period}`;
  const formattedBillId = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;

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

function whatsappBill() {
  document.getElementById("whatsappLink").classList.add("invisible");
  document.getElementById("printBtn").classList.remove("disabled");
  window.open(whatsappLink);
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
        totalItems = 0;
        totalAmount = 0;
        prevBalance = shopCustomer.balance;
        totalBalanceKept = shopCustomer.balance + totalAmount;
        document.getElementById("total-amount-bill").textContent = totalAmount,
        document.getElementById(
          "addItemToShopLink"
        ).innerHTML = `<li class="nav-item">
          <a class="nav-link nav-icon search-bar-toggle" href="handle-shop-items.html?shop=${shopName}">
          <i class="bi bi-house-up-fill"></i>
          </a>
        </li>`;
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

async function addToItemModal(itemName) {
  if (customerAvl == true) {
    document.getElementById("shopItemName").value = itemName;
  } else {
    alert("Set the Shop!");
  }
  var itemExists;
  var docRef = db.collection("shops").doc(shopCustomer.name);

  await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().hasOwnProperty("items")) {
          console.log("Document data:", doc.data().items);
          if (itemName in doc.data().items) {
            console.log(
              `Item '${itemName}' exists with value: ${
                doc.data().items[itemName]
              }`
            );
            document.getElementById("shopItemRate").value =
              doc.data().items[itemName];
            itemExists = true;
          } else {
            console.log(`Item does not exist in shop`);
            itemExists = false;
            var itemRef = db.collection("items").doc(itemName);
            itemRef
              .get()
              .then((itemdoc) => {
                if (itemdoc.exists) {
                  document.getElementById("shopItemRate").value =
                    itemdoc.data().wholesaleRate;
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          }
        } else {
          console.log("No data called items!");
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function addShopItem() {
  itemName = document.getElementById("shopItemName").value;
  itemRate = document.getElementById("shopItemRate").value;
  var qty = document.getElementById("shopItemQty").value;
  var id = itemName + "bill";
  var price;

  if (qty != "") {
    price = qty * itemRate;
    document.getElementById("table-bill-items").innerHTML += `
    <tr id='${id}' class="bill-item">
      <td>${itemName}</td>
      <td>${itemRate}</td>
      <td>${qty}</td>
      <td>${price}</td>
      <td class="delete-ico-bill">
        <span class="text-danger"
          ><a href="javascript:removeItemFromBill('${id}',${price})"><i class="bi bi-trash-fill"></i></a>
        </span>
      </td>
    </tr>
  `;
    totalItems++;
    totalAmount += price;
    document.getElementById("total-items-bill").textContent = totalItems;
    document.getElementById("total-amount-bill").textContent = totalAmount;
    totalBalanceKept = totalAmount + prevBalance;
    document.getElementById("customer-total-balance").textContent =
      totalBalanceKept;
  }
}
