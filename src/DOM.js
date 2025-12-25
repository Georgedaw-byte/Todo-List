import {updateTodo, Projects, deleteTodo, createTodo, addTodoToProject, createProject, addProjectToProjects, deleteProject} from "./Logic.js"
import {format} from "date-fns";

let DOM_elements = {
    content: document.querySelector(".content"),
    dialog: document.querySelector(".add"),
    add_btn: document.querySelector(".add-button"),
    add_btn_in_dialog: document.querySelector(".add button.add-todo"),
    sidebar: document.querySelector(".sidebar"),
    project_name: document.querySelector(".sidebar span"),
    new_project_btn: document.querySelector(".sidebar .newproject"),
    new_project_dialog: document.querySelector(".sidebar dialog"),
    add_project_btn_in_dialog: document.querySelector(".addproject")
}


function addTodoToContent(todo) {
    let div = document.createElement("div")
    div.classList.add("todo")
    div.id = todo.id
    div.dataset.projectId = todo.project
    let inner_div = document.createElement("div")
    let radio_btn = document.createElement("input")
    radio_btn.type = "radio"
    inner_div.appendChild(radio_btn)
    let span = document.createElement("span")
    span.classList.add("checkmark")
    inner_div.appendChild(span)
    let h2 = document.createElement("h2")
    h2.textContent = todo.title
    inner_div.appendChild(h2)
    let Iscompleted_span = document.createElement("span")
    if (todo.completed) {
        Iscompleted_span.className = "completed"
        Iscompleted_span.textContent = "Completed"
        radio_btn.checked = true
    }
    else {
        Iscompleted_span.className = "not-completed"
        Iscompleted_span.textContent = "Not Completed"
        radio_btn.checked = false
    }
    inner_div.appendChild(Iscompleted_span)
    div.appendChild(inner_div)
    let priority = document.createElement("span")
    priority.classList.add("priority")
    priority.textContent = todo.priority
    div.appendChild(priority)
    let description = document.createElement("div")
    description.textContent = todo.description
    description.classList.add("dis")
    div.appendChild(description)
    let close_btn = document.createElement("button")
    close_btn.classList.add("close")
    close_btn.textContent = "×"
    div.appendChild(close_btn)
    let dialog = document.createElement("dialog")
    dialog.innerHTML = `
            <form method="dialog">
                <span>${Iscompleted_span.textContent}</span>
                <h2>${todo.title}</h2>
                <input type="text" name="title" value="${todo.title}">
                <label for="dis">Description</label>
                <textarea name="description" id="dis">${todo.description}</textarea>
                <span class="due-date">Date: ${format(todo.dueDate, "MM/dd/yyyy")}</span>
                <input type="date" value=${format(todo.dueDate, "yyyy-MM-dd")} name="dueDate">
                <label for="priority">Priority</label>
                <select name="priority" id="priority">
                    <option value="veryimportant">Very Important</option>
                    <option value="important">Important</option>
                    <option value="normal">Normal</option>
                    <option value="notimportant">Not Important</option>
                </select>
                <label for="notes">Notes</label>
                <textarea name="notes" id="notes" placeholder="Any notes 🫥">${todo.notes}</textarea>
                <button class="dialog-close">Close</button>
                <button class="edit">Edit</button>
            </form>
    `
    let select = dialog.querySelector("#priority")
    let label_select = dialog.querySelector("label[for='priority']")
    select.value = todo.priority
    if (todo.priority == "veryimportant"){
        label_select.style.color = "blue"
        priority.style.color = "blue"
    } 
    else if (todo.priority == "important") {
        label_select.style.color = "violet"
        priority.style.color = "violet"
    }
    else if (todo.priority == "normal") {
        label_select.style.color = "yellow"
        priority.style.color = "yellow"
    }
    else {
        label_select.style.color = "green"
        priority.style.color = "green"
    }
    div.appendChild(dialog)
    let edit_view_btn = document.createElement("button")
    edit_view_btn.classList.add("open-diolog")
    edit_view_btn.textContent = "Edit / View"
    div.appendChild(edit_view_btn)
    DOM_elements.content.appendChild(div)
}

function addProjectToSidebar(project) {
    let ul = document.querySelector("ul")
    let li = document.createElement("li")
    let btn = document.createElement("button")
    let close_btn = document.createElement("button")
    close_btn.dataset.id = project.id
    close_btn.classList.add("delete_project")
    btn.textContent = `${project.name}`
    btn.dataset.id = project.id
    li.appendChild(btn)
    li.appendChild(close_btn)
    ul.appendChild(li)
}

function listenToradioButtons() {
    const radio_btns = Array.from(document.querySelectorAll('input[type="radio"]'))
    radio_btns.forEach(radio_btn => {
        radio_btn.addEventListener("click", () => {
            let project_index = Projects.findIndex(project => project.id == radio_btn.closest(".todo").dataset.projectId)
            let todo_element = (Projects[project_index].content.filter(todo => todo.id == radio_btn.closest(".todo").id))[0]
            updateTodo(todo_element, "completed", !todo_element.completed)
            updateDom(Projects[project_index])
        })
    })
}



function listenToDeleteButton() {
    const delete_btns = Array.from(document.querySelectorAll(".close"))
    delete_btns.forEach(delete_btn => {
        delete_btn.addEventListener("click", () => {
            let project_index = Projects.findIndex(project => project.id == delete_btn.closest(".todo").dataset.projectId)
            let todo_element = (Projects[project_index].content.filter(todo => todo.id == delete_btn.closest(".todo").id))[0]
            deleteTodo(Projects[project_index], todo_element)
            updateDom(Projects[project_index])
        })
    })
}

function listenToViewAndEditButton() {
    const view_and_delete_btns = Array.from(document.querySelectorAll(".open-diolog"))
    view_and_delete_btns.forEach(view_and_delete_btn => {
        view_and_delete_btn.addEventListener("click", () => {
            let todo = view_and_delete_btn.closest(".todo")
            todo.querySelector("dialog").showModal()
        })
    })
}

function listenToEditButton() {
    const edit_btns = Array.from(document.querySelectorAll(".edit"))
    edit_btns.forEach(edit_btn => {
        edit_btn.addEventListener("click", (event) => {
          event.preventDefault()
          let dialog = edit_btn.closest("dialog")
          let project_index = Projects.findIndex(project => project.id == dialog.closest(".todo").dataset.projectId)
          let todo_element = (Projects[project_index].content.filter(todo => todo.id == dialog.closest(".todo").id))[0]
          let title = dialog.querySelector("input[name='title']").value
          let description = dialog.querySelector("textarea[name='description']").value
          let dueDate = dialog.querySelector("input[type='date']").value
          let priority = dialog.querySelector("select").value
          let notes = dialog.querySelector("textarea[name='notes']").value
          updateTodo(todo_element, "title", title)
          updateTodo(todo_element, "description", description)
          updateTodo(todo_element, "dueDate", dueDate)
          updateTodo(todo_element, "priority", priority)
          updateTodo(todo_element, "notes", notes)
          updateDom(Projects[project_index])
        })
    })
}

function listenToAddTodoButton() {
    DOM_elements.add_btn.addEventListener("click", () => {
        DOM_elements.dialog.showModal()
        DOM_elements.dialog.querySelector("input[type='date']").value = format((new Date()), "yyyy-MM-dd")
    })
}

const listenToAddTodoButtonInDialog = (function() {
    DOM_elements.add_btn_in_dialog.addEventListener("click", () => {
        let dialog = DOM_elements.dialog
        let title = dialog.querySelector("input[type='text']").value
        let description = dialog.querySelector("textarea[name='description']").value
        let dueDate = dialog.querySelector("input[type='date']").value
        let priority = dialog.querySelector("select").value
        let notes = dialog.querySelector("textarea[name='notes']").value
        let todo = createTodo(title, description, dueDate, priority, notes, false)
        let project = Projects.filter(project => project.id === DOM_elements.content.dataset.id)[0]
        addTodoToProject(project, todo)
        updateDom(project)

    })
})()

function listenToprojectsButtons() {
    let projects_btns = document.querySelectorAll("li button")
    projects_btns.forEach(projects_btn => {
        projects_btn.addEventListener("click", () => {
            let project = Projects.filter(project => project.id === projects_btn.dataset.id)[0]
            updateDom(project)
        })
    })
    let delete_btns = Array.from(document.querySelectorAll(".delete_project"))
    delete_btns.forEach(delete_btn => {
        delete_btn.addEventListener("click", () => {
            let project = Projects.findIndex(project => project.id === delete_btn.dataset.id)
            if (Projects.length !== 1) {
                deleteProject(Projects[project])
                if (Projects.length === 1) {
                    updateDom(Projects[0])
                }
                else {
                    updateDom(Projects[project-1])
                }
            }
        })
    })
}

const listenToNewProjectButton = (function () {
    DOM_elements.new_project_btn.addEventListener("click", () => {
        DOM_elements.new_project_dialog.showModal()
    })
})()

const listenToAddProjectButtonInDialog = (function listenToAddProjectButtonInDialog() {
    DOM_elements.add_project_btn_in_dialog.addEventListener("click", () => {
        let dialog = DOM_elements.new_project_dialog
        let project_name = dialog.querySelector("input").value
        let project = createProject(project_name)
        addProjectToProjects(project)
        updateDom(project)
    })
})()

function updateDom(project) {
    DOM_elements.content.innerHTML = ''
    DOM_elements.content.dataset.id = project.id
    project.content.forEach(todo => addTodoToContent(todo))
    let ul = DOM_elements.sidebar.querySelector("ul")
    ul.innerHTML = ''
    Projects.forEach(project => addProjectToSidebar(project))
    DOM_elements.project_name.textContent = `You are currently in ${project.name}`
    listenToradioButtons()
    listenToDeleteButton()
    listenToViewAndEditButton()
    listenToEditButton()
    listenToAddTodoButton()
    listenToprojectsButtons()
}

updateDom(Projects[0])