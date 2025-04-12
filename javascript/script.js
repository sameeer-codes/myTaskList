const taskListForm = document.getElementById('taskListForm')
const addTaskBtn = document.getElementById('addTaskBtn')
const addTaskInput = document.getElementById('addTaskInput')
const tasksList = document.getElementById('tasksList')


class taskObj {
    constructor(task_name) {
        this.id = Date.now();
        this.task_name = task_name;
        this.isCompleted = false;
    };

    edit_task(newTask) {
        this.task_name = newTask;
    }

    edit_state() {
        this.isCompleted = !this.isCompleted;
    }
}


const savetasks = (tasksarr) => {
    localStorage.setItem('tasks', JSON.stringify(tasksarr));
}

const gettasks = () => {
    if (localStorage.getItem('tasks') == null) return []
    else {
        let tasksarr = JSON.parse(localStorage.getItem('tasks'))
        return tasksarr.map(task => {
            let newtask = new taskObj(task.task_name);
            newtask.id = task.id;
            newtask.isCompleted = task.isCompleted;
            return newtask;
        })
    }
}

let tasks = gettasks();

const addTask = (e) => {
    e.preventDefault();
    let task = new taskObj(addTaskInput.value);
    addTaskInput.value = ''
    tasks.push(task)
    savetasks(tasks)
    displayTasks(tasks)
}

const displayTasks = (arr) => {
    if (tasks.length == 0) {
        tasksList.innerHTML = '<h2>No Tasks Added yet</h2>';
    } else if (tasks.length > 0) {
        tasksList.innerHTML = '';
        arr.forEach(element => {
            let taskItem = document.createElement('li')
            taskItem.setAttribute('id', element.id)
            taskItem.innerHTML = `
        <span class="taskContent">${element.task_name}</span>
                    <span class="taskMethods">
                        <input type="checkbox" class="completedCheckBox">
                        <button class="editTaskbtn">
                            <i class="ri-edit-box-line"></i>
                        </button>
                        <button class="deleteTaskbtn">
                            <i class="ri-close-circle-line"></i>
                        </button>
                    </span>`;
            let editTaskbtn = taskItem.querySelector('.editTaskbtn')
            let taskContent = taskItem.querySelector('.taskContent')
            editTaskbtn.addEventListener('click', editTask)
            let checkbox = taskItem.querySelector('.completedCheckBox')
            if (element.isCompleted) {
                checkbox.checked = true
                taskContent.style.textDecoration = 'line-through'
                taskContent.style.color = 'green'
            };
            checkbox.addEventListener('click', markComplete)
            let deleteTaskbtn = taskItem.querySelector('.deleteTaskbtn')
            deleteTaskbtn.addEventListener('click', deleteTask)
            tasksList.prepend(taskItem)
        });
    }
}

function editTask(e) {
    let id = this.parentElement.parentElement.getAttribute('id')
    let task = tasks.find(task => task.id == id);
    if (task) {
        let newTask = prompt('Enter New Task', task.task_name);
        if (newTask !== null && newTask.trim() !== '') {
            task.edit_task(newTask);
            savetasks(tasks);
            displayTasks(tasks);
        }
    }
}

function markComplete() {
    let id = this.parentElement.parentElement.getAttribute('id')
    let task = tasks.find(task => task.id == id);
    if (task) {
        task.edit_state()
        savetasks(tasks)
        displayTasks(tasks)
    }
}

function deleteTask() {
    let id = this.parentElement.parentElement.getAttribute('id')
    let index = tasks.indexOf(tasks.find(task => task.id == id), 0)
    if (index !== -1 && index >= 0) {
        tasks.splice(index, 1)
        savetasks(tasks)
        displayTasks(tasks)
    }
}

displayTasks(tasks)

taskListForm.addEventListener('submit', addTask)