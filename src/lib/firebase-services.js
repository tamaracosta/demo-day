import { getError } from './error.js';

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
      }).catch((error) => {
        getError(error);
      });
    });
  } else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
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

export const filterPosts = (value, createAndPrintAllPosts) => {
  const posts = [];
  firebase.firestore().collection('posts').get()
    .then((snap) => {
      snap.forEach((post) => {
        posts.push(post);
      });
      const filteredPosts = posts.filter((post) => post.data().category === value);
      filteredPosts.forEach((element) => {
        createAndPrintAllPosts(element);
      });
    });
};

export const getMyPosts = (createAndPrintAllPosts) => {
  firebase.firestore().collection('posts')
    .orderBy('data', 'desc')
    .where('user_id', '==', firebase.auth().currentUser.email)
    .get()
    .then((snap) => {
      snap.forEach((post) => {
        createAndPrintAllPosts(post);
      });
    });
};

export const deletePost = (postID, loadPosts) => {
  firebase.firestore().collection('posts').doc(postID).delete()
    .then(() => {
      loadPosts();
    });
};

export const likePost = (postID, currentUserEmail) => {
  const likesPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = likesPostId.get().then(((post) => {
    const people = post.data().likes;
    if (people.length >= 1) {
      if (people.includes(currentUserEmail)) {
        likesPostId.update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUserEmail),
        });
        return 'deslike';
      }
      likesPostId
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUserEmail),
        });
      return 'like';
    }
    likesPostId
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUserEmail),
      });
    return 'like';
  })).catch((error) => {
    console.log(error);
  });
  return promiseResult;
};

export const editPost = (newText, postID) => {
  firebase.firestore().collection('posts').doc(postID).update({
    text: newText,
  });
};

export const commentPost = (postID, newCommentText, currentUserEmail, username) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then((post) => {
    const comments = post.data().comments;
    if (newCommentText !== '') {
      const newComment = {
        owner: currentUserEmail,
        content: newCommentText,
        postOfOrigin: postID,
        likes: [],
        id: postID + new Date().toLocaleString('pt-BR'),
        creationDate: Math.round(Date.now() / 1000),
        userName: username,
      };
      commentPostId.update({ comments: firebase.firestore.FieldValue.arrayUnion(newComment) });
      const currentComments = comments.concat(newComment);
      return currentComments;
    }
    return comments;
  });
  return promiseResult;
};

export const showComments = (postID) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then(((post) => {
    const comments = (post.data().comments);
    return comments;
  }));
  return promiseResult;
};

export const deletePostComment = (postID, commentID) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then(((post) => {
    const comments = (post.data().comments);
    const commentsToKeep = comments.filter((comment) => comment.id !== commentID);
    commentPostId.update({ comments: commentsToKeep });
    return commentsToKeep;
  }));
  return promiseResult;
};

export const likePostComment = (postID, commentID, currentUserEmail) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then(((post) => {
    const comments = (post.data().comments);
    const commentToLikeOrDislike = comments.filter((comment) => comment.id === commentID);
    const commentsNotChanged = comments.filter((comment) => comment.id !== commentID);
    let action = '';

    if (commentToLikeOrDislike[0].likes.length >= 1) {
      if (commentToLikeOrDislike[0].likes.includes(currentUserEmail)) {
        const index = commentToLikeOrDislike[0].likes.indexOf(currentUserEmail);
        if (index > -1) {
          commentToLikeOrDislike[0].likes.splice(index, 1);
        }
        action = 'deslike';
      } else {
        commentToLikeOrDislike[0].likes.push(currentUserEmail);
        action = 'like';
      }
    } else {
      commentToLikeOrDislike[0].likes.push(currentUserEmail);
      action = 'like';
    }
    const newContent = commentToLikeOrDislike.concat(commentsNotChanged);
    commentPostId.update({ comments: newContent });
    return action;
  }));
  return promiseResult;
};

export const sendImageToDatabase = (file, showUrlOfImagesToPubish) => {
  const ref = firebase.storage().ref('images/');
  ref.child(file.name).put(file).then(() => {
    ref.child(file.name).getDownloadURL().then((url) => {
      showUrlOfImagesToPubish(url);
    });
  });
};

export const loginWithEmailAndPassword = (email, pass) => {
  firebase.auth().signInWithEmailAndPassword(email, pass).then(() => {
    getTheRoad('/feed');
  }).catch((error) => {
    getError(error);
  });
};

export const updateProfileName = (name) => {
  firebase.auth().currentUser.updateProfile({ displayName: name });
};

export const registerAccount = (email, password, name, checkbox) => {
  if (checkbox.checked === true) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        updateProfileName(name);
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  } else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        updateProfileName(name);
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  }
};

export const resetPassword = (email) => {
  firebase.auth().sendPasswordResetEmail(email).then(() => {
  }).catch((error) => {
    getError(error);
  });
};
