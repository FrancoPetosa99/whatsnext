class ProjectMannager{

    // static autoTaskIdNumber = 1;
    // static autoUserIdNumber = 0;

    constructor(){
        this.taskList = [];
        this.userList = [];
        this.currentTask = null;
        //this.test = 'hola';
        //this.alert = sweetAlert2
    }

    // Task Methods

    deleteTask = ()=> {
        /* 
            1. search task by id
            2. remove from taskList array
            3. remove from DOM
        */
        const taskToDelete = this.getTaskByID();
        taskToDelete.card.parentNode.remove();
        this.taskList = this.taskList.filter(task => task.id != this.currentTask);
        console.log(this.taskList);
    }

    editTask = (props)=> {
        /* 
            1. search task by id
            2. update the fields
        */    
    }

    
    getTaskByID = (id = null)=> {
        /* 
            1. search task by id
            2. return the object
        */

        let searchedTask;

        if(!id) searchedTask = this.taskList.find(task => task.id == this.currentTask);
        else searchedTask = this.taskList.find(task => task.id == id);

        return searchedTask;
    }

    getAvailableID = ()=> {

        let validIdNumber = 1;

        let isValid = false;

        while(!isValid){

            isValid = true;

            for (let i = 0; i < this.taskList.length; i++) {
                if(validIdNumber == this.taskList[i].id){
                    isValid = false;
                    validIdNumber++;
                    i = this.taskList.length;
                }
            }
        }

        return validIdNumber;
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