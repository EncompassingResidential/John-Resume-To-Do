let todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];

initalizeInputForm();

function initalizeInputForm() {

  document.getElementById('submit-button').addEventListener('click', (e) => {
    e.preventDefault();
    createToDo();
  })

  document.getElementById('delete-all-completed-tasks-button').addEventListener('click', (e) => {
    e.preventDefault();
    deleteAllCheckedTasks();
  })
}

function createToDo() {

  const todoText = document.getElementById('toDoItemText').value;
  if (todoText.length > 0) {
    const task = {
      todoText, 
      checked: false,
      id: todoItems.length > 0 ? todoItems[todoItems.length - 1].id + 1 : 1,
      date: getDateString()
    };

    addSingleToDo(task);
    document.getElementById('calculator-form').reset();
   }
}

function addSingleToDo(todo) {

  todoItems.push(todo);
  clearAndWriteOutItemTable(todo);
  writeToDoToLocalStorage(todoItems);
}

function clearLocalStorage() {
  localStorage.clear();
}

function writeToDoToLocalStorage(array) {
  localStorage.setItem('todoItems', JSON.stringify(array));
}

function createTableRow(id) {

  const tableRow = document.createElement('tr');
  tableRow.setAttribute('class', 'row');
  tableRow.id = id;
  return tableRow;
}

function createDeleteButton() {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.setAttribute('class', 'delete');
  return deleteButton;
}

function clearToDoTable() {

  const tableBody = document.getElementById('resumeToDoTable');
  removeAllChildNodes(tableBody);
}

function addRowToTable(row) {

  const table = document.getElementById('resumeToDoTable');
  table.appendChild(row);
}

function toggleTask(id) {

  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id === id) {
      todoItems[i].checked = !todoItems[i].checked;
      writeToDoToLocalStorage(todoItems);
    }
  }
}

function deleteAllCheckedTasks() {
  todoItems = todoItems.filter((todoItem) => {
    return todoItem.checked === false;
  });
  clearLocalStorage();
  writeToDoToLocalStorage(todoItems);
  clearAndWriteOutItemTable();
}

function deleteSingleCheckedTask(element, id) {

  element.parentElement.parentElement.remove();
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id === id && todoItems[i].checked === true) {
      todoItems.splice(i, 1);
    }
  }
  // Always write fresh Local Storage
  writeToDoToLocalStorage(todoItems);

  // 4/09/2022 ? Need to check why called here ?
  clearAndWriteOutItemTable();
}

function getDateString() {
  const daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];

  const today = new Date();
  const dayOfWeek = today.getDay();

  let date = ((today.getMonth() + 1).toString().padStart(1, '0')) +
            '-' + (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()) +
            '-' + today.getFullYear();
  
  return daylist[dayOfWeek] + " " + date;
}

function getTimeString() {
  let today = new Date();
  
  return today.getHours() + ":"  + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds();
}

function clearAndWriteOutItemTable() {
  clearToDoTable();
  for (let i = 0; i < todoItems.length; i++) {
    const row = createTableRow(todoItems[i].id);
    addRowToTable(row);
    const date = document.createElement('td');
    date.textContent = todoItems[i].date;
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');

    const toDoText = document.createElement('td');
    toDoText.textContent = todoItems[i].todoText;
    const deleteButtonCell = document.createElement('td');
    const deleteButton = createDeleteButton();
    deleteButtonCell.appendChild(deleteButton);

    row.appendChild(date);
    row.appendChild(checkBox);
    row.appendChild(toDoText);
    row.appendChild(deleteButtonCell);

    checkBox.addEventListener('click', () => {
      toggleTask(todoItems[i].id);
      if (todoItems[i].checked === true) {
        toDoText.style.textDecoration = 'line-through';
      }
      else {
        toDoText.style.textDecoration = 'none';
      }
    });

    deleteButton.addEventListener('click', (e) => {
      deleteSingleCheckedTask(deleteButton, todoItems[i].id);
    });
  }

}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}