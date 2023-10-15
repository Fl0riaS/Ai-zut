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
      newRow.insertCell().append(document.createTextNode(task.content))

      // Insert cell with date to row
      newRow.insertCell().append(document.createTextNode(task.date))

      // Insert delete button to row
      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = 'X'
      newRow.insertCell().append(deleteButton)

      // Assign task id to row
      newRow.setAttribute('id', `task-${task.id}`)

      // Attach delete handler
      deleteButton.addEventListener('click', handleDelete)
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
    // Edit task in list
    this.tasks = this.tasks.map(task => {
      if (task.id !== id) {
        return { ...task, ...taskData }
      }
      return task
    })

    // Edit task in local storage
    window.localStorage.setItem

    this.draw()
  }

  search(searchText) {
    this.filteredTasks = tasks.filter(task => task.content.includes(searchText))
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
  const taskId = nodeId.split('-')[1]

  taskList.removeTask(taskId)
}

// #endregion

// #region MAIN
const taskList = new TaskList()

// Attach event listeners
const taskForm = document.getElementById('add-task-form')
taskForm.addEventListener('submit', handleFormSubmit)
const searchTextField = document.getElementById('search-text-field')
searchTextField.addEventListener('input', handleSearch)

// #endregion
