// IMPORT SECTION
import Dragdrop from './scripts/dragdrop.js';
import ProjectMannager from './scripts/pm.js';
import Storage from './scripts/Storage.js';

// GLOBAL VARIABLES SECTION
    
    // MODULES & CLASS INSTANCE
    const storage = new Storage();
    const dgdp = new Dragdrop(updateTaskState);
    const pm = new ProjectMannager();
    //const dataTaskModal = new bootstrap.Modal('#data-task-modal');
    const newTaskModal = new bootstrap.Modal('#new-task-modal');
    //const quillEditor = new Quill('#edit-description-task-input', {theme: 'snow'});

    //DOM ELEMENTS
    const columnList = document.querySelectorAll('.column');
    const btnNewTask = document.getElementById('btnNewTask');
    const btnCreateNewTask = document.getElementById('createTaskBtn');

    //MODAL TASK DATA
    const saveChangesBtn = document.getElementById('save-task-changes-btn');
    const addCommentInput = document.getElementById('add-comment-input');
    const comentsController = document.getElementById('add-comment-controller');
    const btnAddComment = document.getElementById('add-comment-btn');
    const commentsContainer = document.querySelector('.modal-comments-container');
    const btnDeleteTask = document.getElementById('delete-task-btn');
    console.log(btnDeleteTask);
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

function openTaskModal(taskID){

    const modalInputs = [...document.querySelectorAll('[data-save-new]')];

    const commentsContainer = document.querySelector('.modal-comments-container');

    pm.currentTaskID = taskID;

    const taskData= pm.getTaskByID(taskID);

    modalInputs.forEach(input => input.value = taskData[input.name])

    //handle task comments
    if(taskData.comments.length > 0){

        let comments = '';
        taskData.comments.forEach(comment => {
            comments += `
                    <div class="comment-container flex-evenly">
                        <input name="comment" value="${comment}" class="comment" disabled/>
                        <i class="bi bi-trash3 btn-icon"></i>
                    </div>`;
        })
        commentsContainer.innerHTML = comments;
    }

    newTaskModal.show();
}

function openNewTaskModal(){

    newTaskModal.show();
}

function fetchAppData(){

    const taskData = [];
    taskData[0] = storage.getTasksData();
    taskData[1] = storage.getUsersData();
    
    return taskData
}

function saveTaskChanges(){

    const inputList = document.querySelectorAll('[data-save-changes]');

    const newTaskData = {}; 

    inputList.forEach(input => newTaskData[input.name] = input.value);

    console.log(newTaskData);

    // pm.editTask(newTaskData);
}

function updateTaskState(){
    console.log("funciona");
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

        console.log(newTaskObj);

        const card = pm.createTask(newTaskObj);

        dgdp.addDGDPListener(card);

        storage.addTask(newTaskObj);

        resetModal();
        
        newTaskModal.hide();

    }catch(error){
        console.log(error);
    }

}

function addComment(){
    if(addCommentInput.value){
        const commentHtml = `
                    <div class="comment-container flex-evenly">
                        <input name="comment" value="${addCommentInput.value}" class="comment" disabled/>
                        <i class="bi bi-trash3 btn-icon"></i>
                    </div>
                `
        commentsContainer.innerHTML += commentHtml;
        addCommentInput.value = '';
        comentsController.classList.toggle('invisible');
    }else{
        console.log("funciona")
    }
}

function resetModal(){

    //reset inputs in modal
    const modalInputs = [...document.querySelectorAll('[data-save-new]')];
    modalInputs.forEach(input => {
        if(input.tagName == 'SELECT') input.value = null
        else input.value = input.name
    })

    const commentInputs = [...document.querySelectorAll('[name = comment]')];
    commentInputs.forEach(input => input.parentNode.remove());

    addCommentInput.value = '';

}

function deleteTask(){

    try{
        const currentTaskID = pm.currentTaskID;
        //storage.deleteTask(currentTaskID);
        pm.deleteTask();
    }catch(error){
        console.log(error);
    }
}

// MAIN CODE

async function startApp(){

    try{

        const appData = await fetchAppData();
        
        const [taskList, userList] = appData;

        //create task-cards in the dom
        taskList.forEach(task => {
            pm.createTask(task);
        });

        dgdp.addDGDPListenerDOM();

        //fill ddm with users
        if(userList) addOptionsToddm('[data-user-ddm]', userList);

    }catch(error){
        console.log(error);
    }

}


// LISTENERS AND CONTROLLERS
window.addEventListener('load', startApp); // once the dom is fully downloaded run the app logic

//add click event to task cards
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

            openTaskModal(taskID);
        }
    })
})

//saveChangesBtn.addEventListener('click', saveTaskChanges);
addCommentInput.addEventListener('focus', ()=> comentsController.classList.remove('invisible'));
//addCommentInput.addEventListener('blur', ()=> setTimeout(()=> comentsController.classList.toggle('invisible'), 0));
btnNewTask.addEventListener('click', openNewTaskModal);
btnCreateNewTask.addEventListener('click', createNewTask);
btnAddComment.addEventListener('click', addComment);
btnDeleteTask.addEventListener('click', deleteTask);