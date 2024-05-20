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

var shopCustomer;

function setShop(shopName, shopPhone) {
  customerAvl = true;
  var docRef = db.collection("shops").doc(shopName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        shopCustomer = doc.data();
        document.getElementById("shopName").textContent = shopName;
        document.getElementById("shopPhone").textContent = shopPhone;
        document.getElementById("shopBalance").textContent =
          shopCustomer.balance;
        document.getElementById(
          "addItemToShopLink"
        ).innerHTML = `<li class="nav-item">
            <a class="nav-link nav-icon search-bar-toggle" href="handle-shop-items.html?shop=${shopName}">
            <i class="bi bi-house-up-fill"></i>
            </a>
          </li>`;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
