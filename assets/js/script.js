const table = document.getElementById('users');
const tBody = table.getElementsByTagName('tbody')[0];
const selectAllCheckbox = document.getElementById('select-all');
const userStoreButton = document.querySelectorAll('.user-store');
const groupActionsButtons = document.querySelectorAll('.group-actions-button');
const saveButton = document.getElementById('save-button');
const userForm = document.querySelector('#user-modal');
const userModal = new bootstrap.Modal(userForm, {});
const deleteConfirm = document.getElementById('delete-confirm-modal');
const deleteConfirmModal = new bootstrap.Modal(deleteConfirm);
const warning = document.querySelector('#warning-modal');
const warningModal = new bootstrap.Modal(warning, {});
const warningBody = document.querySelector('#warning-modal #modal-body');

const modals = document.querySelectorAll('.modal, .fade');


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
    let action = event.target.id;

    if (!action)
        return;
    let tr = event.target.closest('tr');
    let user = {
        id: tr.dataset.id,
        first_name: tr.dataset.firstName,
        last_name: tr.dataset.lastName
    }

    if(!tr.dataset.firstName || !tr.dataset.lastName || !tr.dataset.id){
        warningBody.innerText = "Invalid user table";
        warningModal.show();
        return;
    }
    if (action === 'user-update') {
        currentAction = 'update';
        elementToUpdate = tr;

        userForm.querySelector('#user-modal-title').innerHTML = (`Update User <b>ID: </b>${user.id} <b>Name: </b>${user.first_name}`);
        userModal.show();


    } else if (action === 'user-delete') {


        let elem = event.target.closest('tr');
        let id = elem.dataset.id;
        selectedIds.push(id);
        selectedElements.push(elem);
        deleteConfirmModal.show();
    }
});
deleteConfirm.addEventListener('click', async function (event) {

    if (event.target.dataset.action === 'confirm' && selectedIds.length > 0) {
        const response = await fetch('/delete_user.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "DataType": "json",
            },
            body: JSON.stringify({user_ids: selectedIds}),
        });
        if (response.ok) {
            let json = await response.json();

            console.log(json);
            if (json.status) {
                selectedElements.forEach((elem) => {
                    elem.remove();
                });
                updateCheckboxes(tBody);
            } else {
                deleteConfirmModal.hide();
                warningBody.innerText = json.error.message;
                warningModal.show();
            }

            deleteConfirmModal.hide();
        }else {
            deleteConfirmModal.hide();
            warningBody.innerText = "Error " + response.status;
            warningModal.show();
        }

    }
    if (event.target.dataset.action === 'cancel')
        deleteConfirmModal.hide();

});
deleteConfirm.addEventListener('hide.bs.modal', function () {
    selectedIds = [];
    selectedElements = [];
});

deleteConfirm.addEventListener('show.bs.modal', function () {
    deleteConfirm.querySelector('#modal-body').innerHTML = "You want to delete users:<br>";
    selectedElements.forEach((item) => {
        let id = item.dataset.id;
        let first_name = item.dataset.firstName;
        let last_name = item.dataset.lastName;
        deleteConfirm.querySelector('#modal-body').innerHTML += `<b>ID:</b> ${id} <b>${first_name} ${last_name}</b><br>`;
    });
});
userForm.addEventListener('hide.bs.modal', function () {
    currentAction = null;
    elementToUpdate = null;
    selectedElements = [];
});
userStoreButton.forEach((item) => {
    item.addEventListener('click', function () {
        currentAction = 'store';
        userModal.show();
        userForm.querySelector('#user-modal-title').innerText = "Create User";

    });

});
const showFormErrors = function (fields) {
    fields.forEach(function (item) {
        if ((!item.value && item.id !== 'status') || (item.tagName === "SELECT" && item.value === '0')) {
            let invalidInput = item.parentElement.querySelector('.error-message');
            invalidInput.innerText = 'Field is required';
            item.parentElement.querySelector('.error-message').style.display = 'block';
        }
    });
}

const hideFormErrors = function (errors) {
    errors.forEach(function (item) {
        item.style.display = 'none';
    });
}
saveButton.addEventListener('click', async function (event) {
    hideFormErrors(document.querySelector('form#user-form').querySelectorAll('.error-message'));
    let form = userForm.querySelector('form#user-form');
    let formGeneralError = document.querySelector(".error-message.general");
    let firstNameInput = form.querySelector('input#first-name');
    let lastNameInput = form.querySelector('input#last-name');
    let statusInput = form.querySelector('input#status');
    let roleSelect = form.querySelector('select#role');

    if (!firstNameInput || !lastNameInput || !statusInput || !roleSelect) {
        formGeneralError.style.display = 'block';
        formGeneralError.innerText = "Invalid form";
        return;
    }

    let user = {
        'first_name': firstNameInput.value,
        'last_name': lastNameInput.value,
        'status': statusInput.checked,
        'role': roleSelect.value,
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

            const responseStore = await fetch('/store_user.php', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "DataType": "json",
                },
                body: JSON.stringify({user}),
            });
            if (responseStore.ok) {
                let json = await responseStore.json();

                console.log(json);
                if (json.status) {
                    let userData = {
                        id: json.id,
                        first_name: form.querySelector('input#first-name').value,
                        last_name: form.querySelector('input#last-name').value,
                        status: form.querySelector('input#status').checked,
                        role: json.role,
                    }

                    addUser(userData, table);
                    updateUser(tBody.lastElementChild, userData);
                    if (selectAllCheckbox.checked) {
                        selectAllCheckboxes(tBody);
                    }
                } else {
                    formGeneralError.style.display = 'block';
                    formGeneralError.innerText = json.error.message;

                }

                userModal.hide();
            } else {
                userModal.hide();
                warningBody.innerText = "Error " + responseStore.status;
                warningModal.show();
            }
            break;
        case 'update':
            user.id = elementToUpdate.dataset.id;


            const responseUpdate = await fetch('/update_user.php', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "DataType": "json",
                },
                body: JSON.stringify(user),
            });
            if (responseUpdate.ok) {
                let json = await responseUpdate.json();

                console.log(json);
                if (json.status) {
                    updateUser(elementToUpdate, json.user);
                    userModal.hide();
                    selectedElements = [];

                } else {
                    formGeneralError.style.display = 'block';
                    formGeneralError.innerText = json.error.message;

                }
            } else {
                userModal.hide();
                warningBody.innerText = "Error " + responseUpdate.status;
                warningModal.show();
            }
            break;
        default:
            break;
    }
});

warning.addEventListener('hidden.bs.modal', function () {
    warningBody.innerText = "";
});

Array.from(modals).forEach((modal) => {
    modal.addEventListener('show.bs.modal', function () {
        modal.removeAttribute("inert");
    });
    modal.addEventListener('hide.bs.modal', function () {
        modal.setAttribute("inert", "");
    });
});


userForm.addEventListener('show.bs.modal', function (event) {
    hideFormErrors(document.querySelector('form#user-form').querySelectorAll('.error-message'));
    let form = userForm.querySelector('form#user-form');
    form.querySelector('input#first-name').value = "";
    form.querySelector('input#last-name').value = "";
    form.querySelector('input#status').checked = true;
    form.querySelector('select#role').value = 0;

    const user = {};
    if (currentAction === 'update') {
        let row = elementToUpdate.closest('tr');

        let data = [];
        let first_name = row.dataset.firstName;
        let last_name = row.dataset.lastName;
        if(!first_name || !last_name){
            let formGeneralError = document.querySelector(".error-message.general");
            formGeneralError.style.display = 'block';
            formGeneralError.innerText = "Invalid user table";
            warningBody.innerText = "Invalid user table";
            warning.show();
            return;
        }

        form.querySelector('input#first-name').value = first_name;
        form.querySelector('input#last-name').value = last_name;
        form.querySelector('input#status').checked = row.querySelector('.status').classList.contains('active');
        form.querySelector('select#role').value = row.dataset.roleId;
    }
});
groupActionsButtons.forEach(function (button) {

    let groupActions = button.parentNode.querySelector(".group-actions");
    button.addEventListener('click', async function (event) {
        if (tBody.querySelectorAll('input:checked').length <= 0) {
            warningBody.innerText = "User not selected";
            warningModal.show();
            return;
        }
        if (!Number.isInteger(+groupActions.value)) {
            warningBody.innerText = "Action not selected";
            warningModal.show();
            return;
        }

        selectedElements = [];

        tBody.querySelectorAll('input:checked').forEach(function (item) {
            selectedElements.push(item.closest('tr'));
            selectedIds.push(item.closest('tr').dataset.id);
        });

        let users = [];
        switch (+groupActions.value) {
            case 1:
                selectedElements.forEach((item) => {
                    let id = item.dataset.id;
                    let user = {
                        id,
                        status: true,
                    };
                    users.push(user);
                });

                const responseUpdateActive = await fetch('/update_user_status.php', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "DataType": "json",
                    },
                    body: JSON.stringify({users}),
                });
                if (responseUpdateActive.ok) {
                    let json = await responseUpdateActive.json();

                    console.log(json)
                    if (json.status) {
                        selectedElements.forEach(function (user) {
                            let status = user.querySelector('.status');
                            status.classList.remove('inactive');
                            status.classList.add('active');


                        });
                    } else {
                        warningBody.innerText = json.error.message;
                        warningModal.show();
                    }

                    userModal.hide();
                } else {
                    userModal.hide();
                    warningBody.innerText = "Error " + responseUpdateActive.status;
                    warningModal.show();
                }
                selectedElements = [];
                selectedIds = [];

                break;
            case 2:
                selectedElements.forEach((item) => {
                    let id = item.dataset.id;
                    let user = {
                        id,
                        status: false,
                    };
                    users.push(user);
                });


                const responseUpdateInactive = await fetch('/update_user_status.php', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "DataType": "json",
                    },
                    body: JSON.stringify({users}),
                });
                if (responseUpdateInactive.ok) {
                    let json = await responseUpdateInactive.json();

                    console.log(json)
                    if (json.status) {
                        selectedElements.forEach(function (user) {
                            let status = user.querySelector('.status');
                            status.classList.remove('active');
                            status.classList.add('inactive');


                        });
                    } else {
                        warningBody.innerText = json.error.message;
                        warningModal.show();
                    }

                    userModal.hide();
                } else {
                    userModal.hide();
                    warningBody.innerText = "Error " + responseUpdateInactive.status;
                    warningModal.show();
                }
                selectedElements = [];
                selectedIds = [];
                break;
            case 3:
                selectedElements.push()
                deleteConfirmModal.show();
                break;
            default:
                console.log('Unknown option');
                break;
        }
    });

});
const updateCheckboxes = function (tBody) {
    if (allCheckboxesSelected(tBody))
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
    let status = element.querySelector('.status');
    element.dataset.firstName = user.first_name;
    element.dataset.lastName = user.last_name;
    element.querySelector('.name').innerText = element.dataset.firstName + " " + element.dataset.lastName;
    status.classList.remove('active', 'inactive');
    status.classList.add(Boolean(user.status) === true ? 'active' : 'inactive');
    element.querySelector('.role').innerText = user.role.name;


}
const addUser = function (data, table) {
    let tBody = table.querySelector('tbody');

    let elem = document.createElement('tr');
    elem.setAttribute('data-id', data['id']);
    elem.setAttribute('data-first-name', data['first_name']);
    elem.setAttribute('data-last-name', data['last_name']);
    elem.setAttribute('data-role-id', data.role.id);
    elem.innerHTML = `
        <th scope="row">
            <input class="form-check-input" type="checkbox">
        </th>
        <td class="name">${elem.dataset.firstName} ${elem.dataset.lastName}</td>
         <td>
                    <span class='status ${data.status ? 'active' : 'inactive'}'></span>
                </td>
        <td class="role">${data.role.name}</td>
        
           <td><i class="fas fa-edit" id="user-update"></i>
                    <i class="fa-solid fa-trash" id="user-delete"></i>
                </td>
       
    `;

    tBody.appendChild(elem);
};

