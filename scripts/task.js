class Task{

    constructor(props){
        this.title = props.title;
        this.description = props.description;
        this.date = props.date;
        this.state = props.state;
        this.assigned =  props.assigned;
        this.comments = props.comments;
        this.priority = props.priority;
        this.complexity = props.complexity;
        this.type = props.type;
        this.id = props.id;
    }

}

export default Task;