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

formattedDate = updateClock();

function updateClock() {
  const date = new Date();

  // Get the individual components of the date and time
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed, so add 1
  const day = date.getDate().toString().padStart(2, "0");

  // Construct the formatted date and time string
  const formattedDate = `${day}-${month}-${year}`;

  document.getElementById("stock-out-date").textContent = formattedDate;
  return formattedDate;
}

// Assuming you have a Firestore document reference
const docRef = db.collection("stockout").doc(formattedDate);

// Get the document
docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      // Access the data of the document
      const data = doc.data();

      // Access nested map structures
      // const nestedMap1 = data.nestedMap1;
      // const nestedMap2 = data.nestedMap2;

      // // Access data within nested map structures
      // const nestedField1 = nestedMap1.field1;
      // const nestedField2 = nestedMap1.field2;
      // const nestedField3 = nestedMap2.field3;
      var entrys = Object.keys(data).length;
      document.getElementById("stock-out-date-length").textContent = entrys;
      var stockoutids = Object.keys(data).sort();
      var stockOuthtml = ``;
      stockoutids.forEach((id) => {
        var items = data[id].items;
        var rate = data[id].rate;
        var qty = data[id].qty;
        var price = data[id].price;

        var dummyScript = ``;
        for (i = 0; i < items.length; i++) {
          dummyScript += `<tr>
          <td>${items[i]}</td>
          <td>${rate[i]}</td>
          <td>${qty[i]}</td>
          <td>${price[i]}</td>
        </tr>`;
        }

        stockOuthtml += `
        <div class="card top-selling overflow-auto" id='${id}'>
              <div class="card-body pb-0">
                <h5 class="card-title head">
                  ${data[id].time} &nbsp;|&nbsp;<a href="javascript:deleteStockOut('${id}')">Delete</a>
                </h5>
                <h5 class="card-title">Seller: ${data[id].sellerName}</h5>
                <h5 class="card-title">Buyer: ${data[id].buyerName} | ${data[id].buyerPhone}</h5>
                <h5 class="card-title">Paid: ${data[id].paid}</h5>
                <h5 class="card-title">Amount: ${data[id].amount}</h5>
                <h5 class="card-title">Paid Amt: ${data[id].customerPaid}</h5>
                <br />
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dummyScript}
                  </tbody>
                </table>
              </div>
            </div>
        `;
      });
      document.getElementById("stockout-section").innerHTML = stockOuthtml;
    } else {
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.error("Error getting document:", error);
  });

function editStockOut() {
  //var paid = prompt("Paid")
  alert("Functionality not defined");
}

function deleteStockOut(billid) {
  if (confirm("Sure to Delete!") == true) {
    var billDate = billid.slice(0, 10);
    const stockOutRef = db.collection("stockout").doc(billDate);

    // Remove the 'capital' field from the document
    const res = stockOutRef.update({
      [billid]: firebase.firestore.FieldValue.delete(),
    });

    document.getElementById(billid).remove();
  }
}

function searchDate(dateString) {
  const date = dateString;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  fetchingDate = `${day}-${month}-${year}`;
  
  if (fetchingDate.length == 10) {
    const docRef = db.collection("stockout").doc(fetchingDate);
    // Get the document
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Access the data of the document
          document.getElementById("stockout-section").innerHTML = ``;
          const data = doc.data();

          // Access nested map structures
          // const nestedMap1 = data.nestedMap1;
          // const nestedMap2 = data.nestedMap2;

          // // Access data within nested map structures
          // const nestedField1 = nestedMap1.field1;
          // const nestedField2 = nestedMap1.field2;
          // const nestedField3 = nestedMap2.field3;
          var entrys = Object.keys(data).length;
          document.getElementById("stock-out-date-length").textContent = entrys;
          var stockoutids = Object.keys(data).sort();
          var stockOuthtml = ``;

          stockoutids.forEach((id) => {
            var items = data[id].items;
            var rate = data[id].rate;
            var qty = data[id].qty;
            var price = data[id].price;

            var dummyScript = ``;
            for (i = 0; i < items.length; i++) {
              dummyScript += `<tr>
          <td>${items[i]}</td>
          <td>${rate[i]}</td>
          <td>${qty[i]}</td>
          <td>${price[i]}</td>
        </tr>`;
            }
            stockOuthtml += `
        <div class="card top-selling overflow-auto" id='${id}'>
              <div class="card-body pb-0">
                <h5 class="card-title head">
                  ${data[id].time} &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:deleteStockOut('${id}')">Delete</a>
                </h5>
                <h5 class="card-title">Seller: ${data[id].sellerName}</h5>
                <h5 class="card-title">Buyer: ${data[id].buyerName} | ${data[id].buyerPhone}</h5>
                <h5 class="card-title">Paid: ${data[id].paid}</h5>
                <h5 class="card-title">Amount: ${data[id].amount}</h5>
                <h5 class="card-title">Paid Amt: ${data[id].customerPaid}</h5>
                <br />
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dummyScript}
                  </tbody>
                </table>
              </div>
            </div>
        `;
          });
          document.getElementById("stockout-section").innerHTML = stockOuthtml;
        } else {
          console.log("No such document!");
          Alert("Enter Correct Date");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  } else {
    document.getElementById("searchDateStockOut").value = "Enter Correct Date";
  }
}
