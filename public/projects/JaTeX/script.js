let controls = [
    ['formula'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['blockquote'],
    ['clean'],
]

// Create editor
let quill = new Quill('main', {
    modules: {
        formula: true,
        toolbar: controls
    },
    theme: 'snow'
})

// Enable MathQuill
let enableMathQuillFormulaAuthoring = mathquill4quill()
enableMathQuillFormulaAuthoring(quill)

// Add keyboard shortcut
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key == '/') {
        document.querySelector('button.ql-formula').click()
    }
})

// Implement save button
let content = document.querySelector('.ql-editor')
let filename = document.querySelector('#name')
document.querySelector('#save').onclick = () => {
    console.log(content);
    html2pdf().from(content).save(filename.value)
}