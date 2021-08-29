/* eslint-disable quotes */
import { getTheRoad } from '../../lib/firebase-services.js';

export const SettingsProfile = () => {
  const container = document.createElement('div');
  container.innerHTML = ` 
        <header>
          <div class="logo-class logo"><img src="../images/logo-login.png"/></div>
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
                    <label for="input-name" class="name-input-label" id="label-input-id">Nome ou Nome de Usuárie</label>
                    <input required type="text" class="input-user" id="name-user" placeholder=" " autocomplete="off">
                
                </div>
                <div class="btn-profile-save">
                    <button class="btn-class" id="btn-save">SALVAR</button>
                </div>
                <p class="p-save-changes" id="p-save-changes" hidden>Alterações salvas com sucesso!</p>
            </div>
            
        </main> 
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
        console.log(error);
      });
    };
    updateUserProfile(inputName.value, currentProfileImage.src);
    confirmMessage.hidden = false;
    container.style.display = 'block';
  });

  container.querySelector('.icon-img').addEventListener('click', (event) => {
    event.preventDefault();
    const btnfile = container.querySelector('#photo');
    btnfile.style.visibility = 'visible';
  });

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

  const iconHome = container.querySelector('#home-btn');
  iconHome.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToFeed();
  });

  const iconPerson = container.querySelector('#person-btn');
  iconPerson.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToProfileFeed();
  });

  const iconSettings = container.querySelector('#settings-btn');
  iconSettings.addEventListener('click', (event) => {
    event.preventDefault();
    goBackToSettings();
  });

  const iconsignout = container.querySelector('#signout-btn');
  iconsignout.addEventListener('click', (event) => {
    event.preventDefault();
    goBacklogin();
  });

  return container;
};
