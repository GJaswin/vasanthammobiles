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
var shopsHTML = ``
dbRef
  .child("shops")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        shopsHTML += `
                            <tr id='${key}'>
                              <td><a href="handle-shop.html?shop=${key}">${key}</a></td>
                              <td>${value}</td>
                              <td>
                                <span class="text-primary"
                                  ><a href="update-shop.html?shop=${key}"><i class="bi bi-pencil-fill"></i
                                ></a></span>
                              </td>
                            </tr>
          `;
      });
      document.getElementById("table-body-shops").innerHTML = shopsHTML;
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

