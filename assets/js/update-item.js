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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const item = urlParams.get("item");

// Get a reference to the document
function getItem(){
var docRef = db.collection("items").doc(item);
var data;
// Retrieve the document
docRef
  .get()
  .then(function (doc) {
    if (doc.exists) {
      // Document data exists, you can access it using doc.data()
      data = doc.data();
      document.getElementById("item-name").value = data.name;
      document.getElementById("item-category").value = data.category;
      document.getElementById("item-retail-rate").value = data.retailRate;
      document.getElementById("item-wholesale-rate").value = data.wholesaleRate;
      document.getElementById("master-rate").value = data.master;
      document.getElementById("item-stock-avl").value = data.stock;
    } else {
      console.log("No such document!");
    }
  })
  .catch(function (error) {
    console.log("Error getting document:", error);
  });
}

function capitalize(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function updateItem() {
  var itemName = capitalize(
    document.getElementById("item-name").value.trim().toLowerCase()
  );
  var itemCategory = capitalize(
    document.getElementById("item-category").value.trim().toLowerCase()
  );
  var retailRate = parseInt(document.getElementById("item-retail-rate").value,10);
  var wholesaleRate = parseInt(document.getElementById("item-wholesale-rate").value,10);
  var masterRate = parseInt(document.getElementById("master-rate").value,10);
  var stockAvl = parseInt(document.getElementById("item-stock-avl").value,10);

  const docRef = db.collection("items").doc(itemName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Document exists, handle notification here
        db.collection("items")
          .doc(itemName)
          .update({
            category: itemCategory,
            retailRate: retailRate,
            wholesaleRate: wholesaleRate,
            master: masterRate,
            stock: data.stock,
          })
          .then(() => {
            database.ref("/items").update({ [itemName]: itemCategory });
            console.log("Document(Item) Updated successfully!");
            document.getElementById("alert-msg").textContent =
              itemName + " - Item Updated!";
          });
      } else {
        db.collection("items")
          .doc(itemName)
          .set({
            name: itemName,
            category: itemCategory,
            retailRate: retailRate,
            wholesaleRate: wholesaleRate,
            master: masterRate,
            stock: data.stock,
          })
          .then(() => {
            database
              .ref("/items")
              .update({ [itemName]: itemCategory })
              .then(() => {
                db.collection("items")
                  .doc(data.name)
                  .delete()
                  .then(function () {
                    database.ref("items/"+data.name).remove().then(()=>{console.log(data.name+" Document successfully deleted!");});
                  })
                  .catch(function (error) {
                    console.error("Error removing document docid: ", error);
                  });
              });
            console.log(
              "Document(Item) successfully updated inclusive of docid itself!"
            );
            document.getElementById("alert-msg").textContent =
              data.name + " - Item Updated!";
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
      getItem();
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