const checkedUserIds = [];
let currentOperation = "CREATE";
let currentGroupOperation = "";

function getUserElement({ firstname, lastname, role, status, id }) {
  return `
  <tr id="user-${id}-info">
    <td>
    <div class="input-group-text">
      <input userid="${id}" class="user-checker" type="checkbox" aria-label="Checkbox for following text input">
    </div>
    </td>
    <td>
      <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="">
      <a href="#" class="user-link firstname-container">${firstname}</a>
      <a href="#" class="user-link lastname-container">${lastname}</a>
      <span class="user-subhead">${role}</span>
    </td>
    <td class="text-center">
      ${
        status == 0
          ? '<span class="label label-default inactive user-status-container">inactive</span>'
          : '<span class="label label-default active user-status-container">active</span>'
        }
    </td>
    <td class="user-role-container">${role}</td>
    <td style="width: 20%;">
      <a href="#" class="table-link update-btn" userid="${id}">
        <span class="fa-stack">
          <i class="fa fa-square fa-stack-2x"></i>
          <i class="fa fa-pencil fa-stack-1x fa-inverse"></i>
        </span>
      </a>
      <a href="#" class="table-link danger delete-btn" userid="${id}">
        <span class="fa-stack">
          <i class="fa fa-square fa-stack-2x"></i>
          <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
        </span>
      </a>
    </td>
  </tr>
  `;
}

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

function setUsers(users) {
  const tableContainerElement = $('tbody');
  users.forEach(user => {
    tableContainerElement.append(getUserElement(user));
  });
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

    removeUsers();
  });

  $('.update-btn').on('click', function(index) {
    const currentUserId = $(this).attr('userid');

    clearSelectedIds();
    checkedUserIds.push(currentUserId);

    fillFormByUserData(currentUserId);
    $("#exampleModal").modal("show");
    selectUpdateOperation();
  });

  createCheckboxesController();
  $('form').on('submit', function(e) {
    e.preventDefault();
    if (currentOperation === "CREATE") {
      createUser();
    }
    if (currentOperation === "UPDATE") {
      updateUsers();
    }
  });

  $('select[name="operations"]').on('change', function(e) {
    currentGroupOperation =  $(this).val();
  });
  $('.multi-ops-btn').click(e => {
    switch(currentGroupOperation) {
      case "set-active":
        updateUsers({ status: "true" });
        break;
      case "set-no-active":
        updateUsers({ status: "" });
        break;
      case "delete":
        removeUsers();
        break;
    }
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
    $(`input.active-status`).prop("checked", true);
    $(`input.inactive-status`).prop("checked", false);
  } else {
    $(`input.inactive-status`).prop("checked", true);
    $(`input.active-status`).prop("checked", false);
  }
}

$(document).ready(() => {
  getUsers()
    .then(({ users, usersCount }) => {
      const pagesCount = Math.ceil(usersCount / users.length);
      setPagination(pagesCount, 1);
      setUsers(users || []);
      setUsersControls(users || []);
    });
});

function getUsers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/ajax.php',
      method: "GET",
      success: (result) => {
        resolve(result);
      },
      error: (xhr, resp, text) => {
        reject(text);
      }
    });
  });
}

function removeUsers(usersIds) {
  $.ajax({
    url: '/ajax.php',
    method: 'DELETE',
    dataType: 'json',
    data: JSON.stringify({ id: checkedUserIds }),
    success: (result) => {
      clearSelectedIds();
      document.location.reload();
    },
    error: (xhr, resp, text) => {
      console.log(xhr, resp, text);
      clearSelectedIds();
      document.location.reload();
    }
  });
}

function createUser() {
  $.ajax({
    url: '/ajax.php',
    method: "POST",
    dataType: 'json',
    data: $('form').serialize(),
    success: (result) => {
      console.log(result);
      $("#exampleModal").modal("hide");
      document.location.reload();
    },
    error: (xhr, resp, text) => {
      console.log(xhr, resp, text);
      document.location.reload();
    }
  });
}

function updateUsers(data) {
  $.ajax({
    url: '/ajax.php',
    method: 'PUT',
    dataType: 'json',
    data: JSON.stringify(
      Object.assign({ id: checkedUserIds }, data || {
        firstname: $('input[name="firstname"]').val(),
        lastname: $('input[name="lastname"]').val(),
        role: $('select[name="role"]').val(),
        status: $('input[name="status"]:checked').val()
      })
    ),
    success: (result) => {
      clearSelectedIds();
      selectCreateOperation();
      $("#exampleModal").modal("hide");
      document.location.reload();
    },
    error: (xhr, resp, text) => {
      console.log(xhr, resp, text);
      clearSelectedIds();
      selectCreateOperation();
      $("#exampleModal").modal("hide");
      document.location.reload();
    }
  });
}
