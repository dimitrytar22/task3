const table = document.getElementById('users');
console.log();
const tBody = table.getElementsByTagName('tbody')[0];
const selectAllCheckbox = document.getElementById('select-all');
const deleteConfirm = document.getElementById('delete-confirm-modal');
const userStoreButton = document.getElementById('user-store');
const groupActionsButtons = document.querySelectorAll('#group-actions-button');
const saveButton = document.getElementById('save-button');
const userModal = $('#user-modal');
const warning = $('#warning-modal');
const warningBody = $('#warning-modal #modal-body');
const modals = document.querySelectorAll('.modal, .fade');
const roles = {
    1: "Admin",
    2: "User"
};

let selectedIds = [];
let selectedElements = [];
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
    let emptyCheckboxes = !allCheckboxesSelected(tBody);
    if (emptyCheckboxes)
        selectAllCheckbox.checked = false;
    else
        selectAllCheckbox.checked = true;

});


tBody.addEventListener('click', function (event) {
    let action = event.target.dataset.action;
    if (!action)
        return;
    let tr = event.target.closest('tr');
    let user = {
        id: tr.dataset.id,
        first_name: tr.querySelector('#first-name').innerText
    }

    if (action === 'edit') {
        selectedElements.push(event.target.closest('tr'));
        userModal.find('#user-modal-title').html(`Update User <b>ID: </b>${user.id} <b>Name: </b>${user.first_name}`);


    } else if (action === 'delete') {
        let elem = event.target.closest('tr');
        let id = elem.dataset.id;
        selectedIds.push(id);
        selectedElements.push(elem);
    }
});
deleteConfirm.addEventListener('click', function (event) {
    let modal = $(this);

    if (event.target.dataset.action === 'confirm' && selectedIds.length > 0) {
        $.ajax({
            url: '/delete_user.php',
            method: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({user_ids: selectedIds}),
            success: function (data) {
                console.log(data);
                if (data.status) {
                    selectedElements.forEach((elem) => {
                        elem.remove();
                    });
                    updateCheckboxes(tBody);
                } else {
                    $("#delete-confirm-modal").modal('hide');
                    warningBody.text(data.error.message);
                    warning.modal("show");
                }

                modal.modal('hide');
            }
        });

    } else if (event.target.dataset.action === 'cancel')
        modal.modal('hide');

});
deleteConfirm.addEventListener('hidden.bs.modal', function () {
    selectedIds = [];
    selectedElements = [];


});

deleteConfirm.addEventListener('shown.bs.modal', function () {
    deleteConfirm.querySelector('#modal-body').innerHTML = "You want to delete users:<br>";
    selectedElements.forEach((item) => {
        let full_name = item.querySelector('#first-name').innerText.split(' ');
        let id = item.dataset.id;
        let first_name = full_name[0];
        let last_name = full_name[1];
        deleteConfirm.querySelector('#modal-body').innerHTML += `<b>ID:</b> ${id} <b>${first_name} ${last_name}</b><br>`;
    });
});
userModal.on('hidden.bs.modal', function () {
    currentAction = null;
    elementToUpdate = null;
    selectedElements = [];
});
userStoreButton.addEventListener('click', function () {
    userModal.find('#user-modal-title').text("Create User");

});
const showFormErrors = function (fields) {
    fields.forEach(function (item) {
        if ((!item.value && item.id !== 'status') || (item.tagName === "SELECT" && item.value === '0')) {
            let invalidInput = item.parentElement.querySelector('#error-message');
            invalidInput.innerText = 'Field is required';
            item.parentElement.querySelector('#error-message').style.display = 'block';
        }
    });
}

const hideFormErrors = function (errors) {
    errors.forEach(function (item) {
        item.style.display = 'none';
    });
}
saveButton.addEventListener('click', function (event) {
    hideFormErrors(document.querySelector('form#user-form').querySelectorAll('#error-message'));
    let form = userModal.find('form#user-form');
    let formGeneralError =   $("#error-message.general");
    let firstNameInput = form.find('input#first-name');
    let lastNameInput = form.find('input#last-name');
    let statusInput = form.find('input#status');
    let roleSelect = form.find('select#role');

    if (!firstNameInput.length || !lastNameInput.length || !statusInput.length || !roleSelect.length) {
        formGeneralError.css("display", 'block');
        formGeneralError.text("Invalid form");
        return;
    }

    let user = {
        'first_name': firstNameInput.val(),
        'last_name': lastNameInput.val(),
        'status': statusInput.prop('checked'),
        'role': Number(Object.keys(roles).find((key) => {
            return roles[key] === roleSelect.val();
        })),
    };
    let emptyFields = false;
    let fields = document.querySelector('form#user-form').querySelectorAll('input, select');
    for (const [key, value] of Object.entries(user)) {
        if ((!Boolean(value) || value === '0') && key !== 'status') {
            emptyFields = true;
        }
    }


    if (emptyFields) {
        showFormErrors(fields);

        return;
    }
    switch (currentAction) {
        case 'store':
            $.ajax({
                url: '/store_user.php',
                method: 'post',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({user}),
                success: function (data) {
                    console.log(data);
                    if (data.status) {
                        let userData = {
                            id: data.id,
                            first_name: form.find('input#first-name').val(),
                            last_name: form.find('input#last-name').val(),
                            status: form.find('input#status').prop('checked'),
                            role: form.find('select#role').val()
                        }

                        addUser(userData, table);
                        updateUser(tBody.lastElementChild, userData);
                        if (selectAllCheckbox.checked) {
                            selectAllCheckboxes(tBody);
                        }
                    } else {
                        formGeneralError.css("display", 'block');
                        formGeneralError.text(data.error.message);

                    }

                    userModal.modal('hide');
                }
            });
            break;
        case 'update':
            user.id = elementToUpdate.dataset.id;
            $.ajax({
                url: '/update_user.php',
                method: 'post',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(user),
                success: function (data) {
                    console.log(data);
                    if (data.status) {
                        user.role = roles[user.role];

                        updateUser(elementToUpdate, user);
                        userModal.modal('hide');
                        selectedElements = [];

                    } else {
                        formGeneralError.css("display", 'block');
                        formGeneralError.text(data.error.message);

                    }
                }
            });
            break;
        default:
            break;
    }
});

warning.on('hidden.bs.modal', function () {
    warningBody.text("");
});

Array.from(modals).forEach((modal) => {
    modal.addEventListener('show.bs.modal', function () {
        modal.removeAttribute("inert");
    });
    modal.addEventListener('hide.bs.modal', function () {
        modal.setAttribute("inert", "");
    });
});


userModal.on('shown.bs.modal', function (event) {
    hideFormErrors(document.querySelector('form#user-form').querySelectorAll('#error-message'));
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
        let full_name = row.querySelector('#first-name').innerText.split(' ');
        let first_name = full_name[0];
        let last_name = full_name[1];
        form.find('input#first-name').val(first_name);
        form.find('input#last-name').val(last_name);
        form.find('input#status').prop('checked', row.querySelector('#status[fill]').getAttribute('fill') === 'green');
        form.find('select#role').val(row.querySelector('#role').innerText);


        currentAction = 'update';
        elementToUpdate = event.relatedTarget.closest('tr');

    }
});
groupActionsButtons.forEach(function (button) {

    let groupActions = button.parentNode.querySelector("#group-actions");
    button.addEventListener('click', function (event) {
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
        selectedElements = [];

        tBody.querySelectorAll('input:checked').forEach(function (item) {
            selectedElements.push(item.closest('tr'));
        });

        let users = [];
        switch (+groupActions.value) {
            case 1:
                selectedElements.forEach((item) => {

                    let id = item.dataset.id;


                    let status = item.querySelector('td svg#status');


                    let user = {
                        id,
                        status: true,
                    };
                    users.push(user);

                });
                $.ajax({
                    url: '/update_user_status.php',
                    method: 'post',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({users}),
                    success: function (data) {
                        console.log(data)
                        if (data.status) {
                            selectedElements.forEach(function (user) {
                                user.querySelector('#status').setAttribute('fill', 'green');

                            });
                        } else {
                            warningBody.text(data.error.message);
                            warning.modal("show");
                        }

                        userModal.modal('hide');
                    }, complete: function () {

                        selectedElements = [];
                    }

                });


                break;
            case 2:
                selectedElements.forEach((item) => {

                    let id = item.dataset.id;


                    let status = item.querySelector('td svg#status');

                    let user = {
                        id,
                        status: false,
                    };
                    users.push(user);

                });
                $.ajax({
                    url: '/update_user_status.php',
                    method: 'post',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({users}),
                    success: function (data) {
                        console.log(data)
                        if (data.status) {
                            selectedElements.forEach(function (user) {
                                user.querySelector('#status').setAttribute('fill', 'gray');

                            });

                        } else {
                            warningBody.text(data.error.message);
                            warning.modal("show");
                        }


                        userModal.modal('hide');
                    }, complete: function () {

                        selectedElements = [];
                    }
                });
                break;
            case 3:
                $('#delete-confirm-modal').modal('show');

                break;
            default:
                console.log('unknown option')
                break;
        }
    });

});
const updateCheckboxes = function (tBody){
    if(allCheckboxesSelected(tBody))
        selectAllCheckbox.checked = true;
    else
        selectAllCheckbox.checked = false;
}
const allCheckboxesSelected = function (tBody) {
    let checkboxCount = tBody.querySelectorAll('input[type=checkbox]').length;
    let selectedCheckboxCount = tBody.querySelectorAll('input[type=checkbox]:checked').length;
    return checkboxCount === selectedCheckboxCount;
}
const selectAllCheckboxes = function (tBody) {
    let checkboxes = tBody.querySelectorAll('input')
    checkboxes.forEach(function (item) {
        item.setAttribute('checked', 'checked');
    });

}

const updateUser = function (element, user) {

    element.querySelector('#first-name').innerText = user.first_name + " " + user.last_name;
    element.querySelector('#status').setAttribute('fill', Boolean(user.status) === true ? 'green' : 'gray');
    element.querySelector('#role').innerText = user.role;


}
const addUser = function (data, table) {
    let tBody = table.querySelector('tbody');

    let elem = document.createElement('tr');
    elem.setAttribute('data-id', data['id']);
    elem.innerHTML = `
        <th scope="row">
            <input class="form-check-input" type="checkbox">
        </th>
        <td id="first-name">${data['first_name']} ${data['last_name']}</td>
        <td>
            <svg xmlns="http://www.w3.org/2000/svg"  id="status" width="16" height="16" fill="${data['status'] ? 'green' : 'gray'}" class="bi bi-circle-fill">
                <circle cx="7" cy="7" r="7"/>
            </svg>
        </td>
        <td id="role">${data['role']}</td>
        <td>
            <i class="fas fa-edit" data-bs-toggle="modal"
                       data-bs-target="#user-modal" data-action="edit" id="user-update" style="font-size:24px"></i>

                    <i class="fa-solid fa-trash " data-bs-toggle="modal"
                       data-bs-target="#delete-confirm-modal" data-action="delete" id="user-delete" style="font-size:24px"></i>
        </td>
    `;

    tBody.appendChild(elem);
};

