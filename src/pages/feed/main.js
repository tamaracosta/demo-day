import {
  getPosts,
} from '../../lib/firebase-services.js';
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
  <main>
    <form action = ""  id="postForm" class='feed-publication-form'>
      <textarea class='feed-publication-text-area' id='publication-text-area' placeholder='O que você quer publicar hoje?'></textarea> 
      <input class='feed-hide-url-in-text-area' id='hide-url-in-text-area> </input>
      <section class='feed-publication-buttons-area'>
        <button class='btn feed-publication-image-btn' id='publication-image-btn'></button>
        <form method="post">
          <input class='feed-choose-an-image-btn' id='choose-an-image-btn' type="file" accept=".jpg, .jpeg, .png">
          <button class='feed-publication-publish-btn' id='publication-of-all-content-btn'> PUBLICAR </button>
        </form>
    
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
    <section class='feed-post-owner-data'>
      <img class='feed-post-owner-picture'>
      <span class='feed-post-owner-name'>
      <p class="user-post"> ${post.data().user_id} <br>${post.data().data} </p>
      <div class="data-post-id" data-postid="${post.id}" data-postOwner="${post.data().user_id}">
      <p class="txt"> ${post.data().text} </p>
      <textarea class='edit-text-area' data-edit-text-area='${post.id}' hidden>${post.data().text}</textarea>
      <span class='feed-post-data'>
    </section>
    <section class='feed-post-content-section'>
      <p class='feed-post-content'></p>
      <img class='feed-post-image'> </img>
    </section>
    <section class='feed-post-actions-section'>
      <div class='feed-post-actions-left-section'>
        <button> Like </button>
        
        <button> Comment </button>
      </div>
    <div class='feed-post-actions-right-section'>
      <button> Edit</button>
      <button> Delete </button>
    </div>
    `;
    return postTemplate;
  }

  function createAndPrintAllPosts(post) {
    const postElement = document.createElement('div');
    postElement.id = post.id;
    postElement.classList.add('feed-a-post');
    //rootElement.querySelector('#hide-url-in-text-area').value = '';
    const postTemplate = createPostTemplate(post);
    postElement.innerHTML = postTemplate;
    rootElement.querySelector('#posts-section').appendChild(postElement);
  }

  function loadPosts() {
    getPosts(createAndPrintAllPosts);
  }

  const postData = () => {
    const data = new Date();
    return data.toLocaleString('pt-BR');
  };


  rootElement.querySelector('#postForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const textArea = rootElement.querySelector('#publication-text-area');
    const postContent = rootElement.querySelector('#publication-text-area').value;
    //const postImageUrl = rootElement.querySelector('#hide-url-in-text-area').value;

    const post = {
      text: postContent,
      //url: postImageUrl,
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

  return rootElement;
};
