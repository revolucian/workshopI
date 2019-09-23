const STUDENT_LIST_KEY = 'studentList';

var inputName = document.getElementById('input-name');
var inputSurname = document.getElementById('input-surname');
inputName.onblur = validateName;
inputSurname.onblur = validateName;

function validateName (_event) {
    var inputNodeName = event.target;
    var value = inputNodeName.value;

    var validNameInput = typeof value === 'string' && isNaN(value) && value !== "";
   
    actualizeClass (validNameInput, inputNodeName);
    validateAddButton();
}

var inputDni = document.getElementById('input-dni');
inputDni.onblur = validateDni;

function validateDni (_event) {
    var inputNodeDni = event.target;
    var value = inputNodeDni.value;

    var validDniInput = !isNaN(value) && value > 0;
    var validDni = validDniInput && isDniUnique(value);

    actualizeClass (validDni, inputNodeDni);
    validateAddButton();
  }

  function isDniUnique(_dni){
      var studentPosition = findStudentByDni(_dni);
      if(studentPosition){
          return false;
      }
      return true;
  }

var inputEmail = document.getElementById('input-email');
inputEmail.onblur = validateInputEmail;

function validateInputEmail (_event){
    var inputNodeEmail = event.target;
    var value = inputNodeEmail.value;

    var validEmailInput = value.indexOf('@') !==-1 && value.indexOf ('.com') !== -1;

    actualizeClass (validEmailInput, inputNodeEmail);
    validateAddButton();
}

function actualizeClass (_validInput, _node){
    
    if (_validInput){
    _node.classList.remove("is-invalid");
    _node.classList.add("is-valid");    
    }
    else{
        _node.classList.remove("is-valid");
        _node.classList.add("is-invalid");    
    }
}

function validateAddButton(){
    var addButton = document.getElementById('add-button');
    var inputName = document.getElementById("input-name");
    var inputSurname = document.getElementById("input-surname");
    var inputDni = document.getElementById('input-dni');
    var inputEmail = document.getElementById('input-email');

    var validFirstName = inputName.classList.contains('is-valid');
    var validLastName = inputSurname.classList.contains('is-valid');
    var validDni = inputDni.classList.contains('is-valid');
    var validEmail = inputEmail.classList.contains('is-valid');

    //habilito el botón solo si todos los campos son validos.
    if(validFirstName && validLastName && validDni && validEmail){
        addButton.disabled = false;
        addButton.classList.add("valid-add-button");
    }
}

var addButton = document.getElementById('add-button');
addButton.onclick = addStudent;

function addStudent(){
    var studentListString = localStorage.getItem(STUDENT_LIST_KEY);

    var inputDni = document.getElementById('input-dni');
    var inputFirstName = document.getElementById("input-name");
    var inputLastName = document.getElementById("input-surname");
    var inputEmail = document.getElementById("input-email");

    var studentAlreadyExist = findStudentByDni(inputDni.value);

    //Evito guardar duplicados
    if(!studentAlreadyExist){
      var student = {
          firstName: inputFirstName.value,
          lastName: inputLastName.value,
          dni: inputDni.value,
          email: inputEmail.value
      }
    
      var studentList;
      
      if (studentListString) {
          //Si el elemento ya existe en local storage, solo agrego con push
          studentList = JSON.parse(studentListString);
          studentList.push(student);      
      } else {
          //si es la primera vez, creo la lista y guardo
          studentList = [student];
      }
    
      localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(studentList));
      createStudentNode(student);
    }  
  }

  function findStudentByDni(_dni){
    var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
    
    if(studentListString){
        var studentList = JSON.parse(studentListString);

        for(var i = 0; i < studentList.length; i++){
            if (_dni == studentList[i].dni){
                return { 
                    student: studentList[i], 
                    position: i
                };
            }
        }
    } 
    //Si la lista no existe, o no encontré una coincidencia devuelvo null
    return null;
}

function createStudentNode(newStudent) {
    var studentsListDiv = document.getElementById('students-list');

    var studentItem = document.createElement("div");
    var fullName = document.createElement("p");
    var dni = document.createElement("p");
    var email = document.createElement("p");
  
    fullName.innerHTML = "<b>Nombre:</b> " + newStudent.firstName + " " + newStudent.lastName;
    dni.innerHTML = "<b>DNI:</b> " + newStudent.dni;
    email.innerHTML = "<b>Email:</b> " + newStudent.email;
  
    studentItem.classList.add("list-group-item");
    studentItem.appendChild(fullName);
    studentItem.appendChild(dni);
    studentItem.appendChild(email);
    
    studentsListDiv.appendChild(studentItem);
}

var removeButton = document.getElementById('remove-button');
removeButton.onclick = deleteStudent;

function deleteStudent(){
    var inputDniToDelete = document.getElementById('input-dni-remove');
    var valueToDelete = inputDniToDelete.value;
    var studentPosition = findStudentByDni(valueToDelete);

    if (studentPosition) {
        //Si encontre el estudiante, elimino el elemento en dicha posicion
        var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
        var studentList = JSON.parse(studentListString);
        studentList.splice(studentPosition.position, 1);  
        localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(studentList));    
        location.reload();
    }   
  }

  var searchButton = document.getElementById('search-button');
  searchButton.onclick = searchStudent;

  function searchStudent (){
      var inputDniToSearch = document.getElementById('input-dni-search');
      var valueToSearch = inputDniToSearch.value;
      var studentPosition = findStudentByDni(valueToSearch);

      if(studentPosition){
        var studentsListDiv = document.getElementById('students-search-list');

        var studentItem = document.createElement("div");
        var fullName = document.createElement("p");
        var dni = document.createElement("p");
        var email = document.createElement("p");

        fullName.innerHTML = "<b>Nombre:</b> " + studentPosition.student.firstName + " " + studentPosition.student.lastName;
        dni.innerHTML = "<b>DNI:</b> " + studentPosition.student.dni;
        email.innerHTML = "<b>Email:</b> " + studentPosition.student.email;
      
        studentItem.classList.add("list-group-item");
        studentItem.appendChild(fullName);
        studentItem.appendChild(dni);
        studentItem.appendChild(email);
        
        studentsListDiv.appendChild(studentItem);
      }
      }

  window.onload = function(){
    var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
    var studentList = JSON.parse(studentListString);

    for (var i = 0; i < studentList.length; i++) {
        var student = studentList[i];
        createStudentNode(student);
    }

}

/*const STUDENT_LIST_KEY = 'studentList';
​
var myFirstName = document.getElementById("input-firstName");
var myLastName = document.getElementById("input-lastName");
​
myFirstName.onblur = validateInputName;
myLastName.onblur = validateInputName;
​
function validateInputName(_event) {
  var inputNode = _event.target;
  var inputValue = inputNode.value;
  
  var isValidField = typeof inputValue === "string" && 
                    isNaN(inputValue) && inputValue != "";
​
  updateClasses(isValidField, inputNode);
  validateAddButton();
}
​
var inputDni = document.getElementById('input-dni');
inputDni.onblur = validateDni;
​
function validateDni(_event) {
  var inputNode = _event.target;
  var value = inputNode.value;
​
  var isAValidNumber = !isNaN(value) && value > 0;   
  var validDni = isAValidNumber && isDniUnique(value);
​
  updateClasses(validDni, inputNode);
  validateAddButton();
}
​
function isDniUnique(_dni){
    var studentPosition = findStudentByDni(_dni);
    if(studentPosition){
        return false;
    }
    return true;
}
​
function updateClasses(_isValidField, _node) {
  if (_isValidField) {
    _node.classList.remove("is-invalid");
    _node.classList.add("is-valid");
  } else {
    _node.classList.remove("is-valid");
    _node.classList.add("is-invalid");
  }
}
​
function validateAddButton(){
    var addButton = document.getElementById('button-add');
​
    var inputFirstName = document.getElementById("input-firstName");
    var inputLastName = document.getElementById("input-lastName");
    var inputDni = document.getElementById('input-dni');
​
    var validFirstName = inputFirstName.classList.contains('is-valid');
    var validLastName = inputLastName.classList.contains('is-valid');
    var validDni = inputDni.classList.contains('is-valid');
​
    //habilito el botón solo si todos los campos son validos.
    if(validFirstName && validLastName && validDni){
        addButton.disabled = false;
    }
}
​
var addButton = document.getElementById('button-add');
addButton.onclick = addStudent;
​
function addStudent(){
  var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
​
  var inputDni = document.getElementById('input-dni');
  var inputFirstName = document.getElementById("input-firstName");
  var inputLastName = document.getElementById("input-lastName");
  
  var studentAlreadyExist = findStudentByDni(inputDni.value);
  
  //Evito guardar duplicados
  if(!studentAlreadyExist){
    var student = {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        dni: inputDni.value
    }
  
    var studentList;
    
    if (studentListString) {
        //Si el elemento ya existe en local storage, solo agrego con push
        studentList = JSON.parse(studentListString);
        studentList.push(student);      
    } else {
        //si es la primera vez, creo la lista y guardo
        studentList = [student];
    }
  
    localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(studentList));
    createStudentNode(student);
  }  
}
​
var deleteButton = document.getElementById('button-delete');
deleteButton.onclick = deleteStudent;
​
function deleteStudent(){
  var inputDniToDelete = document.getElementById('input-dni-to-delete');
  var valueToDelete = inputDniToDelete.value;
​
  var studentPosition = findStudentByDni(valueToDelete);
​
  if (studentPosition) {
      //Si encontre el estudiante, elmino el elemento en dicha posicion
      var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
      var studentList = JSON.parse(studentListString);
      studentList.splice(studentPosition.position, 1);  
      localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(studentList));    
      location.reload();
  }   
}
​
function findStudentByDni(_dni){
    var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
    
    if(studentListString != null){
        var studentList = JSON.parse(studentListString);
​
        for(var i = 0; i < studentList.length; i++){
            if (_dni == studentList[i].dni){
                return { 
                    student: studentList[i], 
                    position: i
                };
            }
        }
    } 
    //Si la lista no existe, o no encontré una coincidencia devuelvo null
    return null;
}
​
function createStudentNode(newStudent) {
    var studentsListDiv = document.getElementById('lista-alumnos');
​
    var studentItem = document.createElement("div");
    var fullName = document.createElement("p");
    var dni = document.createElement("p");
  
    fullName.innerHTML = "<b>Nombre:</b> " + newStudent.firstName + " " + newStudent.lastName;
    dni.innerHTML = "<b>DNI:</b> " + newStudent.dni;
  
    studentItem.classList.add("list-group-item");
    studentItem.appendChild(fullName);
    studentItem.appendChild(dni)
    
    studentsListDiv.appendChild(studentItem);
}
​
window.onload = function(){
    var studentListString = localStorage.getItem(STUDENT_LIST_KEY);
    var studentList = JSON.parse(studentListString);
​
    for (var i = 0; i < studentList.length; i++) {
        var student = studentList[i];
        createStudentNode(student);
    }
}*/

