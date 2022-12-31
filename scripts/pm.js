class ProjectMannager{

    static autoTaskIdNumber = 1;
    static autoUserIdNumber = 0;

    constructor(){
        this.taskList = [];
        this.userList = [];
        this.currentTaskID = null;
        //this.test = 'hola';
        //this.alert = sweetAlert2
    }

    // Task Methods

    createTask = (task)=> {
        /* 
            1. assign a valid autoTaskIdNumber
            2. add to taskList array
            3. create html task card
            4. insert into DOM
        */

        const card = document.createElement('div');
        card.setAttribute('card-id', task.id);
        card.setAttribute('class', 'card-task flex-center');
        card.setAttribute('draggable', true);
       
        const content = `
                <h6 class="card-title">${task.title}</h6>
                <div class="card-details-container flex-around">
                    <div class="flex-center" style="gap: .8rem;">
                        <img src="./assets/task-icons/${task.type}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${task.type}">
                        <img src="./assets/priority-icons/${task.priority}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${task.priority}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="cornflowerblue" class="bi bi-alarm-fill" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="4 days left">
                            <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                        </svg>
                        <div class="complexity-indicator flex-center" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${task.complexity}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <span class="user-image flex-center" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Assigned to: ${task.assigned}"></span>
                </div>`;

        card.innerHTML = content;

        //assing an unique id value and make sure it does not repeat
        task.id = ProjectMannager.autoTaskIdNumber;
        ProjectMannager.autoTaskIdNumber++;

        this.taskList.push(task);
    
        const container = document.getElementById(`card-tasks-container-${task.state}`); //identify in which column the task should be renderized

        container.appendChild(card);

        //Add to the new elemnts bootstrap tooltips
        const tooltipTriggerList = card.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    deleteTask = (id)=> {
        /* 
            1. search task by id
            2. remove from taskList array
            3. remove from DOM
        */
    }

    editTask = (props)=> {
        /* 
            1. search task by id
            2. update the fields
        */

        const taskToEdit = this.taskList.find(task => task.id == this.currentTaskID);

        //update task data dinamically
        for (const key in taskToEdit){
            if (props.hasOwnProperty(key)){
                taskToEdit[key] = props[key]; 
            }
        }
        
    }

    
    getTaskByID = (id)=> {
        /* 
            1. search task by id
            2. return the object
        */

            const searchedTask = this.taskList.find(task => task.id == id);
            return searchedTask;
    }

    // User Methods

    createUser  = (user)=> {
        /* 
            1. assign a valid autoUserIdNumber
            2. add to userList array
            3. create html user card
            4. insert into DOM
        */
    }

    deleteUser = (id)=> {
        /* 
            1. search user by id
            2. remove from userList array
            3. remove from DOM
        */
    }

    editUser = (id, props)=> {
        /* 
            1. search user by id
            2. update the fields
        */
    }


    // App Methods
    displayAlert = (message, type)=> {
        // success
        // error
        // warning
    }
}

export default ProjectMannager;