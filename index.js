// IMPORT SECTION
import Dragdrop from './scripts/dragdrop.js';
import ProjectMannager from './scripts/pm.js';

// GLOBAL VARIABLES SECTION
    
    // MODULES & CLASS INSTANCE
    const dgdp = new Dragdrop();
    const pm = new ProjectMannager();
    const dataTaskModal = new bootstrap.Modal('#data-task-modal');
    //const quillEditor = new Quill('#edit-description-task-input', {theme: 'snow'});

    //DOM ELEMENTS
    const columnList = document.querySelectorAll('.column');

    //MODAL TASK DATA
    const saveChangesBtn = document.getElementById('save-task-changes-btn');
    const addCommentInput = document.getElementById('add-comment-input');
    const controller = document.getElementById('add-comment-controller');

// GLOBAL FUNCTIONS DECLARATIONS

function addOptionsToddm(ddmIdentifier, userList){
    const ddmList = document.querySelectorAll(ddmIdentifier);
    ddmList.forEach(ddm => {
        userList.forEach(user => {
            ddm.innerHTML += `<option value="${user.id}">${user.name} ${user.lastName}</option>`;
        })
    })
}

function displayTaskModal(taskID){

    pm.currentTaskID = taskID;

    const taskData= pm.getTaskByID(taskID);

    const modalInputs = [...document.querySelectorAll('[data-save-changes]')];

    modalInputs.forEach(input => {
        console.log(taskData[input.name])
        input.value = taskData[input.name];
    })
    
    //handle task priority icon
    const priorityIcon = document.querySelector('[data-task-complexity-icon]');
    priorityIcon.src = `./assets/priority-icons/${taskData.priority}.svg`;

    //handle task comments
    if(taskData.comments.length > 0){

        const commentsContainer = document.querySelector('.modal-comments-container');
        let comments = '';
        taskData.comments.forEach(comment => {
            comments += `
                <div class="comment-container flex-evenly">
                    <span class="user-image flex-center"></span>
                    <input name="title" value="${comment.label}" class="edit-task-input fs-6" id="edit-title-task-input"/>
                </div>`;
        })
        commentsContainer.innerHTML = comments;
    }

    dataTaskModal.show();
}

function fetchAppData(){
    return Promise.all([
        fetch('./tasks.json')
            .then(res => res.json()),
        fetch('./users.json')
            .then(res => res.json())
    ])
    
    
}

function saveTaskChanges(){

    const inputList = document.querySelectorAll('[data-save-changes]');

    const newTaskData = {}; 

    inputList.forEach(input => newTaskData[input.name] = input.value);

    console.log(newTaskData);

    // pm.editTask(newTaskData);
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
        addOptionsToddm('[data-user-ddm]', userList);

    }catch(error){
        console.log(error);
    }

}


// LISTENERS AND CONTROLLERS
window.addEventListener('load', startApp); // once the dom is fully downloaded execute the app logic

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

            displayTaskModal(taskID);
        
        }
        
    })
})

saveChangesBtn.addEventListener('click', saveTaskChanges);
addCommentInput.addEventListener('focus', ()=> controller.classList.toggle('hide'));
addCommentInput.addEventListener('blur', ()=> controller.classList.toggle('hide'));