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

document.getElementById("stock-in-date").textContent = getTimestamp();

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
        var hr = itemKeys[i].slice(11, 13);
        var min = itemKeys[i].slice(14, 16)
        var sec = itemKeys[i].slice(17, 19)
        var time = `${hr}:${min}:${sec}`;

        document.getElementById("stocks").innerHTML += `
        <div class="col-lg-3" id="${itemKeys[i]}">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${getTimestamp()} ${time}</h5>
                  <h5 class="card-subtitle mb-2 mt-2 text-muted">Paid: ${stocks[itemKeys[i]].paid} </h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Rate: ${Number((stocks[itemKeys[i]].item.price/stocks[itemKeys[i]].item.qty).toFixed(2))} </span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#editStock" class="btn btn-primary" onclick="getItem('${itemKeys[i]}')">Edit</a>
                    <a href="javascript:deleteItem('${itemKeys[i]}', '${stocks[itemKeys[i]].item.name}')" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>
            `
      }

    }
  }
  );


}


docRef = db.collection("returntostorage").doc(getTimestamp());
docRef.get().then((doc) => {
  if (doc.exists) {
    itemKeys = Object.keys(doc.data())
    itemNo = itemKeys.length;
    stocks = doc.data();
    console.log(itemKeys, itemNo);

    for (i = 0; i < itemNo; i++) {
      console.log(stocks[itemKeys[i]]);
      var hr = itemKeys[i].slice(11, 13);
      var min = itemKeys[i].slice(14, 16)
      var sec = itemKeys[i].slice(17, 19)
      var time = `${hr}:${min}:${sec}`;

      document.getElementById("stocks").innerHTML += `
        <div class="col-lg-3" id="${itemKeys[i]}">
              <div class="card stockItem">
                <div class="card-body">
                  <h5 class="card-title">${getTimestamp()} ${time}</h5>
                  <p class="card-text">
                    <b> <span>${stocks[itemKeys[i]].item.name}</span> </b> <br>
                    <span>Quantity: ${stocks[itemKeys[i]].item.qty} </span> <br>
                    <span>Price: ${stocks[itemKeys[i]].item.price}</span> <br>
                    <span>Rate: ${Number((stocks[itemKeys[i]].item.price/stocks[itemKeys[i]].item.qty).toFixed(2))} </span> <br>
                    <span>Seller: ${stocks[itemKeys[i]].seller}</span>
                  </p>
                  <p class="card-text">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#editStock" class="btn btn-primary" onclick="getItem('${itemKeys[i]}')">Edit</a>
                    <a href="javascript:deleteItem('${itemKeys[i]}', '${stocks[itemKeys[i]].item.name}')" class="btn btn-primary">Delete</a>
                  </p>
                </div>
              </div>
            </div>
            `
    }

  }
}
);


function deleteItem(key, stockName) {
  console.log(key, stockName);
  var result = confirm("Are you sure you want to delete " + stockName + " ?");
  if (result) {
    db.collection("returntostorage").doc(key.slice(0, 10)).update({
      [key]: firebase.firestore.FieldValue.delete()
    }
    ).then(
      alert(`${stockName} deleted successfully`)
    ).then(
      document.getElementById(`${key}`).remove()
    )
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
}

var itemData;
var itemKey;

function getItem(key) {
  itemKey = key;
  console.log(key);
  var docRef = db.collection('returntostorage').doc(key.slice(0, 10))

  docRef.get().then((doc) => {
    var itemDetails = doc.data()[key];
    document.querySelector("#editStock .modal-title").innerHTML = `Edit Stock - ${itemDetails.item.name}`;
    itemData = {
      name: itemDetails.item.name,
      cat: itemDetails.item.category,
      qty: itemDetails.item.qty,
      price: itemDetails.item.price,
      time: itemDetails.item.time,
      seller: itemDetails.seller,
    }
    document.querySelector("#editStock .iteminputs #stockName").value = itemData.name;
    document.querySelector("#editStock .iteminputs #stockSeller").value = itemData.seller;
    document.querySelector("#editStock .iteminputs #stockQty").value = itemData.qty;
    document.querySelector("#editStock .iteminputs #stockPrice").value = itemData.price;
  }
  )

}

function editItem() {

  db.collection("returntostorage").doc(itemKey.slice(0, 10)).update({
    [itemKey]: {
      item: {
        name: document.querySelector("#editStock .iteminputs #stockName").value,
        qty: document.querySelector("#editStock .iteminputs #stockQty").value,
        price: document.querySelector("#editStock .iteminputs #stockPrice").value,

      },
      seller: document.querySelector("#editStock .iteminputs #stockSeller").value
    }
  }
  ).then(() => {
    location.reload()
  }
  ).catch((error) => {
    console.log("Error editing the item: ", error);
  })

}
