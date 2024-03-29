// IMPORT SECTION
import DragFlik from './scripts/DragFlik.js';
import ProjectMannager from './scripts/pm.js';
import Storage from './scripts/storage.js';
import Task from './scripts/task.js';
import UI from './scripts/ui.js';

// GLOBAL VARIABLES SECTION
    
    // MODULES & CLASS INSTANCE
    const ui = UI();
    const storage = Storage();
    const df = new DragFlik();
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

function createNewTask(){

    const noValidInputs = [];
    let userMessage = '';
    let typeMessage = '';

    const modalInputs = [...document.querySelectorAll('[data-save-new]')];
    const commentInputs = [...document.querySelectorAll('[name = comment]')];

    try{

        const newTaskObj = {};
        newTaskObj.comments = [];
        
        modalInputs.forEach(input => {
            if(input.required && !input.value) noValidInputs.push(input);
            else newTaskObj[input.name] = input.value;
        });

        //if any required field is missing stop process and throws an error to end user
        if(noValidInputs.length > 0) throw new Error('Some fields are required');
        
        commentInputs.forEach(input => newTaskObj.comments.push(input.value));
        

        newTaskObj.id = pm.getAvailableID();

        const newTask = new Task(newTaskObj);

        pm.taskList.push(newTask);

        df.DFNewItem(newTask.card);

        storage.addTask(newTaskObj);

        
        newTaskModal.hide();
        ui.resetModal();
        ui.handleColumnCardsNumber();

        userMessage = 'Task successfully created';
        typeMessage = 'success';

    }catch(error){
        userMessage = error.message;
        typeMessage = 'error';
        noValidInputs.forEach(input => ui.setErrorOnField(input));
    }
    
    ui.displayMessage(userMessage, typeMessage);
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

function handleBlurEventOnInput(input){

    //if current task exist then has to be updated
    if(pm.currentTask){ 
        updateTaskByInput(input);
    }

    const inputHasValidValue = input.value != '';

    //if field's value is valid just remove it for ui
    if(inputHasValidValue) ui.removeErrorOnField(input);
    else ui.setErrorOnField(input);
}

// MAIN CODE

async function startApp(){

    try{

        //fetch all the app data at once
        const appData = await fetchAppData();
        
        const [taskList, userList] = appData;
        
        //set the state columsn as drop zones for DF library
        const TaskContainerList = document.querySelectorAll('.card-tasks-container');
        TaskContainerList.forEach(container => {

            const column = container.parentElement;
            const columnName = column.id.slice('column-'.length, column.id.length);

            const dropZoneObj = {
                name: columnName,
                zone: container
            };

            df.DFNewZone(dropZoneObj);
        });

        //create task-cards in the dom
        taskList.forEach(task => {
            const taskObj = new Task(task);
            const taskElementObj = {
                draggedElement: taskObj.card,
                draggedElementId: task.id
            }
            df.DFNewItem(taskElementObj);
            pm.taskList.push(taskObj);
        });

        //fill ddm with users
        if(userList) addOptionsToddm('[data-user-ddm]', userList);

        ui.handleColumnCardsNumber();

        console.log(pm.taskList);

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
    input.addEventListener('blur', (e)=> handleBlurEventOnInput(e.target));
})

btnNewTask.addEventListener('click', ()=> handleModal());
btnSaveTask.addEventListener('click', createNewTask);
btnAddComment.addEventListener('click', addComment);
btnDeleteTask.addEventListener('click', deleteTask);
addCommentInput.addEventListener('focus', ()=> ui.handleElementView(comentsController, true));
df.DFDropEvent((objData)=> {
    const columnName = objData.dropName;
    pm.currentTask = objData.draggedItemId;
    ui.handleColumnCardsNumber();
    pm.updateTaskByFieldName('state', columnName);
    const taskListToUpdate = pm.taskList;
    storage.updateTaskData(taskListToUpdate);
});
