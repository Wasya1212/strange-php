class User {
  firstname;
  lastname;
  role;
  status;
  id;

  constructor({ firstname, lastname, status, role, id }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.role = role;
    this.status = status;
    this.id = id;
  }

  save() {

  }

  static getUsers(opts = {}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'ajax.php',
        method: "GET",
        success: ({ users, usersCount }) => {
          resolve({
            users: users.map(user => new User(user)),
            usersCount
          });
        },
        error: (xhr, resp, text) => {
          reject(text);
        }
      });
    });
  }
}
