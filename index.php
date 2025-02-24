<?php
require_once "functions.php";
$users = getAllUsers();
$roles = getAllRoles();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="assets/styles/style.css">
</head>
<body>

<div class="container mt-3">
    <div class="modal fade" id="user-modal" tabindex="-1" aria-labelledby="user-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="user-modal-title">User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="user-form">
                        <div class="text-danger error-message general" id="error-message">
                        </div>
                        <div class="mb-3">
                            <label for="first-name" class="col-form-label">First Name:</label>
                            <input type="text" class="form-control" id="first-name">
                            <div class="text-danger" id="error-message" inert>

                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="last-name" class="col-form-label">Last Name:</label>
                            <input type="text" class="form-control" id="last-name">
                            <div class="text-danger" id="error-message" inert>

                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="status" class="col-form-label">Status:</label>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="status" checked>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="role" class="col-form-label">Role:</label>
                            <select class="w-50 form-select" aria-label="Default select example" id="role">
                                <option selected value="0">Please select</option>
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                            <div class="text-danger" id="error-message" inert>

                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="save-button">Save</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row align-items-center justify-content-between">
            <div class="col-auto">
                <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#user-modal"
                        id="user-store">Add
                </button>
            </div>
            <div class="col-auto d-flex gap-2">
                <select class="form-select w-auto" id="group-actions">
                    <option selected>Please select</option>
                    <option value="1">Set active</option>
                    <option value="2">Set not active</option>
                    <option value="3">Delete</option>
                </select>
                <button class="btn btn-primary" type="button" id="group-actions-button">Ok</button>
            </div>
        </div>
    </div>


    <div class="modal fade" id="delete-confirm-modal" tabindex="-1" aria-labelledby="delete-confirm-modal"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="delete-confirm-modal-label">Are you sure?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-action="cancel">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary btn-danger" data-action="confirm">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="warning-modal" tabindex="-1" aria-labelledby="warning-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header bg-warning">
                    <h5 class="modal-title" id="warning-modal-label">Warning</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body " id="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <table class="table" id="users">
        <thead>
        <tr>

            <th scope="col"><input class="form-check-input" type="checkbox" id="select-all">
                Select All
            </th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Role</th>
            <th scope="col">Options</th>
        </tr>
        </thead>
        <tbody>
        <?php

        foreach ($users as $user) {
            ?>
            <tr data-id="<?= $user['id'] ?>">

                <th scope="row">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

                </th>
                <td id="first-name"><?= "$user[first_name]  $user[last_name]" ?></td>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" id="status" width="16" height="16"
                         fill="<?= $user['status'] == 1 ? 'green' : 'gray' ?>"
                         class="bi bi-circle-fill"
                         viewBox="0 0 16 16">
                        <circle cx="7" cy="7" r="7"/>
                    </svg>
                </td>
                <td id="role"><?= $roles[$user['role']] ?></td>
                <td><i class="fas fa-edit" data-bs-toggle="modal"
                       data-bs-target="#user-modal" data-action="edit" id="user-update"></i>

                    <i class="fa-solid fa-trash" data-bs-toggle="modal"
                       data-bs-target="#delete-confirm-modal" data-action="delete" id="user-delete"></i>

                </td>
            </tr>
            <?php
        }
        ?>


        </tbody>
    </table>
    <div class="container">
        <div class="row align-items-center justify-content-between">
            <div class="col-auto">
                <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#user-modal"
                        id="user-store">Add
                </button>
            </div>
            <div class="col-auto d-flex gap-2">
                <select class="form-select w-auto" id="group-actions">
                    <option selected>Please select</option>
                    <option value="1">Set active</option>
                    <option value="2">Set not active</option>
                    <option value="3">Delete</option>
                </select>
                <button class="btn btn-primary" type="button" id="group-actions-button">Ok</button>
            </div>
        </div>
    </div>

</div>
<script src="assets/js/script.js"></script>
</body>
</html>
