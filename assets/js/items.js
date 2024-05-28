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

function loadItems(){
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
    deleteLink.href = `javascript:deleteItem('${key}')`;
    deleteLink.innerHTML = '<i class="bi bi-trash-fill"></i>';
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
}

// itemsTablehtml = ``;
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
//         <tr id='${key}'>
//           <td>${key}</td>
//           <td>${value}</td>
//           <td>
//             <span class="text-primary"
//               ><a href="update-item.html?item=${key}"><i class="bi bi-pencil-fill"></i
//             ></a></span>
//           </td>
//           <td>
//             <span class="text-danger"
//               ><a href="javascript:deleteItem('${key}')"><i class="bi bi-trash-fill"></i
//             ></a></span>
//           </td>
//         </tr>
//         `
//       });
//       document.getElementById("table-body-items").innerHTML += itemsTablehtml;
//       filterRows("");
//       document.getElementById("totalPages").textContent = countPages();
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// const dbRef = database.ref();
// dbRef
//   .child("items")
//   .get()
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const key = childSnapshot.key;
//         const value = childSnapshot.val();
//         console.log("key: " + key + "   value: " + value);
//       });
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
  
function deleteItem(itemName) {
  var result = confirm("Are you sure you want to delete " + itemName + " ?");
  if (result) {
    db.collection("items")
      .doc(itemName)
      .delete()
      .then(function () {
        database
          .ref("items/" + itemName)
          .remove()
          .then(() => {
            database
              .ref("/")
              .update({
                "item-count": firebase.database.ServerValue.increment(-1),
              })
              .then(() => {
                document.getElementById(itemName).remove();
                console.log(itemName + " Document successfully deleted!");
                alert(itemName + " Deleted Successfully");
                changePage(1);
              });
          });
      })
      .catch(function (error) {
        console.error("Error removing document docid: ", error);
      });
  }
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
      initialiseItems();
      loadItems();
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