//init IndexDB

let request = indexedDB.open("Students", 2);
request.onerror = function (event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};

request.onupgradeneeded = function (event) {
  let db = event.target.result;

  let objectStore = db.createObjectStore("students", { keyPath: "id" });

  objectStore.createIndex("firstname", "firstname", { unique: false });
  objectStore.createIndex("lastname", "lastname", { unique: false });
  objectStore.createIndex("dataSign", "dataSign", { unique: false });
  objectStore.createIndex("dateInsert", "dataInsert", { unique: false });
};

// script
let signaturePad = new SignaturePad(document.getElementById("signature-pad"), {
  backgroundColor: "rgba(255, 255, 255, 0)",
  penColor: "rgb(0, 0, 0)",
});
let signatureAdminView = new SignaturePad(document.getElementById("signatureAdminView"));
signatureAdminView.off();

if (!localStorage.registerArray) {
  localStorage.registerArray = "[]";
}
let registerArray = JSON.parse(localStorage.registerArray) || [];
function register() {
  const fn = document.getElementById("firstname");
  const ln = document.getElementById("lastname");
  if (!fn.value || !ln.value) {
    return error("Your firstname or lastname is invalid");
  } else if (fn.value.length < 3 || ln.value.length < 3) {
    return error("Your firstname or lastname is too short");
  } else if (!signaturePad.toData().length) {
    return error("You must sign");
  }

  registerArray.push({
    id: registerArray.length,
    firstname: fn.value,
    lastname: ln.value,
    dataSign: signaturePad.toData(),
    dateInsert: new Date().toLocaleString(),
  });
  localStorage.registerArray = JSON.stringify(registerArray);
  //new version
  addStudentInDb(registerArray.length,fn.value,ln.value,signaturePad.toData())
  // ----------

  fn.value = "";
  ln.value = "";
  signaturePad.clear();
}

function display(isSearch = false, name = null) {
  const div = document.getElementById("studentsList");
  div.innerHTML = "";

  let displayArray = [];
  if (isSearch) {
    displayArray = searchStudent(name);
  } else if (!localStorage.registerArray || !localStorage.registerArray.length) {
    return false;
  } else {
    displayArray = JSON.parse(localStorage.registerArray);
  }

  let i = 0;
  while (i < displayArray.length) {
    let element = document.createElement("tr");
    element.innerHTML = `<td>${displayArray[i].firstname}</td>
        <td>${displayArray[i].lastname}</td>
        <td>${displayArray[i].dateInsert}</td>
        <td><button type="button" class="btn btn-warning" onclick="viewSign(${displayArray[i].id})" data-toggle="modal" data-target="#modalSign">view</button></td>`;
    div.appendChild(element);
    i++;
  }
}

function search() {
  const name = document.getElementById("search").value;
  display(true, name);
}

function searchStudent(name) {
  let res = [];
  let i = 0;
  const searchArray = JSON.parse(localStorage.registerArray);
  while (i < searchArray.length) {
    if (searchArray[i].firstname.includes(name) || searchArray[i].lastname.includes(name)) {
      res.push({
        id: searchArray[i].id,
        firstname: searchArray[i].firstname,
        lastname: searchArray[i].lastname,
        dataSign: searchArray[i].dataSign,
        dateInsert: searchArray[i].dateInsert,
      });
    }
    i++;
  }
  return res;
}

function changeView(view) {
  switch (view) {
    case "admin":
      document.getElementById("adminPanel").hidden = false;
      document.getElementById("studentPanel").hidden = true;
      display();
      break;
    case "student":
      document.getElementById("adminPanel").hidden = true;
      document.getElementById("studentPanel").hidden = false;

      break;

    default:
      break;
  }
}

function error(message) {
  const errorAtt = document.getElementById("errorDisplay");
  errorAtt.hidden = false;
  errorAtt.innerText = message;
  setTimeout(() => {
    errorAtt.hidden = true;
  }, 5000);
}

function viewSign(id) {
  signatureAdminView.fromData(JSON.parse(localStorage.registerArray)[id].dataSign);
}

function resetStudentsList() {
  localStorage.clear();
  location.reload();
}

// new function for indexedDB :

function addStudentInDb(id,firstname,lastname,dataSign) {
  db = request.result;
  var tx = db.transaction("students", "readwrite");
  var store = tx.objectStore("students");
  store.put({
    id,
    firstname,
    lastname,
    dataSign,
    dateInsert: new Date().toLocaleString(),
  });
}
