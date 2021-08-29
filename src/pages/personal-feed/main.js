/* eslint-disable consistent-return */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

import {
  deletePost, getMyPosts, editPost, getTheRoad,
} from '../../lib/firebase-services.js';
import {
  updateLikes, getComments, getCurrentCommentsToDelete, getCurrentCommentLikes,
  getCurrentCommentsToPrint, publicationAge,
} from '../feed/index.js';

export const PersonalFeed = () => {
  const rootElement = document.createElement('div');
  rootElement.innerHTML = ` 
  <main class="pagina-personal-feed" id="topo">
      <header class="container-header">
          <div class="foto-personal-feed"> 
          ${((picture) => {
    if (picture.includes('localhost')) {
      return `<img class="foto-personal" src='./images/profile-default.png'>`;
    } if (picture !== null) {
      return `<img class="foto-personal" src="${firebase.auth().currentUser.photoURL}">`;
    } return `<img class="foto-personal" src='./images/profile-default.png'>`;
  })(firebase.auth().currentUser.photoURL)}
            <h3 class="titulo">Olá, 
  ${((name) => {
    if (name !== null) {
      return `<span class="nome">${firebase.auth().currentUser.displayName} &#128512<span>`;
    } return `<span class="nome">Convidade &#128512<span>`;
  })(firebase.auth().currentUser.displayName)}
            </h3>
          </div>
          <div class="editar-perfil">
            <button class="editar-perfil-btn" type"button">
                <a href="/settings">Editar Perfil</a>
            </button>
          </div>
      </header>
    
      <section class='feed-posts-section' id='posts-section'></section>
      <a onclick="window.scroll(0, 0)"> Ir para o topo <i class="fas fa-arrow-circle-up"></i></a>
      
      <header>
      <nav>
      <ul class='feed-menu'>
      <li>
  ${((picture) => {
    if (picture.includes('localhost')) {
      return `<img class="foto-personal-feed-feed" src='./images/profile-default.png'>`;
    } if (picture !== null) {
      return `<img class="foto-personal-feed-feed" src="${firebase.auth().currentUser.photoURL}">`;
    } return `<img class="foto-personal-feed-feed" src='./images/profile-default.png'>`;
  })(firebase.auth().currentUser.photoURL)}
     </li>
      <li><button class='btn home-btn' id='home-btn'></button></li>
      <li><button class='btn search-btn' id='person-btn'></button></li>
      <li><button class='btn settings-btn' id='settings-btn'></button></li>
      <li><button class='btn signout-btn' id='signout-btn'></button></li>
    </ul>
      </nav>
    </header>
  </main>   
  <div class="popup-wrapper">
      <div class="popup">
          <div class="fechar-popup"><i class="far fa-times-circle"></i></div>
          <div class="conteudo-popup">
              <h2>Cadastro finalizado com sucesso!</h2>
              <button id="loginPopup"><a href="/#">Fazer Login</a></button>
          </div>
      </div>
  </div>
      
      `;
  const currentUserEmail = firebase.auth().currentUser.email;
  const username = firebase.auth().currentUser.displayName;
  const userImageUrl = firebase.auth().currentUser.photoURL;

  function createPostTemplate(post) {
    const currentDate = Date.now();
    const timeInSeconds = ((currentDate - post.data().creationDate) / 1000);
    const postAge = publicationAge(timeInSeconds);

    const postTemplate = `
      
    <div class="feed-all-the-post" data-postId="${post.id}" data-postOwner="${post.data().user_id}">
    <section class='feed-post-owner-data'>
  ${((picture) => {
    if (picture !== null) {
      return `<img class='feed-post-owner-picture' src='${post.data().userImg}'>`;
    } return `<img class='feed-post-owner-picture' src='./images/profile-default.png'>`;
  })(post.data().userImg)}
    ${((user) => {
    if (user !== null) {
      return `<span class='feed-post-owner-name'> ${post.data().userName}</span>`;
    } return `<span class='feed-post-owner-name'> Convidade</span>`;
  })(post.data().userName)}
      <span class='feed-post-data'> ${postAge} </span>
    </section>
    <section class='feed-post-content-section'>
      <p class='feed-post-content'> ${post.data().text} </p>
      <textarea class='feed-edit-text-area' data-editTextArea='${post.id}'>${post.data().text}</textarea>
      <img class='feed-post-image'> </img>
    ${((url) => {
    if (url !== '') {
      return `<img class='feed-posted-image' src="${post.data().url}"> </img>`;
    } return `<img id="hide-img" src="${post.data().url}"> </img>`;
  })(post.data().url)}
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
        <span class='feed-post-amount-of-likes' data-likeValueToChange='${post.id}'> ${post.data().likes.length} </span>
        <button class='btn comment-btn' data-showCommentPostButton='${post.id}'></button><span class='feed-post-amount-of-comments'>${post.data().comments.length}</span>
      </div>
      <div class='feed-post-actions-middle-section'>
        ${((category) => {
    if (category === 'decoration') {
      return `<button class='category-icon category-decoration-icon'></button> `;
    } if (category === 'kitchenTips') {
      return `<button class='category-icon category-kitchenTips-icon'></button> `;
    } if (category === 'domesticeconomy') {
      return `<button class='category-icon category-economics-icon'></button> `;
    } if (category === 'physicexercises') {
      return `<button class='category-icon category-exercises-icon'></button> `;
    } if (category === 'leisure') {
      return `<button class='category-icon category-leisure-icon'></button> `;
    } if (category === 'fixing') {
      return `<button class='category-icon category-fixing-icon'></button> `;
    } if (category === 'recipes') {
      return `<button class='category-icon category-recipes-icon'></button> `;
    } if (category === 'security') {
      return `<button class='category-icon category-security-icon'></button> `;
    } if (category === 'sellings') {
      return `<button class='category-icon category-sellings-icon'></button> `;
    } if (category === 'others') {
      return `<button class='category-icon category-others-icon'></button> `;
    }
  })(post.data().category)}
      </div>
      <div class='feed-post-actions-right-section'>
    ${((user) => {
    if (user === currentUserEmail) {
      return `<button class='btn edit-btn' data-editPostButton='${post.id}'></button>
            <button class='btn save-edit-btn' data-saveEditPostButton='${post.id}'></button>
            <button class='btn cancel-edit-btn' data-cancelEditPostButton='${post.id}'></button>
            <button class='btn delete-btn' data-item='deletepost' data-deletePostButton='${post.id}'></button>`;
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
      <div class='feed-printed-comments' data-printedComments='${post.id}'>
        <ul data-ulCommentArea='${post.id}'> </ul>
      </div>
    </section>
    <div class="confirm-delete">
    <div class="modal-delete">
    <div class="h1-modal">Você tem certeza que quer excluir esse post?</div>
    <button class="delete-buttons-modal" id="confirm-delete-modal">Confirmar</button>
    <button class="delete-butons-modal" id="cancel-delete-modal"> Cancelar </button>
    </div>
    </div>
</div>
  </div>
  <hr class='feed-post-end-line'>
  `;
    return postTemplate;
  }

  function createAndPrintAllPosts(post) {
    const postElement = document.createElement('div');
    postElement.id = post.id;
    postElement.classList.add('feed-a-post');
    const postTemplate = createPostTemplate(post);
    postElement.innerHTML = postTemplate;
    rootElement.querySelector('#posts-section').appendChild(postElement);
  }

  // Action Buttons:
  const postsSection = rootElement.querySelector('#posts-section');
  postsSection.addEventListener('click', (e) => {
    const { target } = e;
    const postID = target.parentNode.parentNode.parentNode.parentNode.id;
    const postIDForComments = target.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode.parentNode.id;

    // Delete Post:
    const deletePostBtn = target.dataset.deletepostbutton;
    if (deletePostBtn) {
      showPopupToDelete(postID, loadPosts);
    }

    // Like Post:
    const likePostBtn = target.dataset.likepostbutton;
    if (likePostBtn) {
      const valueToBeChanged = rootElement.querySelector(`[data-likeValueToChange="${postID}"]`);
      const amountOfLikes = parseInt(valueToBeChanged.textContent, 10);
      const likeStatus = rootElement.querySelector(`[data-likePostButton="${postID}"]`);
      updateLikes(postID, currentUserEmail, valueToBeChanged, amountOfLikes, likeStatus);
    }

    // Edit Post:
    const editPostBtn = target.dataset.editpostbutton;
    if (editPostBtn) {
      const editTextArea = rootElement.querySelector(`[data-editTextArea='${postID}']`);
      editTextArea.style.display = 'inline';
      const saveEditBtn = rootElement.querySelector(`[data-saveEditPostButton='${postID}']`);
      saveEditBtn.style.display = 'inline';
      const contentTextPost = rootElement.querySelector(`[data-feedPostContent='${postID}']`);
      contentTextPost.style.display = 'none';
    }

    const saveEditBtn = target.dataset.saveeditpostbutton;
    if (saveEditBtn) {
      const newText = rootElement.querySelector(`[data-editTextArea='${postID}']`).value;
      editPost(newText, postID);
      loadPosts();
    }

    const cancelEditBtn = target.dataset.canceleditpostbutton;
    if (cancelEditBtn) {
      const editTextArea = rootElement.querySelector(`[data-editTextArea='${postID}']`);
      editTextArea.style.display = 'none';
      const hideSaveEditBtn = rootElement.querySelector(`[data-saveEditPostButton='${postID}']`);
      hideSaveEditBtn.style.display = 'none';
      const hideCancelEditBtn = rootElement.querySelector(`[data-cancelEditPostButton='${postID}']`);
      hideCancelEditBtn.style.display = 'none';
    }

    // Show Comments Section:
    const showCommentPostBtn = target.dataset.showcommentpostbutton;
    if (showCommentPostBtn) {
      const commentsSection = rootElement.querySelector(`[data-commentsSection="${postID}"]`);
      if (commentsSection.style.display !== 'flex') {
        commentsSection.style.display = 'flex';
        getComments(postID, printComments);
      } else {
        commentsSection.style.display = 'none';
      }
    }

    // Comment Post:
    const commentPostBtn = target.dataset.commentpostbutton;
    if (commentPostBtn) {
      const newCommentContent = rootElement.querySelector(`[data-commentContent="${postID}"]`).value;
      getCurrentCommentsToPrint(postID, newCommentContent, currentUserEmail,
        printComments, username, userImageUrl);
      rootElement.querySelector(`[data-commentContent="${postID}"]`).value = '';
    }

    // Delete Comment:
    const deleteCommentBtn = target.dataset.deletecommentbutton;
    if (deleteCommentBtn) {
      const commentID = target.dataset.deletecommentbutton;
      getCurrentCommentsToDelete(postIDForComments, commentID, printComments);
    }

    // Like Comment:
    const likeCommentBtn = target.dataset.likecommentbutton;
    if (likeCommentBtn) {
      const commentID = target.dataset.likecommentbutton;
      const valueToBeChanged = rootElement.querySelector(`[data-likeValueToChange="${commentID}"]`);
      const amountOfLikes = parseInt(valueToBeChanged.textContent, 10);
      const likeStatus = rootElement.querySelector(`[data-likeCommentButton="${commentID}"]`);
      getCurrentCommentLikes(postIDForComments, currentUserEmail, commentID, valueToBeChanged,
        amountOfLikes, likeStatus);
    }
  });

  const printComments = (commentsToPrint, postID) => {
    const commentArea = rootElement.querySelector(`[data-ulCommentArea="${postID}"]`);
    commentArea.innerHTML = '';
    commentsToPrint.forEach((comment) => {
      const currentDate = Math.round(Date.now() / 1000);
      const timeInSeconds = (currentDate - comment.creationDate);
      const commentAge = publicationAge(timeInSeconds);
      const newItem = `
      <li class='feed-comment-all-content' id="${comment.id}">
      <hr class='feed-comment-start-line'>
        <section class='feed-comment-owner-data'>
        <img class='feed-post-owner-picture' src='${comment.userImg}'>
        ${((user) => {
    if (user !== null) {
      return `<span class='feed-post-owner-name'> ${comment.userName}</span>`;
    } return `<span class='feed-post-owner-name'> Convidade </span>`;
  })(comment.userName)}
          <span class='feed-comment-data'> ${commentAge} </span>
        </section>
        <section class='feed-comment-content-section'>
          <p class='feed-comment-content'> ${comment.content} </p>
        </section>
        <section class='feed-comments-actions-section'>
      ${((likes) => {
    if (likes.length > 0) {
      if (likes.includes(currentUserEmail)) {
        return `<button class='btn btn-from-comment full-like-comment-btn' data-likeCommentButton='${comment.id}'></button> `;
      } return `<button class='btn btn-from-comment empty-like-comment-btn' data-likeCommentButton='${comment.id}'></button> `;
    } return `<button class='btn btn-from-comment empty-like-comment-btn' data-likeCommentButton='${comment.id}'></button> `;
  })(comment.likes)}
        <span class='feed-comment-amount-of-likes' data-likeValueToChange='${comment.id}'> ${comment.likes.length} </span>
      ${((user) => {
    if (user === currentUserEmail) {
      return `<button class='btn btn-from-comment delete-comment-btn' data-deleteCommentButton='${comment.id}'></button>`;
    } return `<button class='not-allowed-to-see'></button>
            `;
  })(comment.owner)}
      </section>
       
      </li>
      `;
      commentArea.innerHTML += newItem;
    });
  };

  function loadPosts() {
    rootElement.querySelector('#posts-section').innerHTML = '';
    getMyPosts(createAndPrintAllPosts);
  }

  function showPopupToDelete(postID, loadPosts) {
    const popup = rootElement.querySelector('.popup-wrapper');
    const fecharPopup = rootElement.querySelector('.fechar-popup');
    const conteudoPopup = rootElement.querySelector('.conteudo-popup');
    popup.style.display = 'block';
    conteudoPopup.innerHTML = ` <h2 class="msg-deletar">Tem certeza que deseja deletar sua postagem?</h2> 
 <p> <button type="button" class="btn-delete">Deletar</button> </p>`;
    fecharPopup.style.display = 'block';
    fecharPopup.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    conteudoPopup.querySelector('.btn-delete').addEventListener('click', () => {
      deletePost(postID, () => {
        removePostPage(postID);
      });

      popup.style.display = 'none';
    });
  }

  function removePostPage(postID) {
    const target = document.getElementById(postID);
    target.addEventListener('transitionend', () => target.remove());
    target.style.opacity = '0';
  }

  const goBackToFeed = () => {
    getTheRoad('/feed');
  };

  const goBackToProfileFeed = () => {
    getTheRoad('/profile');
  };
  const goBackToSettings = () => {
    getTheRoad('/settings');
  };

  const goBacklogin = () => {
    getTheRoad('/');
  };

  const iconHome = rootElement.querySelector('#home-btn');
  iconHome.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToFeed();
  });

  const iconPerson = rootElement.querySelector('#person-btn');
  iconPerson.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToProfileFeed();
  });

  const iconSettings = rootElement.querySelector('#settings-btn');
  iconSettings.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToSettings();
  });

  const iconsignout = rootElement.querySelector('#signout-btn');
  iconsignout.addEventListener('click', (event) => {
    event.preventDefault();
    goBacklogin();
  });

  loadPosts();
  return rootElement;
};
