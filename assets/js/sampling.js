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

function addItem(
  itemName,
  itemCategory,
  retailRate,
  wholesaleRate,
  masterRate
) {
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

async function add1000() {
  for (let index = 9951; index <= 10000; index++) {
    itemName = "Item " + index;
    category = "Printer";
    addItem(itemName, category, index + 10, index + 5, index + 1);
  }
}

const uniqueNames = [
  "Liam",
  "Olivia",
  "Ethan",
  "Amelia",
  "Benjamin",
  "Mia",
  "Alexander",
  "Charlotte",
  "Henry",
  "Ella",
  "Samuel",
  "Grace",
  "Daniel",
  "Lily",
  "Logan",
  "Aria",
  "Matthew",
  "Scarlett",
  "Jackson",
  "Zoe",
  "David",
  "Chloe",
  "Lucas",
  "Nora",
  "Joseph",
  "Hazel",
  "Caleb",
  "Violet",
  "Owen",
  "Penelope",
  "Wyatt",
  "Stella",
  "Gabriel",
  "Luna",
  "Isaac",
  "Aurora",
  "Levi",
  "Ruby",
  "Luke",
  "Naomi",
  "Isla",
  "Julian",
  "Eva",
  "Leo",
  "Clara",
  "Sebastian",
  "Alice",
  "Jack",
  "Eleanor",
  "Andrew",
  "Ivy",
  "Nathan",
  "Elise",
  "Jade",
  "Quinn",
  "Elijah",
  "Eliza",
  "Isaiah",
  "Cora",
  "Carter",
  "Lydia",
  "Nicholas",
  "Willow",
  "Grayson",
  "Adeline",
  "Hannah",
  "Zara",
  "Eli",
  "Emilia",
  "Hunter",
  "Lucy",
  "Natalie",
  "Charles",
  "Nova",
  "Josiah",
  "Sofia",
  "Anthony",
  "Maya",
  "Christian",
  "Camila",
  "Jonathan",
  "Lila",
  "Aaron",
  "Gianna",
  "Ezra",
  "Bella",
  "Colton",
  "Aubrey",
  "Thomas",
  "Layla",
  "Adrian",
  "Elias",
  "Paisley",
  "Nolan",
  "Skylar",
  "Jeremiah",
  "Annabelle",
  "Easton",
  "Aaliyah",
  "Jordan",
  "Ariana",
  "Dominic",
  "Ellie",
  "Austin",
  "Claire",
  "Ian",
  "Vivian",
  "Adam",
  "Savannah",
  "Xavier",
  "Brielle",
  "Cooper",
  "Audrey",
  "Ezekiel",
  "Nevaeh",
  "Jose",
  "Brooklyn",
  "Jaxon",
  "Genesis",
  "Parker",
  "Serenity",
  "Roman",
  "Harper",
  "Chase",
  "Aubree",
  "Jason",
  "Athena",
  "Micah",
  "Leah",
  "Blake",
  "Xander",
  "Jace",
  "Wesley",
  "Silas",
  "Axel",
  "Everett",
  "Zachary",
  "Miles",
  "Sawyer",
  "Piper",
  "Leonardo",
  "Kinsley",
  "Caden",
  "Delilah",
  "Declan",
  "Lincoln",
  "Evan",
  "Charlie",
  "Maxwell",
  "Harrison",
  "Fiona",
  "Weston",
  "Emery",
  "Brayden",
  "Adalyn",
  "Colin",
  "Arabella",
  "Ryder",
  "Julia",
  "Kai",
  "Valentina",
  "Emmett",
  "Beckett",
  "Vera",
  "Finn",
  "Oscar",
  "Patrick",
  "Gemma",
  "George",
  "Liliana",
  "Jude",
  "Brianna",
  "Abel",
  "Tucker",
];

async function addCus200() {
  for (let index = 0; index < uniqueNames.length; index++) {
    const shopName = uniqueNames[index];
    addShop(shopName, 8778454354);
  }
}

function addShop(shopName, shopPhone) {
  db.collection("shops")
    .doc(shopName)
    .set({
      name: shopName,
      phone: shopPhone,
      balance: 0,
      payment: []
    })
    .then(() => {
      database
        .ref("/shops")
        .update({ [shopName]: shopPhone });
      console.log(shopName + " successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      document.getElementById("alert-msg").textContent =
        "Error Occured, Try Again!";
    });
}



function addTransaction() {
  var shopRef = db.collection("shops").doc("Aaliyah Shop");

  return db.runTransaction(function(transaction) {
      return transaction.get(shopRef).then(function(doc) {
          if (!doc.exists) {
              throw "Document does not exist!";
          }

          var transactions = doc.data().payment || [];

          // Check if the transactions array length is 20 or more
          if (transactions.length >= 3) {
              // Remove the oldest transaction (first element)
              transactions.shift();
          }

          // Add the new transaction to the array
          transactions.push(newTransaction);

          // Update the document with the modified transactions array
          transaction.update(shopRef, { payment: transactions });
      });
  }).then(function() {
      console.log("Transaction added successfully.");
  }).catch(function(error) {
      console.error("Transaction failed: ", error);
  });
}

timeid = "25-05-2024-05-59-56-PM"
amount = 1000;

var newTransaction = {
  [timeid]: amount,
};


var value = parseFloat(prompt("Enter Content", 9))
if(!isNaN(value)){
  console.log(value);
  console.log(typeof(value))
}
