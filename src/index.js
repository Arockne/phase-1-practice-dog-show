function renderDogs() {
  fetch('http://localhost:3000/dogs')
  .then(resp => resp.json())
  .then(registerDogs)
}

function registerDogs(dogs) {
  dogs.forEach(createDog);
}

function createDog(dog) {
  const name = document.createElement('td');
  name.textContent = dog.name;

  const breed = document.createElement('td');
  breed.textContent = dog.breed;

  const sex = document.createElement('td');
  sex.textContent = dog.sex;

  const btn = document.createElement('button');
  btn.textContent = 'Edit Dog';
  btn.addEventListener('click', () => dogToEdit(dog));

  const tr = document.createElement('tr');
  tr.append(name, breed, sex, btn);
  
  document.querySelector('#table-body').appendChild(tr);
}

function dogToEdit(dog) {
  const form = document.querySelector('#dog-form');
  const inputs = form.querySelectorAll('[type="text"]');
  inputs.forEach(input => input.value = dog[input.name]);
  form.setAttribute('dogId', dog.id);
}

function updateDog(e) {
  e.preventDefault();
  const dog = {};
  const inputs = this.querySelectorAll('[type="text"]');
  
  inputs.forEach(input => dog[input.name] = input.value);
  dog.id = Number(this.getAttribute('dogId'));
  
  updateDogInfo(dog);
  this.removeAttribute('dogId');
  this.reset();
}

function updateDogInfo(dog) {
  if (!dog.id) return;
  fetch(`http://localhost:3000/dogs/${dog.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dog)
  })
  .then(resp => {
    if (resp.ok) updateTable();
  });
}

function updateTable() {
  const tableBody = document.querySelector('#table-body');
  const currentDogs = tableBody.querySelectorAll('tr');
  currentDogs.forEach(dog => dog.remove());
  renderDogs();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDogs();
  const form = document.querySelector('#dog-form');
  form.addEventListener('submit', updateDog)
})