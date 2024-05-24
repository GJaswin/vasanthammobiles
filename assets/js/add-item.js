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
        </tr>
        `;
      });
      document.getElementById("table-body-items").innerHTML = itemsTablehtml;
      filterRows("");
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

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
