//on page load render the dogs in the table
//each dog should be put in a table row
/*
<tr><td>Dog *Name*</td> <td>*Dog Breed*</td> <td>*Dog Sex*</td> <td><button>Edit</button></td></tr>
*/

//make a dog editable
  //clicking onthe edit button
  //should populate the top form with dogs current information
  //on a submit
    //should patch the current dog with updated information
    //the table should reflect the updated change

function renderDogs() {
  fetch('http://localhost:3000/dogs')
  .then(resp => resp.json())
  .then(dogs => dogs.forEach(registerDog))
  .catch(err => document.querySelector('#table-body').textContent(err.message));
}

function registerDog(dog) {
  
  const name = document.createElement('td');
  name.textContent = dog.name;
  
  const breed = document.createElement('td');
  breed.textContent = dog.breed;
  
  const sex = document.createElement('td');
  sex.textContent = dog.sex;

  const edit = document.createElement('button');
  edit.textContent = 'Edit Dog';
  edit.addEventListener('click', () => setValues(dog))
  
  const tr = document.createElement('tr');
  tr.append(name, breed, sex, edit)
  
  document.querySelector('#table-body').appendChild(tr);
}

function setValues(dog) {
  const form = document.querySelector('#dog-form');
  const inputs = form.querySelectorAll('[type="text"]');
  inputs.forEach(input => input.value = dog[input.name])
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.id = dog.id;
}

function editCurrentDog() {
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('[type="text"]')
  const submit = form.querySelector('[type="submit"]')
  const dogEdit = {};
  form.addEventListener('submit', e => {
    e.preventDefault();
    inputs.forEach(input => {
      dogEdit[input.name] = input.value;
    });
    dogEdit.id = Number(submit.id);
    updateDog(dogEdit);
    form.reset();
  })
}

function updateDog(dog) {
  fetch(`http://localhost:3000/dogs/${dog.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dog)
  })
  .then(updateTable);
}

function updateTable() {
  const tableRows = document.querySelector('#table-body').querySelectorAll('tr');
  tableRows.forEach(row => row.remove());
  renderDogs();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDogs()
  editCurrentDog();
})