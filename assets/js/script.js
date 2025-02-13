const table = document.getElementById('users');
const tBody = table.getElementsByTagName('tbody')[0];
const selectAllCheckbox = document.getElementById('select-all');
const deleteConfirm = document.getElementById('delete-confirm-modal');

let idsToDelete = [];

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
        let id = event.target.closest('tr').dataset.id;
        idsToDelete.push(event.target.closest('tr').dataset.id);
        deleteConfirm.addEventListener('click', deleteItem);
    }
});
const deleteItem = function (event) {
    if (event.target.dataset.action === 'confirm') {
        $.ajax({
            url: '/handler.php',
            method: 'get',
            dataType: 'html',
            data: {ids: idsToDelete},
            success: function (data) {
                console.log(JSON.parse(data));
            }
        });

    }
    idsToDelete = [];
    deleteConfirm.removeEventListener('click', deleteItem);
    $(this).modal('hide');
}



const allCheckboxesSelected = function (tBody) {
    let checkboxCount = tBody.querySelectorAll('input').length;
    let selectedCheckboxCount = tBody.querySelectorAll('input:checked').length;
    return checkboxCount !== selectedCheckboxCount;
}