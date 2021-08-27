/* eslint-disable no-plusplus */
import {
  getPosts, editPost, deletePost, sendImageToDatabase, filterPosts,
} from '../../lib/firebase-services.js';

import {
  updateLikes, getComments, getCurrentCommentsToPrint, getCurrentCommentsToDelete,
  getCurrentCommentLikes, publicationAge,
} from './index.js';

// Template Feed:
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
  <main class='feed-main'>
    <form class='feed-publication-form'>
      <select name='category' id='post-category' required>
        <option selected disable>Categoria</option>
        <option value="recipes">Receitas</option>
        <option value="kitchenTips">Dicas de Cozinha</option> 
        <option value="fixing">Manutenção</option>  
        <option value="decoration">Decoração</option>      
      </select>
      <textarea class='feed-publication-text-area' id='publication-text-area' placeholder='O que você quer publicar hoje?'></textarea> 
      <section class='feed-publication-buttons-area'>
        <input class="feed-hide-url" id="hide-url"> </input>
        <div class='share-area-buttons'>
          <button id='publish-img-btn' class='publish-img-btn'></button>
          <div class='publish-img-form-box'>
            <form method="post">
              <input type="file" id="image_uploads" class='share-area-img-btn' accept=".jpg, .jpeg, .png">
            </form>
          </div>
          <button class='feed-publication-publish-btn' id='publication-of-all-content-btn'> PUBLICAR </button>
        </div>
      </section>
    </form>  
    <section class='feed-search-section'> 
      <input class='feed-search-input' id='feed-post-search' placeholder='Pesquise aqui'> </input>
      <button class='btn filter-btn' id='show-filters'></button>
      <select name='category' id='filter-post-category'>
        <option selected disable>Categoria</option>
        <option value="all">Todas</option>
        <option value="recipes">Receitas</option>
        <option value="kitchenTips">Dicas de Cozinha</option> 
        <option value="fixing">Manutenção</option>  
        <option value="decoration">Decoração</option>      
      </select>
    </section>
    <section class='feed-posts-section' id='posts-section'></section>
  </main>
  <footer><footer>
  `;

  const postsCollection = firebase.firestore().collection('posts');
  const currentUserEmail = firebase.auth().currentUser.email;

  // Template Post:
  function createPostTemplate(post) {
    const currentDate = Date.now();
    const timeInSeconds = ((currentDate - post.data().creationDate) / 1000);
    const postAge = publicationAge(timeInSeconds);
    const postTemplate = `
    <div class="feed-all-the-post" data-postId="${post.id}" data-postOwner="${post.data().user_id}">
      <section class='feed-post-owner-data'>
        <img class='feed-post-owner-picture' src='../images/bunny.jpg'>
        <span class='feed-post-owner-name'> ${post.data().user_id}</span>
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
          <button class='btn comment-btn' data-showCommentPostButton='${post.id}'></button>
        </div>
        <div class='feed-post-actions-right-section'>
      ${((user) => {
    if (user === currentUserEmail) {
      return `<button class='btn edit-btn' data-editPostButton='${post.id}'></button>
              <button class='btn save-edit-btn' data-saveEohditPostButton='${post.id}'></button>
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
    <hr class='feed-post-end-line'>
    `;
    return postTemplate;
  }

  const showUrlOfImagesToPublish = (urlFile) => {
    rootElement.querySelector('#hide-url').value = `${urlFile}`;
  };

  const uploadImage = () => {
    rootElement.querySelector('.publish-img-form-box').style.opacity = 1;
    rootElement.querySelector('#image_uploads').onchange = (event) => {
      sendImageToDatabase(event.target.files[0], showUrlOfImagesToPublish);
      rootElement.querySelector('.publish-img-form-box').style.opacity = 0;
      rootElement.querySelector('.feed-publication-text-area').placeholder = 'Imagem carregada';
    };
  };

  const imageToUpload = rootElement.querySelector('#image_uploads');

  const getUpLoadImgClick = () => {
    rootElement.querySelector('#publish-img-btn').addEventListener('click', (event) => {
      event.preventDefault();
      uploadImage();
      imageToUpload.style.opacity = 1;
    });
  };
  getUpLoadImgClick();

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
    const postImageUrl = rootElement.querySelector('#hide-url').value;
    const postCategory = rootElement.querySelector('#post-category').value;

    const post = {
      text: postContent,
      url: postImageUrl,
      user_id: currentUserEmail,
      category: postCategory,
      data: postData(),
      likes: [],
      comments: [],
      creationDate: Date.now(),
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
  // Comment template:
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

  // Action Buttons:
  const postsSection = rootElement.querySelector('#posts-section');
  postsSection.addEventListener('click', (e) => {
    const { target } = e;
    const postID = target.parentNode.parentNode.parentNode.parentNode.id;
    const postIDForComments = target.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode.parentNode.id;

   /* // Delete Post:
    const deletePostBtn = target.dataset.deletepostbutton;
    if (deletePostBtn) {
      deletePost(postID, loadPosts);
    }
 */

    
    if (target.dataset.item === 'deletepost') {

  const divConfirmDelete = target.parentNode.parentNode.parentNode.children[4];
  const divConfirmDeleteModal = target.parentNode.parentNode.parentNode.children[4].children[0].children[1];
  const divCancelDeleteModal = target.parentNode.parentNode.parentNode.children[4].children[0].children[2];
  divConfirmDelete.style.display = 'block';
  divConfirmDeleteModal.addEventListener('click', () => {
    deletePost(postID, loadPosts);
    divConfirmDelete.style.display = 'none';
  });
  divCancelDeleteModal.addEventListener('click', () => {
    divConfirmDelete.style.display = 'none';
  });
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
      const cancelEditBtn = rootElement.querySelector(`[data-cancelEditPostButton='${postID}']`);
      cancelEditBtn.style.display = 'inline';
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

  // Filter Post Category:
  const postCategorySelector = rootElement.querySelector('#filter-post-category');
  postCategorySelector.addEventListener('change', () => {
    const postCategoryValue = postCategorySelector.value;
    rootElement.querySelector('#posts-section').innerHTML = '';
    filterPosts(postCategoryValue, createAndPrintAllPosts);
  });

  // Post Search:
  function filterWord() {
    const filterValue = rootElement.querySelector('#feed-post-search').value.toUpperCase();
    const printedPosts = rootElement.querySelector('#posts-section');
    const postsContents = printedPosts.getElementsByClassName('feed-post-content');
    const getPost = document.getElementsByClassName('feed-a-post');
    for (let i = 0; i < postsContents.length; i++) {
      const filteredPost = postsContents[i];
      if (filteredPost.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
        postsContents[i].style.display = '';
        getPost[i].style.display = '';
      } else {
        postsContents[i].style.display = 'none';
        getPost[i].style.display = 'none';
      }
    }
  }

  const searchInput = rootElement.querySelector('#feed-post-search');
  searchInput.addEventListener('keyup', filterWord);

  loadPosts();
  return rootElement;
};
