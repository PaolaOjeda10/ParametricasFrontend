// const APP_NAME = process.env.REACT_APP_NAME || 'app';
const Storage = {
  setUser: (user) => this.set('user', user),
  getUser: () => {
    return this.get('user');
  },
  set: (key, value) => {
    window.localStorage.setItem(`${key}`, JSON.stringify(value));
  },
  get: (key) => {
    const data = window.localStorage.getItem(`${key}`);
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  },
  clean: () => {
    this.remove('token');
    this.remove('user');
    this.remove('menu');
    this.remove('sidenav');
    this.remove('roles');
    this.remove('t');
    this.remove('ttl');
  },
  exist: (key) => {
    const value = window.localStorage.getItem(`${key}`);
    return typeof value !== 'undefined' && value !== undefined && value !== null && value !== 'null' && value !== '[]';
  },
  remove(key) {
    window.localStorage.removeItem(`${key}`);
  },
  removeAll: () => window.localStorage.clear(),
};

export default Storage;
