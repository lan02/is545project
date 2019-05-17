//from add app and web
var firebaseConfig = {
    apiKey: "AIzaSyD59udR7CbjCVK7Vbloucf7JQs7g4JAwVc",
    authDomain: "is545project-41757.firebaseapp.com",
    databaseURL: "https://is545project-41757.firebaseio.com",
    projectId: "is545project-41757",
    storageBucket: "is545project-41757.appspot.com",
    messagingSenderId: "150966101000",
    appId: "1:150966101000:web:64a178b3410e8cee"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //both are for firebase. from script source in html allows to use this coding. taught from documents in firebase
const dbRef = firebase.database().ref();
const contactsRef = dbRef.child('contacts');

window.onload = function() {
    readData();
}

function readData() {  
    //.on means everytime value changes in database, .on means it's always searching for change (firebase thing). Snap is a function that takes a snapshot of the database. Every time a value changes it takes a snapshot of the database. 
    contactsRef.on("value", snap => {
        let contactsTblBody = document.getElementById("contactsTblBody");
        //clears out the table every time there is a change in the database
        contactsTblBody.innerHTML = "";

        //iterates through each child similar to loop. Snap was function for reading database, looping each contact in database
        snap.forEach(childSnap => {
            //childsnap refers to each contact. Key is unique id #. keyvalue is the name, email, and phone. (.key and .val is firebase)
            let key = childSnap.key,
                keyValue = childSnap.val()
            
            //creating row in table    
            let tblBody = document.getElementById("contactsTblBody");
            let row = tblBody.insertRow();
            let cellNum = row.insertCell(0);
            let cellName = row.insertCell(1);
            let cellEmail = row.insertCell(2);
            let cellPhone = row.insertCell(3);
            
            //add the value to the table
            cellName.appendChild(document.createTextNode(keyValue.name));
            cellEmail.appendChild(document.createTextNode(keyValue.email));
            cellPhone.appendChild(document.createTextNode(keyValue.phone));
        });
        countRows();
    });
};

// Count Rows
function countRows() {
    let contactsTbl = document.getElementById("contactsTbl");
    let contactsTblBody = contactsTbl.tBodies[0];
    let countRow = contactsTblBody.rows.length;
    for(let i = 0; i < countRow; i++) {
        contactsTblBody.rows[i].cells[0].innerHTML = i + 1;
        }
};

let tableContainer = document.getElementById("tableContainer");
let newContactModal = document.getElementById("newContactModal");
let detailModal = document.getElementById("detailModal");
let editModal = document.getElementById("editModal");

// Home Button
let homeBtn = document.getElementById("navbarHome");
homeBtn.addEventListener("click", () => {
    tableContainer.style.display = "block";
    newContactModal.style.display = "none";
    detailModal.style.display = "none";
    editModal.style.display = "none";
    readData();
});

// New Button
const addNewBtn = document.getElementById("navbarNew");
addNewBtn.addEventListener("click", () => {
    let newContactName = document.getElementById("newContactName");
    let newContactEmail = document.getElementById("newContactEmail");
    let newContactPhone = document.getElementById("newContactPhone");
    newContactName.value = "";
    newContactEmail.value = "";
    newContactPhone.value = "";
    let nameMessage = document.getElementById("nameMessage");
    let emailMessage = document.getElementById("emailMessage");
    let phoneMessage = document.getElementById("phoneMessage");
    nameMessage.innerHTML = "";
    emailMessage.innerHTML = "";
    phoneMessage.innerHTML = "";

    tableContainer.style.display = "none";
    detailModal.style.display = "none";
    editModal.style.display = "none";
    newContactModal.style.display = "block";
});


// Add New Contact Page
const addNewCancelBtn = document.getElementById("newContactCancelBtn");
addNewCancelBtn.addEventListener("click", () => {
    newContactModal.style.display = "none";
    tableContainer.style.display = "block";
    readData();
});

const newContactSubmitBtn = document.getElementById("newContactSubmitBtn");
newContactSubmitBtn.addEventListener("click", addNewContact);

function addNewContact() {
    const newContactName = document.getElementById('newContactName');
    const newContactEmail = document.getElementById('newContactEmail');
    const newContactPhone = document.getElementById('newContactPhone');
    let nameMessage = document.getElementById("nameMessage");
    let emailMessage = document.getElementById("emailMessage");
    let phoneMessage = document.getElementById("phoneMessage");
    nameMessage.innerHTML = "";
    emailMessage.innerHTML = "";
    phoneMessage.innerHTML = "";
    
    if(!newContactName.checkValidity()) {
        nameMessage.innerHTML = "*Required";
    } else if(!newContactEmail.checkValidity()) {
        emailMessage.innerHTML = "*Invalid: Email takes form of username@server.domain";
    } else if(!newContactPhone.checkValidity()) {
        phoneMessage.innerHTML = "*Invalid: Phone takes form of 10 digits, not starting with 1 or 0";
    } else {
        const addNewInputs = document.getElementsByClassName("input");
        let newContact = {};

        for (let i = 0, len = addNewInputs.length; i < len; i++) {
            let key = addNewInputs[i].getAttribute('data-key');
            let value = addNewInputs[i].value;
            newContact[key] = value;
        }
        let uid = contactsRef.push(newContact).getKey();
        detail();
        function detail() {
            const detailName = document.getElementById("detailName");
            const detailEmail = document.getElementById("detailEmail");
            const detailPhone = document.getElementById("detailPhone");

            detailName.setAttribute("uid", uid);

            let detailRef = dbRef.child('contacts/' + uid);
            detailRef.once("value", snap => {
                detailName.innerHTML = snap.val().name;
                detailEmail.innerHTML = snap.val().email;
                detailPhone.innerHTML = snap.val().phone;
            });
        }
        event.preventDefault();
        newContactModal.style.display = "none";
        detailModal.style.display = "block";
    }
};

// Details Page
const detailCloseBtn = document.getElementById("detailClose");
detailCloseBtn.addEventListener("click", () => {
    detailModal.style.display = "none";
    tableContainer.style.display = "block";
    readData();
});

const detailEditBtn = document.getElementById("detailEdit");
detailEditBtn.addEventListener("click", detailEdit);

function detailEdit() {
    let detailName = document.getElementById("detailName");
    let uid = detailName.getAttribute("uid");
    const editContactInput = document.querySelectorAll(".editContactInput");
    document.querySelector(".editContact").value = uid;
    
    let detailRef = dbRef.child('contacts/' + uid);
    detailRef.once("value", snap => {
        for(let i = 0, len = editContactInput.length; i < len; i++) {
            let key = editContactInput[i].getAttribute("data-key");
            editContactInput[i].value = snap.val()[key];
        }
    });
    detailModal.style.display = "none";
    editModal.style.display = "block";
};

const detailDeleteBtn = document.getElementById("detailDelete");
detailDeleteBtn.addEventListener("click", detailDelete);

function detailDelete(e) {
    e.stopPropagation();
    let confirmDelete = confirm("Are you sure you wish to delete this contact?");
    if (confirmDelete == true) {
        let detailName = document.getElementById("detailName");
        let uid = detailName.getAttribute("uid");

        let detailRef = dbRef.child('contacts/' + uid);
        detailRef.remove();
        readData();
        detailModal.style.display = "none";
        tableContainer.style.display = "block";
    }
};

// Edit Page
const editSaveBtn = document.getElementById("editSaveBtn");
editSaveBtn.addEventListener("click", saveBtn);

function saveBtn(e) {
    let editName = document.getElementById("editName");
    let editEmail = document.getElementById("editEmail");
    let editPhone = document.getElementById("editPhone");
    let editNameMessage = document.getElementById("editNameMessage");
    let editEmailMessage = document.getElementById("editEmailMessage");
    let editPhoneMessage = document.getElementById("editPhoneMessage");
    editNameMessage.innerHTML = "";
    editEmailMessage.innerHTML = "";
    editPhoneMessage.innerHTML = "";

    if(!editName.checkValidity()) {
        editNameMessage.innerHTML = '*Required';
    } else if(!editEmail.checkValidity()) {
        editEmailMessage.innerHTML = "*Invalid: Email takes form of username@server.domain";
    } else if(!editPhone.checkValidity()) {
        editPhoneMessage.innerHTML = "*Invalid: Phone takes form of 10 digits, not starting with 1 or 0";
    } else {
        let uid = document.querySelector(".editContact").value;
        let editedContact = {};
        const editContactInput = document.querySelectorAll(".editContactInput");

        editContactInput.forEach(function(textField) {
            let key = textField.getAttribute("data-key");
            let keyValue = textField.value;
            editedContact[key] = keyValue;
        });

        let contactRef = dbRef.child('contacts/' + uid);
        contactRef.update(editedContact);

        event.preventDefault();
        editModal.style.display = "none";
        tableContainer.style.display = "block";
        readData();
    }
};

const editCancelBtn = document.getElementById("editCancelBtn");
editCancelBtn.addEventListener("click", cancelBtn);

function cancelBtn () {
    let editNameMessage = document.getElementById("editNameMessage");
    let editEmailMessage = document.getElementById("editEmailMessage");
    let editPhoneMessage = document.getElementById("editPhoneMessage");
    editNameMessage.innerHTML = "";
    editEmailMessage.innerHTML = "";
    editPhoneMessage.innerHTML = "";
    editModal.style.display = "none";
    tableContainer.style.display = "block";
    readData();
};

// Index
const indexBtn = document.getElementById("navbarIndex");
indexBtn.addEventListener("click", index);

function index() {  
    newContactModal.style.display = "none"
    detailModal.style.display = "none"
    editModal.style.display = "none";
    tableContainer.style.display = "block";

    contactsRef.on("value", snap => {
        let contactsTblBody = document.getElementById("contactsTblBody");
        contactsTblBody.innerHTML = "";

        snap.forEach(childSnap => {
            let key = childSnap.key;
            let keyValue = childSnap.val();
            
            let tblBody = document.getElementById("contactsTblBody");
            let row = tblBody.insertRow();
            let cellNum = row.insertCell(0);
            let cellName = row.insertCell(1);
            let cellEmail = row.insertCell(2);
            let cellPhone = row.insertCell(3);
            let cellIndex = row.insertCell(4);
            cellIndex.style.width = "103px";

            let detailIconBtn = document.createElement('button');
            detailIconBtn.class = "detailContact";
            detailIconBtn.setAttribute("uid", key);
            detailIconBtn.addEventListener("click", detailBtn)

            let detailIcon = document.createElement('i');
            detailIcon.classList.add('fas', 'fa-info-circle');
            detailIcon.setAttribute("uid", key);
            detailIcon.addEventListener("click", detailBtn)
            detailIconBtn.append(detailIcon);

            let editIconBtn = document.createElement('button');
            editIconBtn.class = "editContact";
            editIconBtn.setAttribute("uid", key);
            editIconBtn.addEventListener("click", editBtn);
            
            let editIcon = document.createElement('i');
            editIcon.classList.add('fas', 'fa-edit');
            editIcon.setAttribute("uid", key);
            editIcon.addEventListener("click", editBtn);
            editIconBtn.append(editIcon);

            let deleteIconBtn = document.createElement('button');
            deleteIconBtn.class = "deleteContact";
            deleteIconBtn.setAttribute("uid", key);
            deleteIconBtn.addEventListener("click", deleteBtn);

            let deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash');
            deleteIcon.setAttribute("uid", key);
            deleteIcon.addEventListener("click", deleteBtn);
            deleteIconBtn.append(deleteIcon);
            
            cellName.appendChild(document.createTextNode(keyValue.name));
            cellEmail.appendChild(document.createTextNode(keyValue.email));
            cellPhone.appendChild(document.createTextNode(keyValue.phone));
            cellIndex.append(detailIconBtn);
            cellIndex.append(editIconBtn);
            cellIndex.append(deleteIconBtn);
        });
        countRows();
    });
};

// Edit (Index)
function editBtn(e) {
    let uid = e.target.getAttribute("uid");
    document.querySelector(".editContact").value = uid;
    const editContactInput = document.querySelectorAll(".editContactInput");

    let contactRef = dbRef.child('contacts/' + uid);
    contactRef.once("value", snap => {
        for(let i = 0, len = editContactInput.length; i < len; i++) {
            let key = editContactInput[i].getAttribute("data-key");
            editContactInput[i].value = snap.val()[key];
        }
    });
    tableContainer.style.display = "none";
    editModal.style.display = "block";
};

// Delete (Index)
function deleteBtn(e) {
    e.stopPropagation();
    let confirmDelete = confirm("Are you sure you wish to delete this contact?");
    if (confirmDelete == true) {
        let uid = e.target.getAttribute("uid");
        let contactRef = dbRef.child('contacts/' + uid);
        contactRef.remove();
    }
};

// Details (Index)
function detailBtn(e) {
    tableContainer.style.display = "none";
    detailModal.style.display = "block";

    const detailName = document.getElementById("detailName");
    const detailEmail = document.getElementById("detailEmail");
    const detailPhone = document.getElementById("detailPhone");
    
    let uid = e.target.getAttribute("uid");
    detailName.setAttribute("uid", uid);

    let detailRef = dbRef.child('contacts/' + uid);
    detailRef.once("value", snap => {
        detailName.innerHTML = snap.val().name;
        detailEmail.innerHTML = snap.val().email;
        detailPhone.innerHTML = snap.val().phone;
    });
};