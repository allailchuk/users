// Making request to the server 
function GET(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}

function POST(url, data, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open("POST", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

function PUT(url, data, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open("PUT", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

function DELETE(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback();
        }
    };
    xmlhttp.open("DELETE", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
}

GET('/restapi/users', function(rsp) {
    for (var i = 0; i < rsp.data.length; i++ ) {
        addUser(rsp.data[i].id, rsp.data[i].firstname, rsp.data[i].lastname, rsp.data[i].email);   
    }       
})

//creating new user
function create() {
    var inputFirstName = document.newUser.FirstName.value;
    var inputLastName = document.newUser.LastName.value;
    var inputEmail = document.newUser.Email.value;
    if (inputFirstName == "" || inputLastName == "" || inputEmail == "") {
        alert("You must fill out the form!")
    } else {
        POST('/restapi/users', {'firstname':inputFirstName,'lastname':inputLastName, 'email':inputEmail }, function(addedUser){
            addUser(addedUser.id, addedUser.firstname, addedUser.lastname, addedUser.email); 
            document.forms[0].elements[0].value = " ";
            document.forms[0].elements[1].value = " ";
            document.forms[0].elements[2].value = " ";
        })
    }      
}

//adding users from database to the userlist 
function addUser(id, firstname, lastname, email) {
    var table = document.getElementById("usersTable");
    var row = table.insertRow();
    row.setAttribute("data-id", id);
    row.id = id;
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = firstname;
    cell2.innerHTML = lastname;
    cell3.innerHTML = email;

//adding Delete button and Deleting user by clicking on Delete button     
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    cell4.appendChild(deleteButton);
    deleteButton.addEventListener ("click", function() {
        var conf = confirm("Do you confirm deletion?");
        if (conf == true) {
            DELETE('/restapi/users/' + id, function(){
                row.parentElement.removeChild(row);   
            })
        } else {
            alert("You pressed Cancel!");
        }
    }) 

//adding Edit button
    var editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    cell4.appendChild(editButton);
    editButton.addEventListener ("click", function() {
        document.getElementsByClassName('popup')[0].style.display = 'block';
        document.edit.firstname.value = cell1.innerHTML;
        document.edit.lastname.value = cell2.innerHTML;
        document.edit.email.value = cell3.innerHTML;
        document.edit.userId.value = row.id;
    });
}

//close Edit window
function closeWindow() {
    document.getElementsByClassName('popup')[0].style.display = 'none';
}

//submit changes 
function submitChanges() {
    var editFirstName = document.edit.firstname.value;
    var editLastName = document.edit.lastname.value;
    var editEmail = document.edit.email.value;
    var id = document.edit.userId.value;
    PUT('/restapi/users/' +id, {'firstname':editFirstName,'lastname':editLastName, 'email':editEmail, 'id':id }, function(editedUser) {
        addUser(editedUser.id, editedUser.firstname, editedUser.lastname, editedUser.email); 
    } )
    
}








