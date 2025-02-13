<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container mt-3">
    <div class="modal fade" id="user-modal" tabindex="-1" aria-labelledby="user-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="first-name" class="col-form-label">First Name:</label>
                            <input type="text" class="form-control" id="first-name">
                        </div>
                        <div class="mb-3">
                            <label for="last-name" class="col-form-label">Last Name:</label>
                            <input type="text" class="form-control" id="last-name">
                        </div>
                        <div class="mb-3">
                            <label for="flexSwitchCheckChecked" class="col-form-label">Status:</label>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="role" class="col-form-label">Role:</label>
                            <select class="w-50 form-select" aria-label="Default select example">
                                <option selected id="role">Please select</option>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
    <div class="d-grid gap-2 d-md-block">
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#user-modal">Add</button>
    </div>


    <div class="modal fade" id="delete-confirm-modal" tabindex="-1" aria-labelledby="delete-confirm-modal"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="delete-confirm-modal-label">Are you sure?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-action="cancel">Cancel</button>
                    <button type="button" class="btn btn-primary btn-danger" data-action="confirm">Delete</button>
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
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Status</th>
            <th scope="col">Role</th>
            <th scope="col">Options</th>
        </tr>
        </thead>
        <tbody>
        <tr  data-id="1">

            <th scope="row">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

            </th>
            <td>Mark</td>
            <td>Otto</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-circle-fill"
                     viewBox="0 0 16 16">
                    <circle cx="7" cy="7" r="7"/>
                </svg>
            </td>
            <td>User</td>
            <td id="actions"><img src="assets/images/edit.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#user-modal" data-action="edit"  alt="edit">
                <img src="assets/images/delete.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#delete-confirm-modal" data-action="delete" alt="delete">
            </td>
        </tr>
        <tr  data-id="2">
            <th scope="row"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

            </th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-circle-fill"
                     viewBox="0 0 16 16">
                    <circle cx="7" cy="7" r="7"/>
                </svg>
            </td>
            <td>Admin</td>
            <td><img src="assets/images/edit.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#user-modal" data-id="1" data-action="edit" alt="edit">
                <img src="assets/images/delete.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#delete-confirm-modal" data-id="1" data-action="delete" alt="delete">
            </td>
        </tr>
        <tr  data-id="3">
            <th scope="row"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

            </th>
            <td>Larry the Bird</td>
            <td>Larry the Bird3</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-circle-fill"
                     viewBox="0 0 16 16">
                    <circle cx="7" cy="7" r="7"/>
                </svg>
            </td>
            <td>Admin</td>

            <td ><img src="assets/images/edit.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#user-modal" data-id="1" data-action="edit" alt="edit">
                <img src="assets/images/delete.png" class="img-fluid cursor-pointer" data-bs-toggle="modal"
                     data-bs-target="#delete-confirm-modal" data-id="1" data-action="delete" alt="delete">
            </td>
        </tr>
        </tbody>
    </table>
    <div class="container">
        <select class="w-25 form-select" aria-label="Default select example">
            <option selected>Please select</option>
            <option value="1">Set active</option>
            <option value="2">Set not active</option>
            <option value="3">Delete</option>
        </select>
        <div class="d-grid gap-2 d-md-block mt-2">
            <button class="btn btn-primary" type="button">Ok</button>
        </div>
    </div>
</div>
<script src="assets/js/script.js"></script>
</body>
</html>