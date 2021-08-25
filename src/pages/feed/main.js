import {
  getPosts, deletePost,
} from '../../lib/firebase-services.js';

import {
  updateLikes, getComments, getCurrentCommentsToPrint,
} from './index.js';

export const Feed = () => {
  const rootElement = document.createElement('div');
  rootElement.className = 'feed-container';
  rootElement.innerHTML = `
  <header>
    <nav>
      <ul class='feed-menu'>
          <li><button class='btn home-btn'></button></li>
          <li><button class='btn night-btn'></button></li>
          <li><button class='btn search-btn'></button></li>
          <li><button class='btn settings-btn'></button></li>
          <li><button class='btn signout-btn'></button></li>
      </ul>
    </nav>
  </header>
  <main class='feed-main>
    <form class='feed-publication-form'>
      <textarea class='feed-publication-text-area' id='publication-text-area' placeholder='O que você quer publicar hoje?'></textarea> 
      <section class='feed-publication-buttons-area'>
        <button class='btn feed-publication-image-btn' id='publication-image-btn'></button>
        <form method="post">
          <input class='feed-choose-an-image-btn' id='choose-an-image-btn' type="file" accept=".jpg, .jpeg, .png">
        </form>
        <button class='feed-publication-publish-btn' id='publication-of-all-content-btn'> PUBLICAR </button>
      </section>
    </form>  
    <section class='feed-posts-section' id='posts-section'></section>
  </main>
  <footer><footer>
  `;

  const postsCollection = firebase.firestore().collection('posts');
  const currentUserEmail = firebase.auth().currentUser.email;

  function createPostTemplate(post) {
    const postTemplate = `
    <div class="feed-all-the-post" data-postId="${post.id}" data-postOwner="${post.data().user_id}">
      <section class='feed-post-owner-data'>
        <img class='feed-post-owner-picture'>
        <span class='feed-post-owner-name'> ${post.data().user_id} em: </span>
        <span class='feed-post-data'> ${post.data().data} </span>
      </section>
      <section class='feed-post-content-section'>
        <p class='feed-post-content'> ${post.data().text} </p>
        <img class='feed-post-image'> </img>
      </section>
      <section class='feed-post-actions-section'>
        <div class='feed-post-actions-left-section'>
      ${((likes) => {
    if (likes.length > 0) {
      if (likes.includes(currentUserEmail)) {
        return `<button class='btn full-like-btn' data-likePostButton='${post.id}'></button> `;
      } return `<button class='btn empty-like-btn' data-likePostButton='${post.id}'></button> `;
    } return `<button class='btn empty-like-btn' data-likePostButton='${post.id}'></button> `;
  })(post.data().likes)}
          <span data-likeValueToChange='${post.id}'> ${post.data().likes.length} </span>
          <button class='btn comment-btn' data-showCommentPostButton='${post.id}'></button>
        </div>
        <div class='feed-post-actions-right-section'>
      ${((user) => {
    if (user === currentUserEmail) {
      return `<button class='btn edit-btn' data-editPostButton='${post.id}'></button>
              <button class='btn delete-btn' data-deletePostButton='${post.id}'></button>`;
    } return `<button class='not-allowed-to-see'></button>
              <button class='not-allowed-to-see'></button>`;
  })(post.data().user_id)}
        </div>
      </section>
      <section class='feed-comments-section' data-commentsSection='${post.id}'>
        <div class='feed-comment-input'>
          <textarea class='feed-comment-text-area' data-commentContent='${post.id}' placeholder='Digite seu comentário aqui:'></textarea> 
          <button class='btn feed-comment-btn' data-commentPostButton='${post.id}'></button>
        </div>
        <div class='feed-printed-comments'>
          <ul data-ulCommentArea='${post.id}'> </ul>
        </div>
      </section>
    </div>
    `;
    return postTemplate;
  }

  // Show choose an image btn:
  rootElement.querySelector('#publication-image-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const chooseAnImageBtn = rootElement.querySelector('#choose-an-image-btn');
    chooseAnImageBtn.style.visibility = 'visible';
  });

  // Post creation section:
  function createAndPrintAllPosts(post) {
    const postElement = document.createElement('div');
    postElement.id = post.id;
    postElement.classList.add('feed-a-post');
    // rootElement.querySelector('#hide-url-in-text-area').value = '';
    const postTemplate = createPostTemplate(post);
    postElement.innerHTML = postTemplate;
    rootElement.querySelector('#posts-section').appendChild(postElement);
  }

  function loadPosts() {
    rootElement.querySelector('#posts-section').innerHTML = '';
    getPosts(createAndPrintAllPosts);
  }

  const postData = () => {
    const data = new Date();
    return data.toLocaleString('pt-BR');
  };

  rootElement.querySelector('#publication-of-all-content-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const textArea = rootElement.querySelector('#publication-text-area');
    const postContent = rootElement.querySelector('#publication-text-area').value;
    // const postImageUrl = rootElement.querySelector('#hide-url-in-text-area').value;

    const post = {
      text: postContent,
      // url: postImageUrl,
      user_id: currentUserEmail,
      data: postData(),
      likes: [],
      comments: [],
    };

    if (textArea.value === '') {
      return;
    }
    postsCollection.add(post).then(() => {
      rootElement.querySelector('#publication-text-area').value = '';
      rootElement.querySelector('#posts-section').innerHTML = '';
      loadPosts();
    });
  });

  // Comment creation section:
  const printComments = (commentsToPrint, postID) => {
    const commentArea = rootElement.querySelector(`[data-ulCommentArea="${postID}"]`);
    commentArea.innerHTML = '';
    commentsToPrint.forEach((comment) => {
      const newItem = `
      <li class="comment-f-20" id="${comment.id}"> </li>
      `;
      commentArea.innerHTML += newItem;
    });
  };

  // Action Buttons:
  const postsSection = rootElement.querySelector('#posts-section');
  postsSection.addEventListener('click', (e) => {
    const { target } = e;
    const postID = target.parentNode.parentNode.parentNode.parentNode.id;

    // Delete Post:
    const deletePostBtn = target.dataset.deletepostbutton;
    if (deletePostBtn) {
      deletePost(postID, loadPosts);
    }

    // Like Post:
    const likePostBtn = target.dataset.likepostbutton;
    if (likePostBtn) {
      const valueToBeChanged = rootElement.querySelector(`[data-likeValueToChange="${postID}"]`);
      const amountOfLikes = parseInt(valueToBeChanged.textContent, 10);
      const likeStatus = rootElement.querySelector(`[data-likePostButton="${postID}"]`);
      updateLikes(postID, currentUserEmail, valueToBeChanged, amountOfLikes, likeStatus);
    }

    // Show Comments Section:
    const showCommentPostBtn = target.dataset.showcommentpostbutton;
    if (showCommentPostBtn) {
      const commentsSection = rootElement.querySelector(`[data-commentsSection="${postID}"]`);
      commentsSection.style.display = 'flex';
    }

    // Comment Post:
    const commentPostBtn = target.dataset.commentpostbutton;
    if (commentPostBtn) {
      const newCommentContent = rootElement.querySelector(`[data-commentContent="${postID}"]`).value;
      getCurrentCommentsToPrint(postID, newCommentContent, currentUserEmail, printComments);
    }
  });

  loadPosts();
  return rootElement;
};
