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

function addItem(itemName,itemCategory,retailRate,wholesaleRate,masterRate) {
  db.collection("items")
    .doc(itemName)
    .set({
      name: itemName,
      category: itemCategory,
      retailRate: retailRate,
      wholesaleRate: wholesaleRate,
      master: masterRate,
      stock: 1000,
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

async function add1000(){
    for (let index = 9951; index <= 10000; index++) {
        itemName = "Item " + index;
        category = "Printer";
        addItem(itemName,category,index+10,index+5,index+1);
    }
}