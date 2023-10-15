class TaskList {
  tasks = []
  searchText = ''

  constructor() {
    // Get tasks from local storage
    const localStorageTasks = { ...localStorage }
    for (const task of Object.values(localStorageTasks)) {
      // Add all tasks to list
      this.tasks.push(JSON.parse(task))
    }

    console.log(this.tasks)

    this.draw()
  }

  draw() {
    // TODO: generate content inside list
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
}

// Handlers
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

  // Add task to list
  taskList.addTask(content, date)

  console.log(taskList)
}

// Main code
const taskList = new TaskList()

// Attach event listener
const taskForm = document.getElementById('add-task-form')
taskForm.addEventListener('submit', handleFormSubmit)
