class Task{

    static blockedColumn = document.getElementById(`card-tasks-container-blocked`);
    static doneColumn = document.getElementById(`card-tasks-container-done`);
    static progressColumn = document.getElementById(`card-tasks-container-progress`);
    static nextColumn = document.getElementById(`card-tasks-container-next`);

    constructor(props){

        this.title = props.title;
        this.description = props.description;
        this.state = props.state;
        this.assigned =  props.assigned;
        this.comments = props.comments;
        this.priority = props.priority;
        this.type = props.type;
        this.id = props.id ? props.id : Task.autoTaskIdNumber;
        this.tooltips = [];
        //this.date = props.date;
        //this.complexity = props.complexity;

        this.card = document.createElement('div');
        this.card.setAttribute('card-id', props.id);
        this.card.setAttribute('class', 'card-task flex-center');
        this.card.setAttribute('draggable', true);
        const content = `
                <h6 card-data="title" class="card-title">${props.title}</h6>
                <div class="card-details-container flex-around">
                    <div class="flex-center" style="gap: .8rem;">
                        <img card-data="type" src="./assets/card-icons/${props.type}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${props.type}">
                        <img card-data="priority" src="./assets/card-icons/${props.priority}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${props.priority}">
                    </div>
                    <span card-data="assigned" card-title class="user-icon flex-center" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Assigned to: ${props.assigned}">${props.assigned[0]}${props.assigned[props.assigned.length - 1]}</span>
                </div>`;

        this.card.innerHTML = content;
      
        switch (props.state) {
            case 'blocked':
                Task.blockedColumn.appendChild(this.card);
            break;
            case 'done':
                Task.doneColumn.appendChild(this.card);
            break;
            case 'progress':
                Task.progressColumn.appendChild(this.card);
            break;
            case 'next':
                Task.nextColumn.appendChild(this.card);
            break;
            default:
            throw new Error('Invalid state column name');
        }

        //Add to the new elemnts bootstrap tooltips
        const tooltipTriggerList = [...this.card.querySelectorAll('[data-bs-toggle="tooltip"]')];
        tooltipTriggerList.forEach(tooltipTriggerEl =>{
            const tooltipObj = {};
            tooltipObj.name =  tooltipTriggerEl.getAttribute('card-data');
            tooltipObj.tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
            this.tooltips.push(tooltipObj);
        });

        console.log(this);
    }
}

export default Task;