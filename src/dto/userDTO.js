class UserDTO {
  constructor(user) {
    this.id = user._id?.toString();
    this.first_name = user.first_name || '';
    this.last_name = user.last_name || '';
    this.email = user.email || '';
    this.age = user.age || null;
  }
  static fromArray(users) {
    return users.map(user => new UserDTO(user));
  }
}

export default UserDTO;
