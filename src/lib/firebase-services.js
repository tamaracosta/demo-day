export const getTheRoad = (state) => {
  window.history.pushState({}, '', state);
  const popstateEvent = new PopStateEvent('popstate', { state: {} });
  dispatchEvent(popstateEvent);
};

export const loginWithGoogle = (checkbox) => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  if (checkbox.checked === true) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        getTheRoad('/feed');
      }).catch(() => {
       
      });
    });
  } else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        getTheRoad('/feed');
      }).catch(() => {
       
      });
    });
  }
};

export const getPosts = (createAndPrintAllPosts) => {
  firebase.firestore().collection('posts').orderBy('data', 'desc').get()
    .then((snap) => {
      snap.forEach((post) => {
        createAndPrintAllPosts(post);
      });
    });
};