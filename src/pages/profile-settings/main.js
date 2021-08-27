export const SettingsProfile = () => {
  const container = document.createElement('div');
  container.innerHTML = ` 
        <header>
          <div class="logo-class"><img src="../images/logo-login.png"/></div>
        </header>   
        <main>
          <div class="upload">
                <input type="file" id="photo"></input>
                <div class="msg-carregando"></div>  
                <img src="${firebase.auth().currentUser.photoURL}" id="image"/>    
            </div>
            <div class="icon-img" id="photos">   
            <button class="btn-foto-class"></button>  
  
            </div>
            <div class="inputs-class">
                <div class="input-label">
                    <input required type="text" class="input-name" id="name-id" placeholder=" " autocomplete="off">
                    <label for="input-name" class="name-input-label" id="label-input-id">Nome</label>
                    <input required type="text" class="input-user" id="name-user" placeholder=" " autocomplete="off">
                    <label for="input-user" class="user-input-label" id="label-input-user">Nome de usuário</label>
                </div>
                <div class="btn-profile-save">
                    <button class="btn-class" id="btn-save">Salvar</button>
                </div>
                <p class="p-save-changes" id="p-save-changes" hidden>Alterações salvas com sucesso!</p>
            </div>
            
        </main> 
        <footer> Not Alone &#169;</footer>
        <div class="popup-wrapper">
            <div class="popup">
            <div class="fechar-popup"><i class="far fa-times-circle"></i></div>
            <div class="conteudo-popup">
                <h2>Cadastro finalizado com sucesso!</h2>
                <button id="feed-id"><a href="/#">Feed</a></button>
                <button id="profile-id"><a href="/#">Perfil</a></button>
            </div>
            </div>
        </div>
              `;

  // aparecer o escolher foto
  const botaoFoto = container.querySelector('.btn-foto-class');
  const inputPic = container.querySelector('#photo');
  botaoFoto.addEventListener('click', () => {
    inputPic.style.opacity = 1;
  });

  const currentProfileImage = container.querySelector('#image');
  const inputPhoto = container.querySelector('#photo');
  const inputName = container.querySelector('#name-id');
  const confirmMessage = container.querySelector('#p-save-changes');
  const btnSaveProfile = container.querySelector('#btn-save');
  //        const btnGoBackToFeed = container.querySelector('#btn-back-to-feed');

  //         showUserImage(currentProfileImage);

  inputPhoto.addEventListener('change', (event) => {
    const changeProfileImage = (photo, callback) => {
      const file = photo.files[0];
      const storageRef = firebase.storage().ref(`imagens/ + ${file.name}`);
      storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then((url) => {
          callback(url);
        });
      });
    };
    currentProfileImage.src = '';
    const file = event.target.files[0];
    currentProfileImage.src = URL.createObjectURL(file);

    const turnAnUrlValid = (url) => {
      currentProfileImage.src = '';
      currentProfileImage.src = url;
    };
    changeProfileImage(inputPhoto, turnAnUrlValid);
  });

  btnSaveProfile.addEventListener('click', (event) => {
    event.preventDefault();
    const updateUserProfile = (name, url) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: name,
        photoURL: url,
      }).then(() => {
        console.log('Perfil atualizado');
        const popup = container.querySelector('.popup-wrapper');
        const fecharPopup = container.querySelector('.fechar-popup');
        const conteudoPopup = container.querySelector('.conteudo-popup');
        popup.style.display = 'block';
        conteudoPopup.innerHTML = ` <h2>Alterações salvas!</h2>
                        <button id="feed-id"><a href="/feed">Feed</a></button>
                        <button id="profile-id"><a href="/profile">Perfil</a></button>`;
        fecharPopup.style.display = 'block';
        fecharPopup.addEventListener('click', () => {
          popup.style.display = 'none';
        });
      }).catch((error) => {
        getError(error);
      });
    };
    updateUserProfile(inputName.value, currentProfileImage.src);
    confirmMessage.hidden = false;
    container.style.display = 'block';
  });

  /*    btnGoBackToFeed.addEventListener('click', (event) => {
                  event.preventDefault();
                  const showUserImage = (currentProfileImage) => {
                    firebase.auth().onAuthStateChanged((user) => {
                      if (user != null) {
                        currentProfileImage.src = user.photoURL;
                      } else {
                        currentProfileImage.src = '../../images/eye.png';
                      }
                    });
                  };
                  goBackToFeed();
                }); */

  container.querySelector('.icon-img').addEventListener('click', (event) => {
    event.preventDefault();
    const btnfile = container.querySelector('#photo');
    btnfile.style.visibility = 'visible';
  });

  return container;
};
