function DragFlik(){

    //local variables from module
    let draggedItem;
    let draggedItemId;
    let dragoverZone;
    let dropCallback;
    let dragCallback;

    const dropZones = [];
    const dragedItems = [];

    //event listener callback functions
    function dragStart(){
        draggedItem = this;
        draggedItemId = this.getAttribute('df-item-id');
        dragoverZone = [...draggedItem.parentNode.children].find(child => child.getAttribute('drop-zone') == 'true');
        setTimeout(()=>{
            draggedItem.style.opacity = 0;
            dropZones.forEach(zone => {
                if(dragoverZone != zone) zone.classList.add('drag-start');
            });
        }, 100);
        if(dragCallback) dragCallback();
    }

    function dragEnd(){
        setTimeout(() => {
            draggedItem.style.opacity = 1;
            draggedItem = null;
            dragoverZone = null;
            draggedItemId = null;
            dropZones.forEach(zone => {
                zone.classList.remove('drag-start');
            });
        }, 100);
    }

    function drop(e){
        e.preventDefault();
        this.classList.remove('drag-over');
        const isValidItem = dragedItems.includes(draggedItem);
        if(this != dragoverZone && isValidItem) this.parentNode.appendChild(draggedItem);
        if(dropCallback) {
            const objData = {};
            objData.dropper = e.target;
            objData.zone = e.target.parentNode;
            objData.dropName = e.target.getAttribute('drop-name');
            objData.draggedItem = draggedItem;
            objData.draggedItemId = draggedItemId;
            dropCallback(objData);
        };
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
    function DFNewItem(objElement){

        const {draggedElement, draggedElementId} = objElement;

        //verify the new element has attribute draggable set in true
        if(!draggedElement.draggable) throw new Error('The passed in node does not have attribute draggable set in true');

        draggedElement.addEventListener('dragstart', dragStart);
        draggedElement.addEventListener('dragend', dragEnd);

        draggedElement.setAttribute('df-item-id', draggedElementId);


        dragedItems.push(draggedElement);
    }

    function DFNewZone(objZone){

        const {zone, name} = objZone;

        //create task-dropper for the new drop zone
        const dropper = document.createElement('div');

        //set some meta atributtes on dropper tag element
        dropper.setAttribute('drop-zone', true);
        dropper.setAttribute('aria-label', 'dgdp-drop-zone');
        dropper.setAttribute('class', 'task-dropper');
        dropper.setAttribute('drop-name', name);

        zone.appendChild(dropper); //insert the task-dropper into the drop zone

        //add event listeners to the task-dropper
        dropper.addEventListener('dragover', dragOver);
        dropper.addEventListener('dragenter', dragEnter)
        dropper.addEventListener('dragleave', dragleave);
        dropper.addEventListener('drop', drop);

        //add drop zone to the array drop zones list
        dropZones.push(dropper);

    }

    function DFDropEvent(callback){
        dropCallback = callback;
    }

    function DFDragEvent(callback){
        dragCallback = callback;
    }

    return {
        DFNewItem,
        DFDropEvent,
        DFDragEvent,
        DFNewZone
    }
}

export default DragFlik;