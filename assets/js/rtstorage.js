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

var fetchingDate;

function getTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  var timestamp = `${day}-${month}-${year}`
  fulltime = Date.now().toString();
  return timestamp;
}


function fetchByDate(dateString) {

  const date = dateString;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  fetchingDate = `${day}-${month}-${year}`;

  document.getElementById("stocks").innerHTML = "";

  var docRef = db.collection("returntostorage").doc(fetchingDate);
  docRef.get().then((doc) => {
    if (doc.exists) {
      itemKeys = Object.keys(doc.data())
      itemNo = itemKeys.length;
      stocks = doc.data();
      console.log(itemKeys, itemNo);

      for (i = 0; i < itemNo; i++) {
        console.log(stocks[itemKeys[i]]);

        document.getElementById("stocks").innerHTML += `<div class="col-lg-3">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${itemKeys[i].slice(0, 10)}</h5>
                  <h5 class="card-subtitle mb-2 mt-2 text-muted">Paid: ${stocks[itemKeys[i]].paid} </h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" class="btn btn-primary">Edit</a>
                    <a href="#" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>`
      }

    }
  }
  );


}

var docRef = db.collection("returntostorage").doc(getTimestamp());
docRef.get().then((doc) => {
  if (doc.exists) {
    itemKeys = Object.keys(doc.data())
    itemNo = itemKeys.length;
    console.log(itemKeys, itemNo);

    for (i = 0; i < itemNo; i++) {
      console.log(doc.data()[itemKeys[i]]);
    }

  }
}
);

docRef = db.collection("returntostorage").doc(getTimestamp());
  docRef.get().then((doc) => {
    if (doc.exists) {
      itemKeys = Object.keys(doc.data())
      itemNo = itemKeys.length;
      stocks = doc.data();
      console.log(itemKeys, itemNo);

      for (i = 0; i < itemNo; i++) {
        console.log(stocks[itemKeys[i]]);

        document.getElementById("stocks").innerHTML += `
        <div class="col-lg-3">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${itemKeys[i].slice(0, 10)}</h5>
                  <h5 class="card-subtitle mb-2 mt-2 text-muted">Paid: ${stocks[itemKeys[i]].paid} </h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" class="btn btn-primary">Edit</a>
                    <a href="javascript:deleteItem(${itemKeys[i]})" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>
            `
      }

    }
  }
  );
