/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { deletePost, getMyPosts, editPost } from '../../lib/firebase-services.js';
import {
  updateLikes, getComments, getCurrentCommentsToPrint, publicationAge
} from '../feed/index.js';

export const PersonalFeed = () => {
  const rootElement = document.createElement('div');
  rootElement.innerHTML = ` 
  <main class="pagina-personal-feed" id="topo">
      <header class="container-header">
          <div class="foto-personal-feed">
            
            <img class="foto-personal" src="${firebase.auth().currentUser.photoURL}" onerror="this.src='../images/avatar2.png'; this.onerror=null"/>
            <h3 class="titulo">Olá, <span class="nome">${firebase.auth().currentUser.displayName}<span></h3>
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
            <li><button class='btn home-btn'></button></li>
            <li><button class='btn night-btn'></button></li>
            <li><button class='btn search-btn'></button></li>
            <li><button class='btn settings-btn'></button></li>
            <li><button class='btn signout-btn'></button></li>
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

  function createPostTemplate(post) {
    const currentDate = Date.now();
    const timeInSeconds = ((currentDate - post.data().creationDate) / 1000);
    const postAge = publicationAge(timeInSeconds);

    const postTemplate = `
        <div class="feed-all-the-post" data-postId="${post.id}" data-postOwner="${post.data().user_id}">
          <section class='feed-post-owner-data'>
            <img class='feed-post-owner-picture' src="${firebase.auth().currentUser.photoURL}" onerror="this.src='../images/avatar2.png'; this.onerror=null" />
            <span class='feed-post-owner-name'> ${firebase.auth().currentUser.displayName || post.data().user_id} em: </span>
            <span class='feed-post-data'> ${postAge} </span>
          </section>
          <section class='feed-post-content-section'>
            <p class='feed-post-content' data-feedPostContent='${post.id}'> ${post.data().text} </p>
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
              <span data-likeValueToChange='${post.id}'> ${post.data().likes.length} </span>
              <button class='btn comment-btn' data-showCommentPostButton='${post.id}'></button>
            </div>
            <div class='feed-post-actions-right-section'>
            <button class='btn save-edit-btn' data-saveEditPostButton='${post.id}'></button>
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
      contentTextPost.style.display = "none";

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
      getCurrentCommentsToPrint(postID, newCommentContent, currentUserEmail, printComments);
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
          <img class='feed-comment-owner-picture' src='../images/bunny.jpg'>
          <span class='feed-comment-owner-name'> ${comment.owner}</span>
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

  loadPosts();
  return rootElement;
 };
