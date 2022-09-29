const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}
let dropdown, burger, todoList = [],
  list,
  itemCountSpan,
  uncheckedCountSpan

let init = () => {
  console.log('DOM is ready !')
  list = document.getElementById('todo-list')
  itemCountSpan = document.getElementById('item-count')
  uncheckedCountSpan = document.getElementById('unchecked-count')
  removedCountSpan = document.getElementById('removed-count')

  // Handle dropdown
  burger = document.querySelector('.burger')
  dropdown = document.querySelector('.dropdown')
  burger.addEventListener('click', () => { showMenu() })

  // Get todo list from local memory
  todoList = JSON.parse(localStorage.getItem('todoList')) || []
  showTodoList()
  counter()
}

let newTodo = () => {
  let text = prompt('What\'s your next TODO ?')
  saveTodo(text)
}

let saveTodo = (text) => {
  let index = todoList.length
  let todo = {
    id: index,
    text: text,
    complete: false,
    removed: false,
  }

  todoList.push(todo)

  storeData(todoList)

  reload()
  counter()
}

let showTodoList = () => {
  todoList.forEach(todo => {
    let elem = createNode(todo)

    elem = styleTodo(todo, elem)

    addNodeToList(elem)
  });
}

let createNode = (todo) => {
  let elem = document.createElement('li')
  elem.classList.add(classNames.TODO_ITEM)

  let checkBox = `<input type="checkbox"`
  checkBox += (todo.complete ? " checked " : "")
  checkBox += `onchange="complete(` + todo.id + `)" class="`
  checkBox += classNames.TODO_CHECKBOX + `" name="todo" id="` + todo.id + `">`

  let text = todo.text
  let buttonRemove = !todo.removed && !todo.complete ? `<button class="` + classNames.TODO_DELETE + ` center" onClick="remove(` + todo.id + `)">&#128465;</button>` : ''

  let template = (!todo.removed ? checkBox : '')
    + text
    + (!todo.complete ? buttonRemove : '')
  elem.innerHTML = template

  return elem
}

let addNodeToList = (elem) => { list.appendChild(elem) }

let remove = (_id) => {
  let todo = todoList.filter(({ id }) => id === _id)[0]
  todo.removed = true

  storeData(todoList)
  reload()
}

let counter = () => {
  let countTodos = todoList.length,
    countUncomplete = 0,
    countRemoved = 0

  todoList.forEach(todo => {
    if (!todo.complete && !todo.removed) {
      countUncomplete++
    }
    if (!todo.complete && todo.removed) {
      countRemoved++
    }
  });

  itemCountSpan.innerHTML = countTodos
  uncheckedCountSpan.innerHTML = countUncomplete
  removedCountSpan.innerHTML = countRemoved
}

let resit = () => {
  localStorage.removeItem('todoList')
  reload()
}

let reload = () => { location.reload() }

let styleTodo = (todo, elem) => {

  if (todo.complete) {
    elem.classList.add('complete')
  }
  if (todo.removed) {
    elem.classList.add('removed')
  }
  return elem
}

let storeData = (data) => {
  localStorage.setItem('todoList', JSON.stringify(data))
}

let complete = (_id) => {
  let todo = todoList.filter(({ id }) => id === _id)[0]
  todo.complete = !todo.complete

  storeData(todoList)
  reload()
}

window.onload = init;