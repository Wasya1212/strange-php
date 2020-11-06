const checkedUserIds = [];
let currentOperation = "CREATE";

function getUserElement({ username, role, status, id }) {
  console.log(status)
  return `
  <tr>
    <td>
    <div class="input-group-text">
      <input userid="${id}" class="user-checker" type="checkbox" aria-label="Checkbox for following text input">
    </div>
    </td>
    <td>
      <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="">
      <a href="#" class="user-link">${username}</a>
      <span class="user-subhead">${role}</span>
    </td>
    <td class="text-center">
      ${
        status == 0
          ? '<span class="label label-default inactive"></span>'
          : '<span class="label label-default active"></span>'
        }
    </td>
    <td>${role}</td>
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

    if (!checkedUserIds.includes(currentUserId)) {
      checkedUserIds.push(currentUserId);
    }

    removeUsers();
  });

  $('.update-btn').each(function(index) {
    $(this).on('click', e => {
      const currentUserId = $(this).attr('userid');

      if (!checkedUserIds.includes(currentUserId)) {
        checkedUserIds.push(currentUserId);
      }

      $("#exampleModal").modal("show");
      selectUpdateOperation();
    });
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
}

$(document).ready(() => {
  getUsers()
    .then(({ users, usersCount }) => {
      const pagesCount = Math.ceil(usersCount / users.length);
      setPagination(pagesCount, 1);
      setUsers(users);
      setUsersControls(users);
    });
});

function getUsers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/ajax.php',
      method: "GET",
      data: { filter: "some data" },
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

function updateUsers() {
  $.ajax({
    url: '/ajax.php/так/же/ж/не/можна',
    method: 'PUT',
    dataType: 'json',
    data: JSON.stringify({
      username: $('input[name="username"]').val(),
      role: $('select[name="role"]').val(),
      status: $('input[name="status"]:checked').val(),
      id: checkedUserIds
    }),
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
