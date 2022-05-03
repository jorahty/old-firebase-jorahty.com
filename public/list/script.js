// Create List 'ADT'
let L = Array.from({length: 15}, () => Math.floor(-40 + Math.random() * 140));
let index = 2;

// List will be rendered to h1 & outputs
let h1 = document.querySelector('h1');
let outputs = document.querySelectorAll('output');
let footer = document.querySelector('footer');
render();

function render() {
    // Update h1
    let string = '';
    for (let i = 0; i < L.length; i++) {
        if (i == index) {
            string += '<i>';
            string += L[i].toString();
            string += '</i>';
            string += ' ';
            continue;
        }
        string += L[i].toString();
        string += ' ';
    }
    h1.innerHTML = (string != '') ? string : '&nbsp';

    // Update outputs
    outputs[0].textContent = L.length;
    outputs[1].textContent = index;
    outputs[2].textContent = (L.length > 0) ? L[0] : 'Error';
    outputs[3].textContent = (L.length > 0) ? L[L.length - 1] : 'Error';
    outputs[4].textContent = (index >= 0) ? L[index] : 'Error';

    // Clear error
    footer.textContent = ' ';
}

// Make buttons functional
let buttons = document.querySelectorAll('button');
let inputs = document.querySelectorAll('input');

// movePrev
buttons[0].onclick = () => {
    if (index == -1) {
        render();
        return;
    }
    index -= 1;
    render();
};

// moveNext
buttons[1].onclick = () => {
    if (index == -1) {
        render();
        return;
    }
    if (index == L.length - 1) {
        index = -1;
    } else {
        index += 1;
    }
    render();
};

// moveFront
buttons[2].onclick = () => {
    if (L.length > 0) {
        index = 0;
    }
    render();
};

// moveBack
buttons[3].onclick = () => {
    if (L.length > 0) {
        index = L.length - 1;
    }
    render();
};

// clear
buttons[4].onclick = () => {
    L = [];
    index = -1;
    render();
};

// set
buttons[5].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling set() on empty List";
        return;
    }
    if (index < 0) {
        footer.textContent = "Calling set() on List with undefined index";
        return;
    }
    L[index] = (inputs[0].value != '') ? inputs[0].value : 0;
    inputs[0].value = '';
    render();
};

// prepend
buttons[6].onclick = () => {
    L.unshift( (inputs[1].value != '') ? inputs[1].value : 0 );
    inputs[1].value = '';
    if (index > -1) {
        index += 1;
    }
    render();
};

// append
buttons[7].onclick = () => {
    L.push( (inputs[2].value != '') ? inputs[2].value : 0 );
    inputs[2].value = '';
    render();
};

// insertBefore
buttons[8].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling insertBefore() on empty List";
		return;
    }
    if (index < 0) {
        footer.textContent = "Calling insertBefore() on List with undefined index";
		return;
    }  
    data = (inputs[3].value != '') ? inputs[3].value : 0;
    L.splice(index, 0, data);
    inputs[3].value = '';
    index++;
    render();
};

// insertBefore
buttons[9].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling insertAfter() on empty List";
		return;
    }
    if (index < 0) {
        footer.textContent = "Calling insertAfter() on List with undefined index";
		return;
    }
    data = (inputs[4].value != '') ? inputs[4].value : 0;
    L.splice(index + 1, 0, data);
    inputs[4].value = '';
    render();
};

// deleteFront
buttons[10].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling deleteFront() on empty List";
		return;
    }
    if (L.length > 1 && index >= 0) {
        index -= 1;
    }
    L.shift();
    render();
};

// deleteBack
buttons[11].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling deleteBack() on empty List";
		return;
    }
    if (index == L.length - 1) {
        index = -1;
    }
    L.pop();
    render();
};

// delete
buttons[12].onclick = () => {
    if (L.length < 1) {
        footer.textContent = "Calling delete() on empty List";
		return;
    }
    if (index < 0) {
        footer.textContent = "Calling delete() on List with undefined index";
		return;
    } 
    L.splice(index, 1);
    index = -1;
    render();
};
