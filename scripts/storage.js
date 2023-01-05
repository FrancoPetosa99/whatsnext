function Storage(){

    function getTasksData(){
        const taskList  = localStorage.getItem("tasks");
        if(!taskList) localStorage.setItem("tasks", JSON.stringify([]))
        else return JSON.parse(taskList);
    }

    function getUsersData(){
        const UserList  = localStorage.getItem("users");
        if(!UserList) localStorage.setItem("users", JSON.stringify([]))
        else return JSON.parse(UserList);
    }

    function addTask(newTask){
        const taskList  = JSON.parse(localStorage.getItem("tasks"));
        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    function updateTaskData(data){
        localStorage.setItem("tasks", JSON.stringify(data));
    }

    function deleteTask(id){
        const taskList = getTasksData();
        const newTaskList = taskList.filter(task => task.id != id);
        localStorage.setItem("tasks", JSON.stringify(newTaskList));
    }
    
    return {
        addTask,
        getTasksData,
        getUsersData,
        updateTaskData,
        deleteTask
    }
}

export default Storage;