const checkedUserIds = [];
let currentOperation = "CREATE";
let currentGroupOperation = "";
const usersList = [];
let usersTable;

function setPagination(pagesCount, currentPage = 1) {
  if (isNaN(pagesCount)) return;

  $('.pagination').html(`
    ${currentPage !== 1 ? '<li><a href="#"><i class="fa fa-chevron-left"></i></a></li>' : ''}
    ${(new Array(pagesCount)).fill(null).map((_, index) => (
      `<li><a href="#">${index + 1}</a></li>`
    )).join('\n')}
    ${currentPage !== pagesCount ? '<li><a href="#"><i class="fa fa-chevron-right"></i></a></li>' : ''}
  `);
}

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
  $('.modal-title').text('Create user');
}

function selectUpdateOperation() {
  currentOperation = "UPDATE";
  $('.modal-title').text('Update user');
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
    if (currentOperation === "CREATE") {
      const newUser = new User({
        firstname: $(this).find('input[name="firstname"]').val(),
        lastname: $(this).find('input[name="lastname"]').val(),
        status: $(this).find('input[name="status"]').val(),
        role: $(this).find('select[name="role"]').val()
      });
      newUser
        .save()
        .then(() => {
          $("#userDataModal").modal("hide");
          document.location.reload();
        });
    }
    if (currentOperation === "UPDATE") {
      User.updateUserById(checkedUserIds, {
        firstname: $('input[name="firstname"]').val(),
        lastname: $('input[name="lastname"]').val(),
        role: $('select[name="role"]').val(),
        status: $('input[name="status"]').prop('checked')
      }).then(() => {
        clearSelectedIds();
        selectCreateOperation();
        $("#userDataModal").modal("hide");
        document.location.reload();
      });
    }
  });

  $('select[name="operations"]').on('change', function(e) {
    currentGroupOperation =  $(this).val();
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

function useGroupOperation() {
  switch(currentGroupOperation) {
    case "set-active":
      User
        .updateUserById(checkedUserIds, { status: "true" })
        .then(() => {
          clearSelectedIds();
          selectCreateOperation();
          $("#userDataModal").modal("hide");
          document.location.reload();
        });
      break;
    case "set-no-active":
      User
        .updateUserById(checkedUserIds, { status: "" })
        .then(() => {
          clearSelectedIds();
          selectCreateOperation();
          $("#userDataModal").modal("hide");
          document.location.reload();
        });
      break;
    case "delete":
      User
        .removeUserById(checkedUserIds)
        .then(() => {
          clearSelectedIds();
          document.location.reload();
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

      const pagesCount = Math.ceil(usersCount / users.length);
      setPagination(pagesCount, 1);
      setUsersControls(users || []);
    });
});
