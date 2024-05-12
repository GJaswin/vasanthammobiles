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
const itemKey = urlParams.get("item");

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

const dbRef = database.ref();
dbRef
    .child("items")
    .get()
    .then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const key = childSnapshot.key;
                const value = childSnapshot.val();



                document.getElementById("stockIn-items").innerHTML += `
                        <tr id='${key}'>
                          <td>${key}</td>
                          <td>${value}</td>
                          <td>
                            <span class="text-primary">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#addToStock" onclick="getItem('${key}', ${value})"><i class="bi bi-plus-circle-fill"></i></a>
                            </span>
                          </td>
                        </tr>
      `;

            });
            // filterRows("");
            // document.getElementById("totalPages").textContent = countPages();
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });


function getItem(itemName, itemRate) {

    stockName = capitalize(itemName.trim().toLowerCase()).toString();
    stockRate = itemRate;
    console.log(stockName, stockRate);

    document.querySelector("#addToStock .modal-title").innerHTML= `Add to Stock - ${stockName}`;

}

const paidButton = document.getElementById('paid');
var stockPaid = false;

paidButton.addEventListener('change', function () {
    if (this.checked) {
        stockPaid = true;
        console.log(stockPaid);
    } else {
        stockPaid = false;

        console.log(stockPaid);
    }
});

function addItem() {

    var stockSeller = capitalize(document.getElementById("stockSeller").value.trim().toLowerCase());
    var stockQty = parseInt(document.getElementById("stockQty").value, 10);
    var stockPrice = parseInt(document.getElementById("stockPrice").value, 10);


    var stockPaidVal = stockPaid.toString();

    const itemData = {
        stockName: stockName,
        stockRate: stockRate,
        stockSeller: stockSeller,
        stockQty: stockQty,
        stockPrice: stockPrice,

    }

    console.log(itemData);

    function getTimestamp() {
        //fulltime = new Date();
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
        dateID = `${day}-${month}-${year}`
        fulltime = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`
        readableTime = date.toISOString();
        return dateID;
    }


    const docRef = db.collection("stockin").doc(getTimestamp());

    const docData = {
        [fulltime]: {
            item: {
                name: stockName,
                rate: stockRate,
                qty: stockQty,
                price: stockPrice,
                time: readableTime

            },
            seller: stockSeller,
            paid: stockPaidVal
        }
    }

    // const docData = {
    //     [Date.now().toString()]: {
    //         items: [stockName],
    //         rates: [stockRate],
    //         qty: [stockQty],
    //         price: [stockPrice],
    //         balance: stockBalance,
    //         seller: stockSeller,
    //         paid: stockPaid
    //     }

    // }

    docRef
        .get()
        .then(() => {

            db.collection("stockin")
                .doc(getTimestamp())
                .set(docData, { merge: true })
                .then(() => {
                    database
                        .ref(`/stockin/${getTimestamp()}`)
                        .update(docData)
                    // .then(() => {
                    //     database
                    //         .ref("/")
                    //         .update({
                    //             "item-count": firebase.database.ServerValue.increment(1),
                    //         });
                    // });
                    console.log("Document(Item) successfully written!");
                    document.getElementById("alert-msg").textContent = stockName + " - Item Added!";
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    document.getElementById("alert-msg").textContent =
                        "Error Occured, Try Again!";
                });

        })
        .catch((error) => {
            console.error("Error getting document: ", error);
            document.getElementById("alert-msg").textContent =
                "Error Occured, Try Again!";
        });
}