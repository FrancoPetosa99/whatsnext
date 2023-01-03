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
        //this.date = props.date;
        //this.complexity = props.complexity;

        this.card = document.createElement('div');
        this.card.setAttribute('card-id', props.id);
        this.card.setAttribute('class', 'card-task flex-center');
        this.card.setAttribute('draggable', true);
        const content = `
                <h6 class="card-title">${props.title}</h6>
                <div class="card-details-container flex-around">
                    <div class="flex-center" style="gap: .8rem;">
                        <img src="./assets/task-icons/${props.type}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${props.type}">
                        <img src="./assets/priority-icons/${props.priority}.svg" alt="icon" width="18" height="18" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${props.priority}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="cornflowerblue" class="bi bi-alarm-fill" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="4 days left">
                            <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                        </svg>
                        <div class="complexity-indicator flex-center">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <span class="user-icon flex-center" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Assigned to: ${props.assigned}">fp</span>
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
        const tooltipTriggerList = this.card.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}

export default Task;