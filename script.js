const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}
let dropdown, burger, todoList = [],
  currentTodoList,
  archiveTodoList,
  itemCountSpan,
  uncheckedCountSpan,
  today = new Date(),
  headAdded = false

let init = () => {
  console.log('DOM is ready !')
  currentTodoList = document.getElementById('todo-list')
  archiveTodoList = document.getElementById('archive-list')
  itemCountSpan = document.getElementById('item-count')
  uncheckedCountSpan = document.getElementById('unchecked-count')
  removedCountSpan = document.getElementById('removed-count')

  // Handle dropdown
  burger = document.querySelector('.burger')
  dropdown = document.querySelector('.dropdown')
  burger.addEventListener('click', () => { showMenu() })

  today = today.toLocaleDateString("en-US")

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
  let date = new Date()

  let todo = {
    id: index,
    text: text,
    complete: false,
    removed: false,
    date: date.toLocaleDateString("en-US")
  }

  todoList.push(todo)

  storeData(todoList)

  reload()
  counter()
}

let showTodoList = () => {
  let current = todoList.filter(({ date }) => date === today)

  show(current, currentTodoList)

  let archive = todoList.filter(({ date }) => date != today)

  show(archive, archiveTodoList)
}

let show = (list, htmlContainer) => {
  let prevDate = today

  list.forEach(todo => {
    if (todo.date != prevDate) {
      prevDate = todo.date
      headAdded = true
    }

    let elem = createNode(todo, prevDate)
    elem = styleTodo(todo, elem)
    addNodeToList(elem, htmlContainer)
  });
}

let createNode = (todo, prevDate) => {
  let elem = document.createElement('li')
  elem.classList.add(classNames.TODO_ITEM)

  let template = 'Not todos available, add your today\'s todo list. Keep the good work'

  if (todo.date === today) {
    template = currentTodoContainer(todo)
  }

  if (todo.date != today) {
    template = archiveTodoContainer(todo, prevDate)
  }

  elem.innerHTML = template
  return elem
}

let currentTodoContainer = (todo) => {
  let checkBox = `<input type="checkbox"`
  checkBox += (todo.complete ? " checked " : "")
  checkBox += `onchange="complete(` + todo.id + `)" class="`
  checkBox += classNames.TODO_CHECKBOX + `" name="todo" id="` + todo.id + `">`

  let text = '<span>' + todo.text + '</span>'

  let removeButton = `<button class="` + classNames.TODO_DELETE + ` center" onClick="change(` + todo.id + `)">&#128465;</button>`

  let restoreButton = `<button class="` + classNames.TODO_DELETE + ` center" onClick="change(` + todo.id + `)">&#8635;</button>`

  let button = !todo.removed && !todo.complete ? removeButton : restoreButton

  let template = (!todo.removed ? checkBox : '')
    + text
    + (!todo.complete ? button : '')

  return template
}

let archiveTodoContainer = (todo, prevDate) => {
  let head = '<h3>' + prevDate + '</h3>'
  let text = '<span>' + todo.text + '</span>'
  let template = text
  try {

    if (todo.date === prevDate && headAdded) {
      archiveTodoList.innerHTML += head
      headAdded = false
    }
  } catch (error) {
    console.log('You\'re in todo mind page.')
  }

  return template
}

let addNodeToList = (elem, list) => { list?.appendChild(elem) }

let counter = () => {
  let todayTodoList = todoList.filter(({ date }) => date === today)
  let countTodos = todayTodoList.length,
    countUncomplete = 0,
    countRemoved = 0

  todayTodoList.forEach(todo => {
    if (!todo.complete && !todo.removed) {
      countUncomplete++
    }
    if (!todo.complete && todo.removed) {
      countRemoved++
    }
  });

  // Display counters
  try {
    itemCountSpan.innerHTML = countTodos
    uncheckedCountSpan.innerHTML = countUncomplete
    removedCountSpan.innerHTML = countRemoved
  } catch (error) {
    console.log('You\'re in archive page !')
  }

}

let reset = () => {

  let key = prompt('To reset all data type \'all\'. Reset current day\'s data type \'today\'.')

  if (key.toLowerCase() === 'all') {
    localStorage.removeItem('todoList')
  }
  
  if (key.toLowerCase() === 'today') {
    let list = todoList.filter(({ date }) => date != today)
    storeData(list)
  }

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

let change = (_id) => {
  let todo = todoList.filter(({ id }) => id === _id)[0]
  todo.removed = !todo.removed

  storeData(todoList)
  reload()
}

window.onload = init;