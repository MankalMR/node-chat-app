class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    const index = this.users.findIndex((user) =>  user.id === id);
    let removedUser = null;
    if (index > -1) {
      removedUser = this.users.splice(index, 1);
    }
    return removedUser ? removedUser[0] : removedUser;
  }

  getUser (id) {
    const user = this.users.filter((user) =>  user.id === id);
    return typeof user[0] !== 'undefined' ? user[0]: null;
  }

  getUserList (room) {
    const users = this.users.filter((user) =>  user.room === room);
    const namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = { Users };