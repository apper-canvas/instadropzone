import Home from '../pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Upload',
    component: Home
  }
};

export const routeArray = Object.values(routes);