function DragFlik(){

    //local variables from module
    
    let draggedItem;
    let dragoverZone;
    let dropCallback;
    let dragCallback;

    const dropZones = [];

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

    function drop(e){
        e.preventDefault();
        this.classList.remove('drag-over');
        if(this != dragoverZone) this.parentNode.appendChild(draggedItem);
        if(dropCallback) dropCallback();
    }

    function dragleave(){
        this.classList.remove('drag-over');
    }

    function dragEnter(e){
        e.preventDefault();
        this.classList.add('drag-over');
    }

    function dragOver(e){
        e.preventDefault();
    }

    //exported methods
    function addDGDPListener(newElement){

        //verify the new element has attribute draggable set in true
        if(!newElement.draggable) throw new Error('The passed in node does not have attribute draggable set in true');

        newElement.addEventListener('dragstart', dragStart);
        newElement.addEventListener('dragend', dragEnd);
    }

    function addNewDZ(zone){

        //create task-dropper for the new drop zone
        const dropper = document.createElement('div');

        //set some meta atributtes on dropper tag element
        dropper.setAttribute('drop-zone', true);
        dropper.setAttribute('aria-label', 'dgdp-drop-zone');
        dropper.setAttribute('class', 'task-dropper');

        zone.appendChild(dropper); //insert the task-dropper into the drop zone

        //add event listeners to the task-dropper
        dropper.addEventListener('dragover', dragOver);
        dropper.addEventListener('dragenter', dragEnter)
        dropper.addEventListener('dragleave', dragleave);
        dropper.addEventListener('drop', drop);

        //add drop zone to the array drop zones list
        dropZones.push(dropper);

    }

    function dgdpDropEvent(callback){
        dropCallback = callback;
    }

    function dgdpDragEvent(callback){
        dragCallback = callback;
    }

    return {
        addDGDPListener,
        dgdpDropEvent,
        dgdpDragEvent,
        addNewDZ
    }
}

export default DragFlik;