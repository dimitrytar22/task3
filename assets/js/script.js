const table = document.getElementById('users');
const tBody = table.getElementsByTagName('tbody')[0];
const selectAllCheckbox = document.getElementById('select-all');
const deleteConfirm = document.getElementById('delete-confirm-modal');
const groupActions = document.getElementById('group-actions');
const groupActionsButton = document.getElementById('group-actions-button');
const warning = $('#warning-modal');

let idsToDelete = [];
let elementsToDelete = [];

selectAllCheckbox.addEventListener('change', function (event) {
    let checked = event.target.checked;
    let rows = table.getElementsByTagName('tbody')[0].children;
    if (checked) {
        for (let row of rows)
            row.querySelector('th input[type=checkbox]').checked = true
    } else {
        for (let row of rows)
            row.querySelector('th input[type=checkbox]').checked = false
    }

});

tBody.addEventListener('change', function (event) {
    let emptyCheckboxes = allCheckboxesSelected(tBody);
    if (emptyCheckboxes)
        selectAllCheckbox.checked = false;
    else
        selectAllCheckbox.checked = true;

});

tBody.addEventListener('mouseover', function (event) {
    let action = event.target.dataset.action;
    if (action === 'edit') {
        event.target.style.cursor = 'pointer'
    } else if (action === 'delete') {
        event.target.style.cursor = 'pointer'
    }
});
tBody.addEventListener('click', function (event) {
    let action = event.target.dataset.action;
    if (action === 'edit') {

    } else if (action === 'delete') {
        let elem = event.target.closest('tr');
        let id = elem.dataset.id;
        idsToDelete.push(id);
        elementsToDelete.push(elem);
    }
});
deleteConfirm.addEventListener('click', function (event) {
    if (event.target.dataset.action === 'confirm' && idsToDelete.length > 0) {
        $.ajax({
            url: '/handler.php',
            method: 'get',
            dataType: 'html',
            data: {ids: idsToDelete},
            success: function (data) {
                console.log(JSON.parse(data));
            }
        });
        elementsToDelete.forEach((elem) => {
            elem.remove();
        });

    }
    $(this).modal('hide');
});
deleteConfirm.addEventListener('hidden.bs.modal', function () {
    idsToDelete = [];
    elementsToDelete = [];
});
warning.on('hidden.bs.modal', function (){
    let warningBody = $('#warning-modal #modal-body');
    warningBody.text("");
});

groupActionsButton.addEventListener('click', function (event) {
    console.log()
    if (tBody.querySelectorAll('input:checked').length <= 0) {
        let warningBody = $('#warning-modal #modal-body');
        warningBody.text("User not selected");
        console.log(groupActions.value)
        warning.modal('show');
        return;
    }
    if (!Number.isInteger(+groupActions.value) ) {
        let warningBody = $('#warning-modal #modal-body');
        warningBody.text("Action not selected");
        warning.modal('show');
        return;
    }
    let selectedUsers = tBody.querySelectorAll('input:checked');
    switch (+groupActions.value) {
        case 1:
            selectedUsers.forEach((item)=> {
                let tr = item.closest('tr');
                let status = tr.querySelector('td svg#status');
                status.setAttribute('fill', 'green');
            });
            break;
        case 2:
            selectedUsers.forEach((item)=> {
                let tr = item.closest('tr');
                let status = tr.querySelector('td svg#status');
                status.setAttribute('fill', 'gray');
            });
            break;
        case 3:
            $('#delete-confirm-modal').modal('show');
            selectedUsers.forEach((item) => {
                let tr = item.closest('tr');
                idsToDelete.push(tr.dataset.id);
                elementsToDelete.push(tr);
            });
            break;
        default:
            console.log('unknown option')
            break;
    }
});

const allCheckboxesSelected = function (tBody) {
    let checkboxCount = tBody.querySelectorAll('input').length;
    let selectedCheckboxCount = tBody.querySelectorAll('input:checked').length;
    return checkboxCount !== selectedCheckboxCount;
}