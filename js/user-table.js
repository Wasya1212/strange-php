class UserTableBuilder {
  containerElement;

  usersList;

  constructor(container, users) {
    this.containerElement = $(container);
    this.usersList = users || [];

    this.init();
  }

  init() {
    this.containerElement.html(getUsersTableView());
    this.usersList.forEach(user => {
      this.containerElement.find('tbody').append(getUserTableRow(user));
    });
  }

  remove(ids) {
    const newUsersList = this.usersList.filter(user => !ids.includes(user.id));
    ids.forEach(userId => {
      $(`#user-${userId}-info`).remove();
    });
  }

  replace(id, newUserInfo) {
    $(`#user-${id}-info`).find('.firstname-container').text(newUserInfo.firstname);
    $(`#user-${id}-info`).find('.lastname-container').text(newUserInfo.lastname);
    $(`#user-${id}-info`).find('.role-container').text(newUserInfo.role);
    $(`#user-${id}-info`).find('.user-active-status').html(`
      ${
        newUserInfo.status == 0 || !newUserInfo.status
          ? '<span class="label label-default inactive user-status-container">inactive</span>'
          : '<span class="label label-default active user-status-container">active</span>'
      }
    `);
  }

  update(newUsersList) {
    this.usersList = newUsersList;
    this.init();
  }
}

function getUsersTableView() {
  return (`
    <div class="table-responsive">
      <table border="0" cellspacing="0" cellpadding="0" class="table user-list">
        <thead>
          <tr scope="row">
            <th scope="col">
              <input class="group-operations" type="checkbox" aria-label="Checkbox for following text input">
            </th>
            <th scope="col"><span>User</span></th>
            <th scope="col" class="text-center"><span>Status</span></th>
            <th scope="col"><span>Role</span></th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  `);
}

function getUserTableRow(user) {
  return (`
    <tr id="user-${user.id}-info" scope="row">
      <td scope="row">
        <input userid="${user.id}" class="user-checker" type="checkbox" aria-label="Checkbox for following text input">
      </td>
      <td>
        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="">
        <a href="#" class="user-link firstname-container">${user.firstname}</a>
        <a href="#" class="user-link lastname-container">${user.lastname}</a>
        <span class="user-subhead role-container">${user.role}</span>
      </td>
      <td class="text-center user-active-status">
        ${
          user.status == 0
            ? '<span class="label label-default inactive user-status-container">inactive</span>'
            : '<span class="label label-default active user-status-container">active</span>'
        }
      </td>
      <td class="user-role-container">${user.role}</td>
      <td style="width: 20%;">
        <a href="#" class="table-link update-btn" userid="${user.id}">
          <span class="fa-stack">
            <i class="fa fa-square fa-stack-2x"></i>
            <i class="fa fa-pencil fa-stack-1x fa-inverse"></i>
          </span>
        </a>
        <a href="#" class="table-link danger delete-btn" userid="${user.id}">
          <span class="fa-stack">
            <i class="fa fa-square fa-stack-2x"></i>
            <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
          </span>
        </a>
      </td>
    </tr>
  `);
}
