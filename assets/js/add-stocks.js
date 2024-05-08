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

function addItem() {

    var stockName = capitalize(document.getElementById("stock-name").value.trim().toLowerCase());
    var stockSeller = capitalize(document.getElementById("stock-seller").value.trim().toLowerCase());
    var stockRate = parseInt(document.getElementById("stock-rate").value, 10);
    var stockQty = parseInt(document.getElementById("stock-qty").value, 10);
    var stockPrice = parseInt(document.getElementById("stock-price").value, 10);
    var stockBalance = parseInt(document.getElementById("stock-balance").value, 10);
    var stockPaid = (stockBalance > 0) ? false : true;

    // var stockPaid = capitalize(document.getElementById("stock-paid").value.trim().toLowerCase());

    function getTimestamp() {
        fulltime = new Date();
        var timestamp = `${fulltime.getDate()}-${fulltime.getMonth()}-${fulltime.getFullYear()}`
        return timestamp
    }

    const docRef = db.collection("stockin").doc(getTimestamp());

    const docData = {
        [Date.now().toString()]: {
            item: {
                name: stockName,
                rate: stockRate,
                qty: stockQty,
                price: stockPrice,
                time: fulltime

            },
            balance: stockBalance,
            seller: stockSeller,
            paid: stockPaid
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