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
                                ><a data-bs-toggle="modal"
                                data-bs-target="#addShopItem" onclick="javascript:sendDataAIM('${key}')"><i class="bi bi-file-earmark-plus-fill"></i></a></span>
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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shopName = urlParams.get("shop");

var shopData;

var shopRef = db.collection("shops").doc(shopName);

shopRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      shopData = doc.data();
      document.getElementById("shopName").textContent = shopName;
      document.getElementById("shopPhone").textContent = shopData.phone;
      if (doc.data().hasOwnProperty("items")) {
        Object.entries(shopData.items).forEach(([key, value]) => {
          var mainid = key + "shop";
          var priceid = key + "price";
          document.getElementById("table-body-shop-items").innerHTML += `
            <tr id='${mainid}'>
                <td>${key}</td>
                <td id='${priceid}'>${value}</td>
                <td>
                    <span class="text-danger"
                    ><a data-bs-toggle="modal"
                    data-bs-target="#updateShopItem" onclick="javascript:sendDataUIM('${key}','${value}')"><i class="bi bi-pencil-fill"></i></a>
                    </span>
                </td>
                <td>
                    <span class="text-danger"
                    ><a href="javascript:deleteShopItem('${key}')"><i class="bi bi-trash-fill"></i></a>
                    </span>
                </td>
            </tr>                
           `;
        });
      } else {
        document.getElementById("table-body-shop-items").innerHTML = `
            <tr>
                <td colspan='4'>No items</td>
            </tr>
            `;
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });

function sendDataAIM(itemName) {
  document.getElementById("shopItemName").value = itemName;
}

function addShopItem() {
  var itemName = document.getElementById("shopItemName").value;
  var itemRate = parseInt(document.getElementById("shopItemRate").value, 10);
  if (itemRate != "") {
    var docRef = db.collection("shops").doc(shopData.name);
    docRef
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
              alert("Item - " + itemName + " already exists!!");
            } else {
              let updateObject = {};
              updateObject[`items.${itemName}`] = itemRate;
              docRef.update(updateObject).then(() => {
                var mainid = itemName + "shop";
                var priceid = itemName + "price";
                document.getElementById("table-body-shop-items").innerHTML += `
                <tr id='${mainid}'>
                    <td>${itemName}</td>
                    <td id='${priceid}'>${itemRate}</td>
                    <td>
                        <span class="text-danger"
                        ><a data-bs-toggle="modal"
                        data-bs-target="#updateShopItem" onclick="javascript:sendDataUIM('${itemName}','${itemRate}')"><i class="bi bi-pencil-fill"></i></a>
                        </span>
                    </td>
                    <td>
                        <span class="text-danger"
                        ><a href="javascript:deleteShopItem('${itemName}')"><i class="bi bi-trash-fill"></i></a>
                        </span>
                    </td>
                </tr>                
            `;
              });
            }
          } else {
            console.log("No data called items!");
            let updateObject = {};
            updateObject[`items.${itemName}`] = itemRate;
            docRef
              .set(
                {
                  items: {
                    [itemName]: itemRate,
                  },
                },
                { merge: true }
              )
              .then(() => {
                var mainid = itemName + "shop";
                var priceid = itemName + "price";
                document.getElementById("table-body-shop-items").innerHTML = `
                <tr id='${mainid}'>
                    <td>${itemName}</td>
                    <td id='${priceid}'>${itemRate}</td>
                    <td>
                        <span class="text-danger"
                        ><a data-bs-toggle="modal"
                        data-bs-target="#updateShopItem" onclick="javascript:sendDataUIM('${itemName}','${itemRate}')"><i class="bi bi-pencil-fill"></i></a>
                        </span>
                    </td>
                    <td>
                        <span class="text-danger"
                        ><a href="javascript:deleteShopItem('${itemName}')"><i class="bi bi-trash-fill"></i></a>
                        </span>
                    </td>
                </tr>                
            `;
              });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    alert("Enter Rate of the Item - " + itemName);
  }
}

function sendDataUIM(itemName, itemRate) {
  document.getElementById("updateItemName").value = itemName;
  document.getElementById("updateItemRate").value = itemRate;
}

function updateShopItem() {
  itemName = document.getElementById("updateItemName").value;
  itemRate = parseInt(document.getElementById("updateItemRate").value, 10);
  if (itemRate != "") {
    var docRef = db.collection("shops").doc(shopData.name);
    let updateObject = {};
    updateObject[`items.${itemName}`] = itemRate;
    docRef.update(updateObject).then(() => {
      document.getElementById(itemName + "price").textContent = itemRate;
    });
  }
}

function deleteShopItem(itemName) {
  var result = confirm("Are you sure you want to delete " + itemName + " ?");
  if (result) {
    const docRef = db.collection("shops").doc(shopName);
    let deleteObject = {};
    deleteObject[`items.${itemName}`] = firebase.firestore.FieldValue.delete();
    // Update the document to delete the specified item
    docRef
      .update(deleteObject)
      .then(() => {
        console.log("Item successfully deleted!");
        document.getElementById(itemName + "shop").remove();
      })
      .catch((error) => {
        console.error("Error deleting item: ", error);
      });
  }
}
