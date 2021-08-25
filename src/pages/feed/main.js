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
    <form class='feed-publication-form'>
      <textarea class='feed-publication-text-area' id='publication-text-area' placeholder='O que você quer publicar hoje?'></textarea> 
      <section class='feed-publication-buttons-area'>
        <button class='btn feed-publication-image-btn'></button>
        <form method="post">
          <input class='feed-choose-an-image-btn' type="file" accept=".jpg, .jpeg, .png">
        </form>
        <button class='feed-publication-publish-btn' id='publication-btn'> PUBLICAR </button>
      </section>
    </form>  
    <section class='feed-posts-section' id='posts-section'></section>
  </main>
  <footer><footer>
  `;
  return rootElement;
};
