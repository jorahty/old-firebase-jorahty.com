// Created entirely by @jorahty

// Get elements from dom
let bottom = document.getElementById('bottom')
let vibe = document.getElementById('vibe')
let todo = document.getElementById('todo')
let add = document.querySelector('button')

// Load content from local storage
vibe.innerHTML = localStorage.vibe
todo.innerHTML = localStorage.todo
vibe.contentEditable = todo.contentEditable = true
vibe.spellcheck = todo.spellcheck = false
let courses = localStorage.courses ? JSON.parse(localStorage.courses) : {}
for (const c in courses) { createCourse(c, courses[c], 'none') }

// When window is first clicked,
// reveal hidden articles
window.onclick = () => {
    let hidden = document.querySelectorAll('article')
    for (let i = 0; i < hidden.length; i += 1) {
        hidden[i].style.display = 'block'
    }
    window.onclick = null
}

// Save to local storage
window.onbeforeunload = () => {
    localStorage.vibe = vibe.innerHTML
    localStorage.todo = todo.innerHTML
    let courses = {}
    for (let i = 0; i < bottom.children.length - 1; i += 1) {
        let title = bottom.children[i].querySelector('h1').textContent
        let content = bottom.children[i].querySelector('article').innerHTML
        courses[title] = content
    }
    localStorage.courses = JSON.stringify(courses)
}

// Make the "+" button functional
add.onclick = () => {
    let title = prompt()
    if (!title) { return }
    let content = ''
    createCourse(title, content, 'block')
}

// Create course
function createCourse(title, content, display) {
    let course = document.createElement('section')
    course.style.maxWidth = '300px'
    course.style.height = 'min-content'

    // Title
    let h1 = document.createElement('h1')
    h1.innerText = title
    h1.addEventListener('dblclick', () => {
        if (confirm(`Deleting "${title}" cannot be undone`)) {
            course.remove()
        }
    })
    course.appendChild(h1)

    // Content
    let article = document.createElement('article')
    article.innerHTML = content
    article.contentEditable = true
    article.spellcheck = false
    article.style.display = display
    course.appendChild(article)
    
    bottom.insertBefore(course, add)
}

// Init Routine
let iframe = document.querySelector('iframe')
iframe.width = 800
iframe.height = 600
iframe.style.border = 'none'
setsrc()

// Set iframe.src using localstorage.id
function setsrc() {
    let url = 'https://calendar.google.com/calendar/embed?&showTitle=0&showDate=0&showPrint=0&showTz=0&mode=WEEK&wkst=2'
    if (!localStorage.id) {
        iframe.src = url + '&src=' + 'ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com'
        return
    }
    iframe.src = url + '&src=' + localStorage.id
}

// Allow user to edit Calendar ID
let editID = document.getElementById('editID')
editID.addEventListener('dblclick', () => {
    let id = prompt('Enter your Google Calendar ID')
    if (!id || id == 'null') { return }
    localStorage.id = id
    setsrc()
})

// If the user is me,
// show my bookmarks
if (localStorage.user == 'jorah') {
    let links = document.getElementById('links')
    links.style.display = 'block'
}