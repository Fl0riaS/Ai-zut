class TaskList {
  tableBody = undefined
  tasks = []
  filteredTasks = []

  constructor() {
    // Get tasks from local storage
    const localStorageTasks = { ...localStorage }
    for (const task of Object.values(localStorageTasks)) {
      // Add all tasks to list
      this.tasks.push(JSON.parse(task))
    }

    // Save reference to table
    this.tableBody = document
      .getElementById('todo-table')
      .getElementsByTagName('tbody')[0]

    this.draw()
  }

  draw() {
    // Clear previous table
    const initialLength = this.tableBody.rows.length
    for (let i = 0; i < initialLength - 1; i++) {
      this.tableBody.removeChild(this.tableBody.rows[1])
    }

    const isSearched = this.filteredTasks.length > 0

    // Generate content inside table
    for (const task of isSearched ? this.filteredTasks : this.tasks) {
      // Insert new row to table
      const newRow = this.tableBody.insertRow()

      // Insert cell with content to row
      const contentCell = newRow.insertCell()
      contentCell.classList.add('content-cell')
      contentCell.append(document.createTextNode(task.content))

      // Insert cell with date to row
      const dateCell = newRow.insertCell()
      dateCell.classList.add('date-cell')
      dateCell.append(document.createTextNode(task.date))

      // Insert delete button to row
      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = 'X'
      newRow.insertCell().append(deleteButton)

      // Assign task id to row
      newRow.setAttribute('id', `task-${task.id}`)

      // Attach delete handler
      deleteButton.addEventListener('click', handleDelete)

      // Attach edit handler
      contentCell.addEventListener('click', handleEditStart)
      dateCell.addEventListener('click', handleEditStart)
    }
  }

  addTask(content, date) {
    const taskId = Math.random().toString(16).slice(2)
    const newTask = { id: taskId, content, date }

    // Add task to list
    this.tasks.push(newTask)

    // Add task to local storage
    const newTaskStringified = JSON.stringify(newTask)
    window.localStorage.setItem(taskId, newTaskStringified)

    // Draw new content
    this.draw()
  }

  removeTask(id) {
    // Remove task from list
    this.tasks = this.tasks.filter(task => task.id !== id)

    // Remove task from local storage
    window.localStorage.removeItem(id)

    this.draw()
  }

  editTask(id, taskData) {
    // Find task in list
    const taskIndex = this.tasks.findIndex(task => task.id === id)

    // Edit task in list
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData }

    // Edit task in local storage
    window.localStorage.setItem(
      this.tasks[taskIndex].id,
      JSON.stringify(this.tasks[taskIndex])
    )

    this.draw()
  }

  search(searchText) {
    this.filteredTasks = tasks.filter(task => task.content.includes(searchText))
  }

  getTaskById(id) {
    return this.tasks.find(task => task.id === id)
  }
}

// #region HANDLERS
const handleFormSubmit = event => {
  event.preventDefault()

  // Get form elements
  const content = document.getElementById('add-task-form-content').value
  const date = document.getElementById('add-task-form-date').value

  // Validate inputs
  // Check if selected date is in future
  if (date && Date.now() > new Date(date).getTime()) {
    return alert('Date must be in future')
  }
  // Check if content has proper length
  if (content.length < 3) {
    return alert('Content is too short')
  }
  if (content.length > 255) {
    return alert('Content is too long')
  }

  // Reset inputs
  event.target.reset()

  // Add task to list
  taskList.addTask(content, date)
}

const handleSearch = event => {
  taskList.setSearchText(event.target.value)
}

const handleDelete = event => {
  const nodeId = event.target.parentNode.parentNode.id

  taskList.removeTask(cutTaskId(nodeId))
}

const handleEditSave = event => {
  // Check if something other than edit input is clicked
  if (!event.target.classList.contains('edit-task-input')) {
    const editInputReference =
      document.getElementsByClassName('edit-task-input')[0]

    if (!editInputReference) {
      return
    }

    // If cell is clicked, check if active input is not the same as clicked cell
    if (
      event.target.parentNode.id === editInputReference.parentNode.parentNode.id
    ) {
      return
    }

    // Get task id from table row
    const taskId = cutTaskId(editInputReference.parentNode.parentNode.id)

    // Validate and edit task
    if (editInputReference.type === 'text') {
      if (editInputReference.value.length < 3) {
        return alert('Content is too short')
      }
      if (editInputReference.value.length > 255) {
        return alert('Content is too long')
      }
      taskList.editTask(taskId, { content: editInputReference.value })
    } else {
      if (Date.now() > new Date(editInputReference.value).getTime()) {
        return alert('Date must be in future')
      }

      taskList.editTask(taskId, { date: editInputReference.value })
    }

  }
}

const handleEditStart = event => {
  // Check if input is not clicked again
  if (event.target.tagName !== 'INPUT') {
    // Check if any other input is not clicked
    const editInputsReference =
      document.getElementsByClassName('edit-task-input')
    if (editInputsReference.length > 0) {
      return
    }

    // Get task from task list
    const task = taskList.getTaskById(cutTaskId(event.target.parentNode.id))

    // Check if input type should be text or date
    const inputType = event.target.classList.contains('content-cell')
      ? 'text'
      : 'date'

    // Create input and set value to previous one
    const newInput = document.createElement('input')
    newInput.type = inputType
    newInput.value = task[inputType === 'text' ? 'content' : 'date']
    newInput.classList.add('edit-task-input')

    // Append input to dom
    event.target.removeChild(event.target.childNodes[0])
    event.target.append(newInput)
  }
}
// #endregion

// #region HELPERS
const cutTaskId = id => {
  return id.split('-')[1]
}
// #endregion

// #region MAIN
const taskList = new TaskList()

// Attach event listeners
const taskForm = document.getElementById('add-task-form')
taskForm.addEventListener('submit', handleFormSubmit)

const searchTextField = document.getElementById('search-text-field')
searchTextField.addEventListener('input', handleSearch)

document.addEventListener('click', handleEditSave)

// #endregion
