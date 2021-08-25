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
      <textarea class='feed-publication-text-area' id='publication-text-area' rows='15' placeholder='O que você quer publicar hoje?'></textarea> 
      <section class='feed-publication-buttons-area'>
        <form method="post">
          <input type="file" accept=".jpg, .jpeg, .png">
        </form>
        <button class='feed-publication-publish-btn' id='publication-btn'> Publicar </button>
      </section>
    </form>  
    <section class='feed-posts-section' id='posts-section'></section>
  </main>
  <footer><footer>
  `;
  return rootElement;
};
