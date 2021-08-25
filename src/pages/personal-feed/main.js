export const PersonalFeed = () => {
  const main = document.createElement('div');
  main.innerHTML = ` 
  <main class="pagina-personal-feed">
      <header class="container-header">
          <div class="foto-personal-feed"></div>
          <h1 class="titulo">Feed da Rihanna</h1>
      </header>
      <div class="minhas-publicacoes">
          <div class="texto">Oi amigas, queria dicas de como fazer arroz pois o meu fica sempre muito empapado!! </div>
          <div class="imagem"><img src="../images/prato.png" alt=""> </div>
          <div class="container">
              <div class="icones-interacao">
                  <span class="icones"><i class="far fa-heart icone-curtir"></i></span>
                  <span class="icones"><i class="far fa-comment-alt icone-comentar"></i></span>
              </div>
              <div class="icones-acao">
                  <span class="icones"><i class="fas fa-pen editar-publicacao" title="Editar"></i></span>
                  <span class="icones"><i class="fas fa-trash-alt icone-deletar" title="Excluir"></i></span>
              </div>
          </div>
      </div>
      
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
      
      `
  // Deletar post

  const deletar = main.querySelector('.icone-deletar')
  deletar.addEventListener('click', () => {

      const popup = main.querySelector('.popup-wrapper');
      const fecharPopup = main.querySelector('.fechar-popup');
      const conteudoPopup = main.querySelector('.conteudo-popup');
      popup.style.display = 'block';
      conteudoPopup.innerHTML = ` <h2 class="msg-deletar">Tem certeza que deseja deletar sua postagem?</h2> 
   <p> <button type="button" class="btn-delete">Deletar</button> </p>`;
      fecharPopup.style.display = 'block';
      fecharPopup.addEventListener("click", () => {
          popup.style.display = 'none';
      });
      // const button = main.querySelector('.delete-class')
      // button.addEventListener('click', () => {
      //     const postCollection = firebase.firestore().collection("posts")
      //     postCollection.doc(post.id).delete().then(doc => {
      //         postTemplate.style.display = "none"
      //     })
      // })

  });

  return main;



};