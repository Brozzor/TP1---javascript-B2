let registerArray = []
let isDisplay = false;

function register() {
    const fn = document.getElementById('firstname')
    const ln = document.getElementById('lastname')
    if (!fn.value || !ln.value){
        return false;
    }
    registerArray.push({
        firstname: fn.value,
        lastname: ln.value,
        dateInsert: new Date().toLocaleString()
    }) 
    fn.value = ""
    ln.value = ""
    if (isDisplay){
        display();
    }
}

function display(isSearch = false, firstname = null, lastname = null) {
    isDisplay = true;
    document.getElementById('list').hidden = false
    const div = document.getElementById('studentsList')
    div.innerHTML = "";

    let displayArray = [];
    if (isSearch){
        displayArray = searchStudent(firstname, lastname)
    }else{
        displayArray = registerArray;
    }

    let i = 0;
    while(i < displayArray.length) {
        let element = document.createElement("tr");
        element.innerHTML = `<td>${displayArray[i].firstname}</td>
        <td>${displayArray[i].lastname}</td>
        <td>${displayArray[i].dateInsert}</td>`
        div.appendChild(element);
        i++;
    }
    
}

function search() {
    const firstname = document.getElementById('firstname').value
    const lastname = document.getElementById('lastname').value
    display(true, firstname, lastname)
}

function searchStudent(firstname, lastname) {

    let i = 0;
    while (i < registerArray.length){
        if (registerArray[i].firstname == firstname && registerArray[i].lastname == lastname){
            return [{
                firstname: registerArray[i].firstname,
                lastname: registerArray[i].lastname,
                dateInsert: registerArray[i].dateInsert
            }]
        }
        i++;
    }
    return [{
        firstname: "unkown",
        lastname: "unkown",
        dateInsert: "unkown"
    }]
}