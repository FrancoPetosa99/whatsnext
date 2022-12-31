function Dragdrop(callbackDrop){

    //global variables from module
    
    let draggedItem;
    let dragoverZone;

    const dropZones = [...document.querySelectorAll('[drop-zone = true]')];

    //aux functions
    function dragStart(){
        draggedItem = this;
        dragoverZone = [...draggedItem.parentNode.children].find(child => child.getAttribute('drop-zone') == 'true');
        setTimeout(()=>{
            draggedItem.style.opacity = 0;
            dropZones.forEach(zone => {
                if(dragoverZone != zone) zone.classList.add('drag-start');
            });
        }, 0) 
    }

    function dragEnd(){
        setTimeout(() => {
            draggedItem.style.opacity = 1;
            draggedItem = null;
            dragoverZone = null;
            dropZones.forEach(zone => {
                zone.classList.remove('drag-start');
            })
        }, 0);
    }

    function drop(){
        this.classList.remove('drag-over');
        if(this != dragoverZone) this.parentNode.appendChild(draggedItem);
        if(callbackDrop) callbackDrop();
    }

    function dragleave(){
        this.classList.remove('drag-over');
    }

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e)=> e.preventDefault());
        zone.addEventListener('dragenter', (e)=> {
            e.preventDefault();
            zone.classList.add('drag-over');
        })
        zone.addEventListener('dragleave', dragleave);
        zone.addEventListener('drop', drop);
    })

    //exported methods
    function addDGDPListener(newElement){

        //verify the new element has attribute draggable set in true
        if(!newElement.draggable) throw new Error('The passed in node does not have attribute draggable set in trur');

        newElement.addEventListener('dragstart', dragStart);
        newElement.addEventListener('dragend', dragEnd)
    }

    function addDGDPListenerDOM(){

        const taskList = [...document.querySelectorAll('[draggable = true]')];

        taskList.forEach(task => {
            task.addEventListener('dragstart', dragStart);
            task.addEventListener('dragend', dragEnd);
        })
    }
    
    return {
        addDGDPListener,
        addDGDPListenerDOM
    }
}

export default Dragdrop;