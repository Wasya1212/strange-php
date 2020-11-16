const checkedUserIds = [];
let currentOperation = "CREATE";
let currentGroupOperation = "";
const usersList = [];
let usersTable;

function createCheckboxesController() {
  $('.user-checker').on('change', e => {
    const checkersCount = $('.user-checker').size();
    const checkedCheckersCount = $('.user-checker:checked').size();

    if (checkersCount === checkedCheckersCount) {
      $('.group-operations').prop("checked", true);
    } else {
      $('.group-operations').prop("checked", false);
    }

    $('.user-checker:checked').each(function(index) {
      checkedUserIds.push($(this).attr("userid"));
    });
  });
  $('.group-operations').on('change', function(e) {
    if ($(this).prop("checked") === true) {
      $('.user-checker').each(function(index) {
        $(this).prop("checked", true);
      });
      fillIds();
    } else {
      clearSelectedIds();
      $('.user-checker').each(function(index) {
        $(this).prop("checked", false);
      });
    }
  });
}

function createCheckboxesControllerById(id) {
  $(`#user-${id}-info`).find('.user-checker').on('change', e => {
    const checkersCount = $('.user-checker').size();
    const checkedCheckersCount = $('.user-checker:checked').size();

    if (checkersCount === checkedCheckersCount) {
      $('.group-operations').prop("checked", true);
    } else {
      $('.group-operations').prop("checked", false);
    }

    $('.user-checker:checked').each(function(index) {
      checkedUserIds.push($(this).attr("userid"));
    });
  });
  $('.group-operations').on('change', function(e) {
    if ($(this).prop("checked") === true) {
      $('.user-checker').each(function(index) {
        $(this).prop("checked", true);
      });
      fillIds();
    } else {
      clearSelectedIds();
      $('.user-checker').each(function(index) {
        $(this).prop("checked", false);
      });
    }
  });
}

function clearSelectedIds() {
  checkedUserIds.splice(0, checkedUserIds.length);
}

function fillIds() {
  clearSelectedIds();
  $('.user-checker').each(function(index) {
    checkedUserIds.push($(this).attr("userid"));
  });
}

function selectCreateOperation() {
  currentOperation = "CREATE";
  $('#userDataModal').find('.modal-title').text('Create user');
}

function selectUpdateOperation() {
  currentOperation = "UPDATE";
  $('#userDataModal').find('.modal-title').text('Update user');
}

function createControlById(userId) {
  $(`#user-${userId}-info`).find('.delete-btn').on('click', function(e) {
    const currentUserId = userId;

    clearSelectedIds();
    checkedUserIds.push(currentUserId);

    User
      .removeUserById(checkedUserIds)
      .then(() => {
        usersTable.remove(checkedUserIds);
        clearSelectedIds();
      });
  });

  $(`#user-${userId}-info`).find('.update-btn').on('click', function(index) {
    const currentUserId = userId;

    clearSelectedIds();
    checkedUserIds.push(currentUserId);

    fillFormByUserData(currentUserId);
    $("#userDataModal").modal("show");
    selectUpdateOperation();
  });
}

function setUsersControls(users) {
  $('.add-user-btn').on('click', function(e) {
    selectCreateOperation();
  });

  $('.delete-btn').on('click', function(e) {
    const currentUserId = $(this).attr('userid');

    clearSelectedIds();
    checkedUserIds.push(currentUserId);

    User
      .removeUserById(checkedUserIds)
      .then(() => {
        usersTable.remove(checkedUserIds);
        clearSelectedIds();
      });
  });

  $('#submit-user-data-btn').click(() => {
    $('#user-data-form').find('button[type="submit"]').click();
  });

  $('#userDataModal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
    clearSelectedIds();
  });

  $('.update-btn').on('click', function(index) {
    const currentUserId = $(this).attr('userid');

    clearSelectedIds();
    checkedUserIds.push(currentUserId);

    fillFormByUserData(currentUserId);
    $("#userDataModal").modal("show");
    selectUpdateOperation();
  });

  createCheckboxesController();
  $('#user-data-form').on('submit', function(e) {
    e.preventDefault();

    const newUser = new User({
      firstname: $(this).find('input[name="firstname"]').val(),
      lastname: $(this).find('input[name="lastname"]').val(),
      status: $(this).find('input[name="status"]').prop('checked'),
      role: $(this).find('select[name="role"]').val()
    });

    if (currentOperation === "CREATE") {
      newUser
        .save()
        .then((createdUser) => {
          const user = new User(createdUser)
          usersList.push(user);
          usersTable.add(user);
          createControlById(user.id);
          createCheckboxesControllerById(user.id);
          $("#userDataModal").modal("hide");
        });
    }
    if (currentOperation === "UPDATE") {
      User
        .updateUserById(checkedUserIds, {
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          status: newUser.status,
          role: newUser.role
        })
        .then(() => {
          usersTable.replace(checkedUserIds[0], newUser);
          clearSelectedIds();
          selectCreateOperation();
          $("#userDataModal").modal("hide");
        });
    }
  });

  $('select[name="operations"]').on('change', function(e) {
    currentGroupOperation =  $(this).val();
    $(`select[name="operations"] option[value=${currentGroupOperation}]`).prop('selected', true);
  });
  $('.multi-ops-btn').click(e => {
    if (checkedUserIds.length === 0) {
      showError("Please select at least one user!");
      return;
    }

    if (!['set-active', 'set-no-active', 'delete'].includes(currentGroupOperation)) {
      showError(
        "Please select some group operation!",
        "You can foud operations near the 'OK' button"
      );
      return;
    }

    showConfirmModal({
      onConfirm: () => { useGroupOperation(); },
      onCancel: () => { console.log('canceled'); }
    });
  });
}

function showConfirmModal({ onConfirm, onCancel }) {
  $('#confirmModal').find('.modal-footer').html(`
    <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  `);

  $('#confirmModal').find('.btn-success').click(onConfirm);
  $('#confirmModal').find('.btn-secondary').click(onCancel);

  $('#confirmModal').modal('show');
}

function updateStatus(userIds, status) {
  userIds.forEach(id => {
    $(`#user-${id}-info`).find('.user-active-status').html(`
      ${
        status == 0 || !status
          ? '<span class="label label-default inactive user-status-container">inactive</span>'
          : '<span class="label label-default active user-status-container">active</span>'
      }
    `);
  });
}

function useGroupOperation() {
  switch(currentGroupOperation) {
    case "set-active":
      User
        .updateUserById(checkedUserIds, { status: "true" })
        .then(() => {
          updateStatus(checkedUserIds, true);
          clearSelectedIds();
          selectCreateOperation();
          $("#userDataModal").modal("hide");
          uncheckAllUsers();
        });
      break;
    case "set-no-active":
      User
        .updateUserById(checkedUserIds, { status: "" })
        .then(() => {
          updateStatus(checkedUserIds, false);
          clearSelectedIds();
          selectCreateOperation();
          $("#userDataModal").modal("hide");
          uncheckAllUsers();
        });
      break;
    case "delete":
      User
        .removeUserById(checkedUserIds)
        .then(() => {
          usersTable.remove(checkedUserIds);
          clearSelectedIds();
          uncheckAllUsers();
        });
      break;
    default:
      showError(
        "Please select some group operation!",
        "You can foud operations near the 'OK' button"
      );
      break;
  }
}

function uncheckAllUsers() {
  $('.group-operations').prop("checked", false);
  $('.user-checker').each(function(index) {
    $(this).prop("checked", false);
  });
}

function fillFormByUserData(userId) {
  const firstname = $(`#user-${userId}-info .firstname-container`).text();
  const lastname = $(`#user-${userId}-info .lastname-container`).text();
  const role = $(`#user-${userId}-info .user-role-container`).text();
  const status = $(`#user-${userId}-info .user-status-container`).text();

  $(`input[name="firstname"]`).val(firstname);
  $(`input[name="lastname"]`).val(lastname);

  if (role === 'admin') {
    $(`select[name="role"] option[value="admin"]`).prop('selected', true);
    $(`select[name="role"] option[value="user"]`).prop('selected', false);
  } else {
    $(`select[name="role"] option[value="admin"]`).prop('selected', false);
    $(`select[name="role"] option[value="user"]`).prop('selected', true);
  }
  if (status === 'active') {
    $(`input[name="status"]`).prop("checked", true);
  } else {
    $(`input[name="status"]`).prop("checked", false);
  }
}

function showError(msg, descr) {
  $('#errorModal').find('.modal-body').remove();
  $('#errorModal').modal('show');
  $('#errorModal').find('.modal-title').text(msg);

  if (descr) {
    $(`<div class="modal-body">${descr}</div>`).insertAfter($('#errorModal').find('.modal-header'));
  }
}

$(document).ready(() => {
  User.getUsers()
    .then(({ users, usersCount }) => {
      (users || []).forEach(userInfo => {
        usersList.push(new User(userInfo));
      });

      usersTable = new UserTableBuilder('.main-box', usersList);
      setUsersControls(users || []);
    })
    .catch(err => {
      usersTable = new UserTableBuilder('.main-box', []);
      setUsersControls([]);
    });
});
