function Dragdrop(dropCallback){

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

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragenter', dragEnter)
        zone.addEventListener('dragleave', dragleave);
        zone.addEventListener('drop', drop);
    })

    //exported methods
    function addDGDPListener(newElement){

        //verify the new element has attribute draggable set in true
        if(!newElement.draggable) throw new Error('The passed in node does not have attribute draggable set in true');

        newElement.addEventListener('dragstart', dragStart);
        newElement.addEventListener('dragend', dragEnd)
    }

    return {
        addDGDPListener
    }
}

export default Dragdrop;