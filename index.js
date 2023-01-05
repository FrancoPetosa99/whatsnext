// IMPORT SECTION
import Dragdrop from './scripts/dragdrop.js';
import ProjectMannager from './scripts/pm.js';
import Storage from './scripts/storage.js';
import Task from './scripts/task.js';
import UI from './scripts/ui.js';

// GLOBAL VARIABLES SECTION
    
    // MODULES & CLASS INSTANCE
    const ui = UI();
    const storage = Storage();
    const dgdp = Dragdrop();
    const pm = new ProjectMannager();
    const newTaskModal = new bootstrap.Modal('#new-task-modal');
    //const quillEditor = new Quill('#edit-description-task-input', {theme: 'snow'});

    //DOM ELEMENTS
    const modalFooter = document.getElementById('modal-footer');
    const addCommentInput = document.getElementById('add-comment-input');
    const columnList = document.querySelectorAll('.column');
    const btnNewTask = document.getElementById('btnNewTask');
    const btnSaveTask = document.getElementById('save-task-btn');

    //MODAL TASK DATA
    const comentsController = document.getElementById('add-comment-controller');
    const btnAddComment = document.getElementById('add-comment-btn');
    const btnDeleteTask = document.getElementById('delete-task-btn');
    const modalInputs = [...document.querySelectorAll('[data-save-new]')];
    console.log(modalInputs);
    //const btnCancelComment = document.getElementById('cancel-comment-btn');
    
// GLOBAL FUNCTIONS DECLARATIONS

function addOptionsToddm(ddmIdentifier, userList){
    const ddmList = document.querySelectorAll(ddmIdentifier);
    ddmList.forEach(ddm => {
        userList.forEach(user => {
            ddm.innerHTML += `<option value="${user.id}">${user.name} ${user.lastName}</option>`;
        })
    })
}

function handleModal(taskID = null){

    ui.resetModal();

    ui.handleElementView(modalFooter, true); 
    ui.handleElementView(btnDeleteTask, false); 

    if(taskID){
        
        const modalInputs = [...document.querySelectorAll('[data-save-new]')];
    
        pm.currentTask = taskID;
    
        const taskData = pm.getTaskByID(taskID);
    
        modalInputs.forEach(input => input.value = taskData[input.name]);

        taskData.comments.forEach(comment => ui.appendComment(comment));

        ui.handleElementView(modalFooter, false);
        ui.handleElementView(btnDeleteTask, true); 

    }

    newTaskModal.show();
}

function fetchAppData(){

    return new Promise((resolve) => {
        setTimeout(()=>{
            const taskData = [];
            taskData[0] = storage.getTasksData();
            taskData[1] = storage.getUsersData();
            resolve(taskData);
        }, 1000);
    });
}

function handleValidation(){
    return true
}

function createNewTask(){

    try{

        const modalInputs = [...document.querySelectorAll('[data-save-new]')];
        const commentInputs = [...document.querySelectorAll('[name = comment]')];

        const newTaskObj = {};
        newTaskObj.comments = [];
        
        modalInputs.forEach(input => newTaskObj[input.name] = input.value);
        commentInputs.forEach(input => newTaskObj.comments.push(input.value));
        
        const isValid = handleValidation(newTaskObj);
        if(!isValid) throw new Error('Fields are missing');

        newTaskObj.id = pm.getAvailableID();

        const newTask = new Task(newTaskObj);

        pm.taskList.push(newTask);

        dgdp.addDGDPListener(newTask.card);

        storage.addTask(newTaskObj);

        ui.resetModal();
        ui.handleColumnCardsNumber();
        
        newTaskModal.hide();

    }catch(error){
        console.log(error);
    }

}

function addComment(){

    try{
        const comment = addCommentInput.value;
        //if(pm.runValidationOn(comment)) throw new Error('coments can not be empty');
        if(pm.currentTask) pm.addComment(comment);
        storage.updateTaskData(pm.taskList);
        ui.appendComment(comment);
        ui.resetInput(addCommentInput);
        ui.handleElementView(comentsController, false);

    }catch(error){
        console.log(error);
    }
}

function deleteTask(){

    try{

        const currentTask = pm.getCurrentTask();
        const currentTaskID = currentTask.id;
        storage.deleteTask(currentTaskID);
        pm.deleteTask(currentTaskID);
        ui.handleColumnCardsNumber();
        newTaskModal.hide();
        
    }catch(error){
        console.log(error);
    }
}

function updateTaskByInput(input){
    const task = pm.getCurrentTask();
    if(task){
        pm.updateTaskByFieldName(input.name, input.value);
        storage.updateTaskData(pm.taskList);
        if(input.name == 'title'){
            const element = task.card.querySelector('[card-data = title]');
            ui.modifyElementContent(element, input.value);
        }else {
            const tooltipObj = task.tooltips.find(tooltip => tooltip.name == input.name);
            tooltipObj.tooltip._config.title = input.value;
            const icon = task.card.querySelector(`[card-data = ${input.name}]`);
            console.log(icon);
            ui.handleCardIcon(icon, input.value);
        }
    }
}

// MAIN CODE

async function startApp(){

    try{

        const appData = await fetchAppData();
        
        const [taskList, userList] = appData;

        //create task-cards in the dom
        taskList.forEach(task => {
            const taskObj = new Task(task);
            dgdp.addDGDPListener(taskObj.card);
            pm.taskList.push(taskObj);
        })

        //fill ddm with users
        if(userList) addOptionsToddm('[data-user-ddm]', userList);

        ui.handleColumnCardsNumber();

        console.log(pm.taskList);
        console.log(pm.getAvailableID());

    }catch(error){
        console.log(error);
    }

}


// LISTENERS AND CONTROLLERS
window.addEventListener('load', startApp); // once the dom is fully downloaded run the app logic

//add event to display modal an show the clicked card data
columnList.forEach(column => {
    column.addEventListener('click', (e)=> {

        //make sure the event is not trigger by the column itself
        if(column != e.target){
            
            //get the html card
            let clickedElement = e.target;
    
            while(!clickedElement.hasAttribute('card-id')){
                clickedElement = clickedElement.parentNode;
            }

            const taskID = clickedElement.getAttributeNode('card-id').value;

            handleModal(taskID);
        }
    })
})

//add listener to update task data by blur event
modalInputs.forEach(input => {
    input.addEventListener('blur', (e)=> updateTaskByInput(e.target));
})

btnNewTask.addEventListener('click', ()=> handleModal());
btnSaveTask.addEventListener('click', createNewTask);
btnAddComment.addEventListener('click', addComment);
btnDeleteTask.addEventListener('click', deleteTask);
addCommentInput.addEventListener('focus', ()=> ui.handleElementView(comentsController, true));
