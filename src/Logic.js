export let Projects = []
export let project1 = createProject("Project1")
export let project2 = createProject("Project2")

export let Todo1 = createTodo("study", "study for my finals", new Date(2020, 12-1, 11), "important", "nonotes", false)
export let Todo2 = createTodo("Sleep", "Sleep for my finals", new Date(2014, 12-1, 11), "veryimportant", "notes", true)
export let Todo3 = createTodo("make food", "make sushi", new Date(2014, 12-1, 11), "notimportant", "notes", false)
export let Todo4 = createTodo("go to uni", "take my finals", new Date(2014, 12-1, 11), "normal", "notes", true)

if (localStorage.getItem("Projects") === null) {
    Projects = []
    addProjectToProjects(project1)
    addProjectToProjects(project2)
}

// Problem is in this line
else {
    Projects = JSON.parse(localStorage.getItem("Projects"))
}
function updateProjectsInLocalStorage(Projects) {
    localStorage.setItem("Projects", JSON.stringify(Projects))
}
export function createTodo(title, description, dueDate, priority, notes, completed) {
    let id = crypto.randomUUID()
    return {title, description, dueDate, priority, notes, id, completed}
}

export function createProject(name) {
    let content = []
    let id = crypto.randomUUID()
    return {name, content, id}
}

export function addProjectToProjects(project) {
    Projects.push(project)
    updateProjectsInLocalStorage(Projects)
}

export function addTodoToProject(project, todo) {
    todo.project = project.id
    project.content.push(todo)
    updateProjectsInLocalStorage(Projects)
}

export function deleteTodo(project, todo_to_be_deleted) {
    let todo_to_delete = project.content.findIndex(todo => todo.id == todo_to_be_deleted.id)
    project.content.splice(todo_to_delete, 1)
    updateProjectsInLocalStorage(Projects)
}

export function deleteProject(project_to_be_deleted) {
    let project_to_delete = Projects.findIndex(project => project.id == project_to_be_deleted.id)
    project_to_be_deleted = []
    Projects.splice(project_to_delete, 1)
    updateProjectsInLocalStorage(Projects)
}

export function updateTodo(todo, property, value) {
    todo[property] = value
    updateProjectsInLocalStorage(Projects)
}


addTodoToProject(project1, Todo1)
addTodoToProject(project1, Todo2)
addTodoToProject(project2, Todo3)
addTodoToProject(project2, Todo4)
// localStorage.clear()

console.log(JSON.parse(localStorage.getItem("Projects")))
console.log(Projects)