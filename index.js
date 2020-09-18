let isDisplay = false;

if (!localStorage.registerArray) {
  localStorage.registerArray = [];
}
let registerArray = JSON.parse(localStorage.registerArray) || [];
function register() {
  const fn = document.getElementById("firstname");
  const ln = document.getElementById("lastname");
  if (!fn.value || !ln.value) {
    return error("Your firstname or lastname is invalid");
  } else if (fn.value.length < 3 || ln.value.length < 3) {
    return error("Your firstname or lastname is too short");
  }
  registerArray.push({
    firstname: fn.value,
    lastname: ln.value,
    dateInsert: new Date().toLocaleString(),
  });
  localStorage.registerArray = JSON.stringify(registerArray);
  fn.value = "";
  ln.value = "";
  if (isDisplay) {
    display();
  }
}

function display(isSearch = false, firstname = null, lastname = null) {
  isDisplay = true;
  document.getElementById("list").hidden = false;
  const div = document.getElementById("studentsList");
  div.innerHTML = "";

  let displayArray = [];
  if (isSearch) {
    displayArray = searchStudent(firstname, lastname);
  } else {
    displayArray = localStorage.registerArray;
  }

  let i = 0;
  while (i < displayArray.length) {
    let element = document.createElement("tr");
    element.innerHTML = `<td>${displayArray[i].firstname}</td>
        <td>${displayArray[i].lastname}</td>
        <td>${displayArray[i].dateInsert}</td>`;
    div.appendChild(element);
    i++;
  }
}

function search() {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  display(true, firstname, lastname);
}

function searchStudent(firstname, lastname) {
  let i = 0;
  while (i < localStorage.registerArray.length) {
    if (localStorage.registerArray[i].firstname == firstname && localStorage.registerArray[i].lastname == lastname) {
      return [
        {
          firstname: localStorage.registerArray[i].firstname,
          lastname: localStorage.registerArray[i].lastname,
          dateInsert: localStorage.registerArray[i].dateInsert,
        },
      ];
    }
    i++;
  }
  return [
    {
      firstname: "unkown",
      lastname: "unkown",
      dateInsert: "unkown",
    },
  ];
}

function changeView(view) {
  switch (view) {
    case "admin":
      document.getElementById("adminPanel").hidden = false;
      document.getElementById("studentPanel").hidden = true;
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
