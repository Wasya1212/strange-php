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
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'ajax.php',
        method: "POST",
        dataType: 'json',
        data: {
          firstname: this.firstname,
          lastname: this.lastname,
          role: this.role,
          status: this.status
        },
        success: (result) => {
          resolve(result);
        },
        error: (xhr, resp, text) => {
          console.error(xhr, resp, text);
          reject(text);
        }
      });
    });
  }

  static removeUserById(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'ajax.php',
        method: 'DELETE',
        dataType: 'json',
        data: JSON.stringify({ id: Array.isArray(id) ? id : [id] }),
        success: (result) => {
          resolve(result);
        },
        error: (xhr, resp, text) => {
          console.error(xhr, resp, text);
          reject(text);
        }
      });
    });
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

  static updateUserById(id, newUserData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'ajax.php',
        method: 'PUT',
        dataType: 'json',
        data: JSON.stringify(
          Object.assign({ id: Array.isArray(id) ? id : [id] }, newUserData)
        ),
        success: (result) => {
          resolve(result);
        },
        error: (xhr, resp, text) => {
          console.error(xhr, resp, text);
          reject(text);
        }
      });
    });
  }
}
