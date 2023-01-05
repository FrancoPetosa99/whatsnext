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

    deleteTask = (id)=> {
        const taskToDelete = this.getTaskByID(id);
        taskToDelete.card.remove();
        this.taskList = this.taskList.filter(task => task.id != this.currentTask);
    }

    getTaskByID = (id)=> this.taskList.find(task => task.id == id);

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

    updateTaskByFieldName = (fieldName, newValue)=> {
        const taskToUpdate = this.getCurrentTask();
        taskToUpdate[fieldName] = newValue;
        console.log(this.getCurrentTask());
    }

    getCurrentTask = ()=> this.getTaskByID(this.currentTask);

    addComment = (comment)=> {
        const currentTask = this.getCurrentTask();
        currentTask.comments.push(comment);
    }
}

export default ProjectMannager;