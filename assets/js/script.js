const table = document.getElementById('users');
const tBody = table.getElementsByTagName('tbody')[0];
const selectAllCheckbox = document.getElementById('select-all');
const deleteConfirm = document.getElementById('delete-confirm-modal');
const groupActions = document.getElementById('group-actions');
const groupActionsButton = document.getElementById('group-actions-button');
const saveButton = document.getElementById('save-button');
const userModal = $('#user-modal');
const warning = $('#warning-modal');

let idsToDelete = [];
let elementsToDelete = [];
let currentAction = null;
let elementToUpdate = null;
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
            url: '/delete_user.php',
            method: 'post',
            dataType: 'html',
            data: {ids: idsToDelete},
            success: function (data) {
                console.log(JSON.parse(data));
                elementsToDelete.forEach((elem) => {
                    elem.remove();
                });
            }
        });

    }
    $(this).modal('hide');
});
deleteConfirm.addEventListener('hidden.bs.modal', function () {
    idsToDelete = [];
    elementsToDelete = [];
});
userModal.on('hidden.bs.modal', function () {
    currentAction = null;
});
saveButton.addEventListener('click', function (event) {
    let form = userModal.find('form#user-form');
    let data = {
        'first_name': form.find('input#first-name').val(),
        'last_name': form.find('input#last-name').val(),
        'status': Number(form.find('input#status').prop('checked')),
        'role': form.find('select#role').val(),
    };
    switch (currentAction) {
        case 'store':
            $.ajax({
                url: '/store_user.php',
                method: 'post',
                dataType: 'html',
                data: data,
                success: function (data) {
                    data = JSON.parse(data)
                    console.log(data);
                    if (!data.error) {

                        let id = data.id;
                        let firstName = form.find('input#first-name').val();
                        let lastName = form.find('input#last-name').val();
                        let status = form.find('input#status').prop('checked');
                        let role = form.find('select#role').val();

                        let elem = `<tr  data-id="${id}"> <th scope="row">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

                        </th>
                        <td id="first-name">${firstName}</td>
                        <td id="last-name">${lastName}</td>
                        <td id="status">
                            <svg xmlns="http://www.w3.org/2000/svg" id="status" width="16" height="16" fill="${status === true ? 'green' : 'gray'}" class="bi bi-circle-fill"
                                 viewBox="0 0 16 16">
                                <circle cx="7" cy="7" r="7"/>
                            </svg>
                        </td>
                        <td id="role">${role}</td>
                        <td><img src="assets/images/edit.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                                 data-bs-target="#user-modal" data-action="edit" id="user-update" alt="edit">
                            <img src="assets/images/delete.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                                 data-bs-target="#delete-confirm-modal" data-action="delete" alt="delete">
                        </td>
                   </tr>`;
                        tBody.innerHTML += elem;
                    }
                    userModal.modal('hide');
                }
            });
            break;
        case 'update':
            data.id = elementToUpdate.dataset.id;

            $.ajax({
                url: '/update_user.php',
                method: 'post',
                dataType: 'html',
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.status) {
                        let user = data.user;
                        let elem = elementToUpdate;
                        elem.querySelector('#first-name').innerText = user.first_name;
                        elem.querySelector('#last-name').innerText = user.last_name;
                        elem.querySelector('#status').setAttribute('fill', user.status === 1 ? 'green' : 'gray');
                        elem.querySelector('#role').innerText = user.role;
                    }
                    userModal.modal('hide');
                }
            });
            break;
        default:
            break;
    }
});
warning.on('hidden.bs.modal', function () {
    let warningBody = $('#warning-modal #modal-body');
    warningBody.text("");
});
userModal.on('shown.bs.modal', function (event) {
    let action = event.relatedTarget.id;
    let form = userModal.find('form#user-form');
    form.find('input#first-name').val("");
    form.find('input#last-name').val("");
    form.find('input#status').prop('checked', true);
    form.find('select#role').val(0);

    const user = {};
    if (action === 'user-store') {

        currentAction = 'store';
    } else if (action === 'user-update') {
        let row = event.relatedTarget.closest('tr');
        let data = [];
        form.find('input#first-name').val(row.querySelector('#first-name').innerText);
        form.find('input#last-name').val(row.querySelector('#last-name').innerText);
        form.find('input#status').prop('checked', row.querySelector('#status[fill]').getAttribute('fill') === 'green');
        form.find('select#role').val(row.querySelector('#role').innerText);


        currentAction = 'update';
        elementToUpdate = event.relatedTarget.closest('tr');

    }
});
groupActionsButton.addEventListener('click', function (event) {
    if (tBody.querySelectorAll('input:checked').length <= 0) {
        let warningBody = $('#warning-modal #modal-body');
        warningBody.text("User not selected");
        warning.modal('show');
        return;
    }
    if (!Number.isInteger(+groupActions.value)) {
        let warningBody = $('#warning-modal #modal-body');
        warningBody.text("Action not selected");
        warning.modal('show');
        return;
    }
    let selectedUsers = tBody.querySelectorAll('input:checked');
    switch (+groupActions.value) {
        case 1:
            selectedUsers.forEach((item) => {
                let tr = item.closest('tr');
                let status = tr.querySelector('td svg#status');
                status.setAttribute('fill', 'green');
            });
            break;
        case 2:
            selectedUsers.forEach((item) => {
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
