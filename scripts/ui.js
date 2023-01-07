function UI(){

    const commentsContainer = document.querySelector('.modal-comments-container');

    function resetModal(){
        
        const addCommentInput = document.getElementById('add-comment-input');
        const modalInputs = [...document.querySelectorAll('[data-save-new]')];
        
        //reset inputs in modal
        modalInputs.forEach(input => {
            input.value = '';
            removeErrorOnField(input);
        });
    
        const commentInputs = [...document.querySelectorAll('[name = comment]')];
        commentInputs.forEach(input => input.parentNode.remove());
    
        addCommentInput.value = '';
    }

    function resetInput(input){
        input.value = '';
    }

    function appendComment(comment){

        const commentHtml = `
                    <div class="comment-container flex-evenly">
                        <input name="comment" value="${comment}" class="comment" disabled/>
                        <i class="bi bi-trash3 btn-icon"></i>
                    </div>`;
        commentsContainer.innerHTML += commentHtml;

    }

    function handleElementView(element, visibility){
        if(visibility) element.classList.remove('invisible');
        else element.classList.add('invisible');
    }

    function modifyElementContent(element, content){
        const tagElementName = element.tagName;
        
        if(tagElementName == 'INPUT' || tagElementName == 'SELECT') element.value = content;
        else if(element.textContent) element.innerText = content;
    }

    function handleCardIcon(icon, fileName){
        const path = "./assets/card-icons/";
        const fileExtension = ".svg";
        const src = path + fileName + fileExtension;
        icon.src = src;
    }

    function handleColumnCardsNumber(){
        const columnList = [...document.querySelectorAll('.column')];
        columnList.forEach(column => {
            const cards = [...column.querySelectorAll('.card-task')];
            const number = cards.length;
            const counter = column.querySelector('.column-tasks-number');
            if(number > 0){
                counter.innerText = number;
                handleElementView(counter, true);
            }else handleElementView(counter, false);
        })
    }

    function setErrorOnField(input){

        if(!input.classList.contains('error-field-input')){

            input.classList.add('error-field-input');

            const container = input.parentNode;
            const errorIcon = container.querySelector('span');
            const errorLabel = container.querySelector('label');

            //avoids errors in case an element is undefined
            if(errorIcon) errorIcon.classList.remove('invisible');
            if(errorLabel) errorLabel.classList.remove('invisible');
        }

    }

    function removeErrorOnField(input){

        input.classList.remove('error-field-input');

        const container = input.parentNode;
        const errorIcon = container.querySelector('span');
        const errorLabel = container.querySelector('label');
        
        //avoids errors in case an element is undefined
        if(errorIcon) errorIcon.classList.add('invisible');
        if(errorLabel) errorLabel.classList.add('invisible');
    }

    function displayMessage(message, type){
        Swal.fire({
            toast: true,
            text: message,
            position: 'bottom-end',
            icon: type ? type : 'info',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
    }

    return {
        resetModal,
        appendComment,
        appendComment,
        handleElementView,
        resetInput,
        modifyElementContent,
        handleCardIcon,
        handleColumnCardsNumber,
        setErrorOnField,
        removeErrorOnField,
        displayMessage,
    }

}

export default UI;