// --------------------------------------------- OPERATIONS ------------------------------------------------

const validateResponse = (result) => Number.isNaN(result) ? { status:false, result: "Invalid arithmetic. Returned NaN"} : {status: true, result};

const OPERATIONS = {
    '+' : (a, b) => validateResponse(a + b),
    '-' : (a, b) => validateResponse(a - b),
    '*' : (a, b) => validateResponse(a * b),
    '/' : (a, b) => {
        return (b === 0) ? {
            status: false,
            result: "Nice try! division by zero is undefined."
        } : validateResponse(a / b);
    },
    '%' : (a, b) => {
        return (b === 0) ? {
            status: false,
            result: "Modulo by zero? That's not a thing."
        } : validateResponse(a % b);
    }
};

// --------------------------------------------- STATE ------------------------------------------------

const state = {
    operand1: null,
    operand2: null,
    operator: null,
    display: null,
    error: false
}

// --------------------------------------------- DOM ------------------------------------------------

const buttonsContainer = document.querySelector("#buttons");
const display = document.querySelector("#display");
const expression = document.querySelector("#expression");

// --------------------------------------------- UPDATE ------------------------------------------------

const update = (event) => {
    
    if (state.error)  clear();
    
    const {number, operator, function: func} = event.target.dataset;
    
    if(number) handleNumber(number);
    else if(operator) handleOperator(operator);
    else if(func) handleFunction(func);
    
    render();
}

// --------------------------------------------- HANDLERS ------------------------------------------------

const handleNumber = (value) => {
    if (state.display === null) state.display = value === '.' ? '0.' : value;
    else if (state.display === '0' && value !== '.') state.display = value;
    else if (value === '.' && state.display.includes('.')) return;
    else  state.display += value;
};

const handleOperator = (op) => {
    if(!OPERATIONS[op]) return;
    
    if(state.operator && state.operand1 !== null){
        equate();
        if(state.error) return;
    }
    
    if(state.display !== null) state.operand1 = Number(state.display);
    state.operator = op;
    state.display = null;
};

const handleFunction = (func) =>{
    switch(func){
        case 'C':
            clear();
            return;
        case 'DEL':
            del();
            return;
        case '=':
            equate();
            return;
        case 'sign':
            toggleSign();
            return;
    }
};                



const handleKeyboard = (event) =>{

    if(state.error) clear();

    const key = event.key;
    if((key >= 0 && key <= 9) || key === '.') handleNumber(key);
    else if(key === 'Escape') clear();
    else if(key === 'Backspace') del();
    else if(key === '=' || key === 'Enter') equate();
    else if(event.altKey && (key === '-' || key === '+')) toggleSign();
    else handleOperator(key);

    render();
};
                
// --------------------------------------------- CORE ------------------------------------------------

const clear = () =>{
    state.operand1 = state.operand2 = state.operator = null;
    state.display = '0';
    state.error = false;
};

const del = () => {
    if(state.display === null || state.display.length <= 1) state.display = '0';
    else state.display = state.display.slice(0, -1);
}

const equate = () => {
    if(!state.operator || state.operand1 === null || state.display === null) return;
    
    state.operand2 = Number(state.display);
    
    const operation = OPERATIONS[state.operator];
    const response = operation(state.operand1, state.operand2);
    
    if(!response.status){
        setError(response.result);
        return;
    }
    
    state.display = response.result;
    state.operand1 = response.result;
    state.operand2 = state.operator = null;
};

const toggleSign = () =>  state.display = String(-Number(state.display));


const setError = (message) => {
    state.display = message;
    state.error = true;
}

// --------------------------------------------- CORE ------------------------------------------------

const render = () => {
    display.textContent = state.display ?? "0";
    expression.textContent = state.operator ? `${state.operand1} ${state.operator}` : '';
}

// --------------------------------------------- EXECUTE ------------------------------------------------

buttonsContainer.addEventListener('click', update);
window.addEventListener('keydown', handleKeyboard);