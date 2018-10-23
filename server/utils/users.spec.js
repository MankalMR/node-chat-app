const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
        id: '1',
        name: 'Manu',
        room: 'A'
      },
      {
        id: '2',
        name: 'Priyam',
        room: 'B'
      },
      {
        id: '3',
        name: 'Pia',
        room: 'A'
      }
    ];
  });
  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'MM',
      room: 'Test'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for room A', () => {
    var usersList = users.getUserList('A');

    expect(usersList).toEqual(['Manu', 'Pia']);
  });

  it('should find the user', () => {
    var foundUser = users.getUser('2');

    expect(foundUser).toEqual(users.users[1]);
  });

  it('should NOT find the user', () => {
    var foundUser = users.getUser('4');

    expect(foundUser).toEqual(null);
  });

  it('should remove the user', () => {
    var removedUser = users.removeUser('1');

    expect(removedUser).toEqual({
      id: '1',
      name: 'Manu',
      room: 'A'
    });
  });

  it('should NOT remove the user', () => {
    var removedUser = users.removeUser('4');

    expect(removedUser).toEqual(null);
  });
});