import { getTheRoad } from './lib/firebase-services.js';
import { Register } from './pages/register/index.js';
import { Login } from './pages/login/index.js';
import { Feed } from './pages/feed/index.js';
import { PersonalFeed } from './pages/personal-feed/index.js';
import { SettingsProfile } from './pages/profile-settings/index.js';

const routRender = () => {
  const elemento = document.getElementById('root');
  const routes = {
    '/': Login,
    '/register': Register,
    '/feed': Feed,
    '/profile': PersonalFeed,
    '/seetings': SettingsProfile,
  };
  elemento.innerHTML = '';

  const createChild = (path) => {
    elemento.appendChild(routes[path]());
  };

  switch (window.location.pathname) {
    case '/':
      createChild('/');
      break;
    case '/register':
      createChild('/register');
      break;
    default:
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          createChild(window.location.pathname);
        } else {
          getTheRoad('/');
        }
      });
      break;
  }
};

window.addEventListener('popstate', routRender);
window.addEventListener('load', routRender);
