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

// var pages;
// var docs;
// var docs_per_page = 3;

// Firestore Reading Count data from Items Collection
// db.collection("items").doc("item-count").get().then((doc) => {
//     if (doc.exists) {
//         docs = doc.data().count;
//         pages = Math.ceil(docs/docs_per_page);
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No item-cont document!");
//     }
// }).catch((error) => {
//     console.log("Error getting item-count document:", error);
// });

// database.ref('/item-count').once('value').then((snapshot) => {
//     docs = (snapshot.val());
//     pages = Math.ceil(docs/docs_per_page);
//     document.getElementById("total-pages").textContent = pages;
//     document.getElementById("page-search-input").setAttribute("max",pages);
// }).catch((error) => {
//     console.log("Error getting item-count document:", error);
// });

// function showPageDocs(i){
//     var startDoc = (i*docs_per_page) - (docs_per_page-1);
//     var sno=1;
//     db.collection('items')
//         .orderBy('__name__') // Order documents by their IDs
//         .startAt('4'.toString()) // Start at the document with index startIndex
//         .limit(docs_per_page)
//         .get()
//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 // Print data of each document
//                 console.log(doc.id, ' => ', doc.data());
//                 document.getElementById("table-body").innerHTML += `
//                 <tr>
//                 <td>${sno}</td>
//                 <td>${doc.id}</td>
//                 <td>${doc.data().category}</td>
//                 <td>${doc.data().rate}</td>
//                 <td><a href="${doc.data().id}"><i class="bi bi-pencil-fill"></i
//                   ></a>
//                 </td>
//                 <td><a href="${doc.data().id}"><i class="bi bi-trash-fill"></i
//                   ></a>
//                 </td>
//               </tr>
//                 `
//                 sno++;
//             });
//         })
//         .catch((error) => {
//             console.error('Error getting documents: ', error);
//         });
// }
// function getTimestamp() {
//   var time = new Date();
//   var timestamp = `${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`
//   return timestamp
// }


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
  var timestamp = `${day}-${month}-${year}`
  fulltime = Date.now().toString();
  return timestamp;
}


const dbRef = database.ref();
dbRef
  .child(`/stockin/${getTimestamp()}`)
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const details = childSnapshot.val();
        const item = childSnapshot.val().item;

        const data = {
          stockName: item.name,
          stockSeller: details.seller,
          stockRate: item.rate,
          stockQty: item.qty,
          stockPrice: item.price,
          stockBalance: details.balance,
          stockPaid: details.paid

        }
        console.log(data);
        // for (var names of data.stockName) {
        //   console.log(names);

        // }

        document.getElementById("table-body-items").innerHTML += `
                        <tr id='${key}'>
                          <td>${data.stockName}</td>
                          <td>${data.stockSeller}</td>
                          <td>${data.stockRate}</td>
                          <td>${data.stockQty}</td>
                          <td>${data.stockPrice}</td>
                          <td>${data.stockPaid}</td>
                          <td>
                            <span class="text-primary"
                              ><a href="update-item.html?item=${key}"><i class="bi bi-pencil-fill"></i
                            ></a></span>
                          </td>
                          <td>
                            <span class="text-danger"
                              ><a href="javascript:deleteItem('${key}', '${data.stockName}')"><i class="bi bi-trash-fill"></i
                            ></a></span>
                          </td>
                        </tr>
      `;
      });
      filterRows("");
      document.getElementById("totalPages").textContent = countPages();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

// function deleteItem(key, stockName) {
//   var result = confirm("Are you sure you want to delete " + stockName + " ?");
//   if (result) {
//     db.collection("stockin")
//       .doc(key)
//       .delete()
//       .then(function () {
//         database
//           .ref("stockin/" + key)
//           .remove()
//           .then(() => {
//             database
//               .ref("/")
//               .update({
//                 "item-count": firebase.database.ServerValue.increment(-1),
//               })
//               .then(() => {
//                 document.getElementById(itemName).remove();
//                 console.log(itemName + " Document successfully deleted!");
//                 alert(itemName + " Deleted Successfully");
//                 changePage(1);
//               });
//           });
//       })
//       .catch(function (error) {
//         console.error("Error removing document docid: ", error);
//       });
//   }
// }
