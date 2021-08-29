import {
  registerAccount,
} from '../../lib/firebase-services.js';

export const Register = () => {
  const rootElement = document.createElement('div');
  rootElement.classList.add('register-container');
  rootElement.innerHTML = `
    <main>
      <div class='img-login'>
        <img class="img-logo" src="../images/logo-login.png">
      </div>
      <form>
          <section class="content">
        <div class="div-name">
          <input required type="text" class='input-name'id="input-name" placeholder=" " autocomplete="off">
          <label for="input-name"class="login-input-label register-input-label">Nome</label>
        </div>
        <div class="div-email">
          <input required type="email" class="input-email" id="input-email" placeholder=" " autocomplete="off">
          <label for="input-email" class="login-input-label register-input-label" id="label-input-email">Email</label>
        </div>
        <div class="div-password">
          <input required type="password" class='input-password'id="input-password" placeholder=" " autocomplete="off">
          <img class="icon-eye" id="icon-eye" src="../images/eye-off.png"/>
          <label class="login-input-label">Senha</label> 
        </div>
        <div class="div-confirm-password">
            <input required type="password" class='input-confirm-password' id="input-confirm-password" placeholder=" " autocomplete="off">
            <img class="icon-eye" id="icon-eye-confirm" src="../images/eye-off.png"/>
            <label class="login-input-label">Confirme a senha</label> 
          </div>
          </section>
          <div class="checkbox-div">
        <input type="checkbox" class="checkbox-keep-logged-in" id="checkbox-keep-logged-in">
        <label for="checkbox-keep-logged-in" class="checkbox-keep"> Mantenha-me logada </label>
          </div>
      </form>
      <div id="print-error-here"> 
        <p class="transparent"> . </p>
      </div>
      <div class="register-btn-register">
        <button id="btn-register-account">REGISTRAR</button>
      </div>
    </main>
    <footer class="register-footer"> Not Alone ©</footer>
    `;

  const getUserEmail = rootElement.querySelector('#input-email');
  const getUserPassword = rootElement.querySelector('#input-password');
  const getUserConfirmPassword = rootElement.querySelector('.input-confirm-password');

  getUserEmail.addEventListener('keyup', (event) => {
    const labelEmail = rootElement.querySelector('#label-input-email');
    const inputValue = event.target.value;
    if (inputValue.length > 1) {
      labelEmail.classList.add('login-input-label-up');
    }
  });

  const registerAccountBtn = rootElement.querySelector('#btn-register-account');
  registerAccountBtn.addEventListener('click', () => {
    const userName = rootElement.querySelector('#input-name').value;
    const userEmail = getUserEmail.value;
    const userPassword = getUserPassword.value;
    if (getUserPassword.value !== getUserConfirmPassword.value) {
      alert('as senhas não conferem');
    } else {
      const checkboxKeepLoggedIn = rootElement.querySelector('#checkbox-keep-logged-in');
      registerAccount(userEmail, userPassword, userName, checkboxKeepLoggedIn);
    }
  });

  const passwordContainer = rootElement.querySelector('.div-password');
  const eyeIcon = rootElement.querySelector('#icon-eye');
  eyeIcon.addEventListener('click', () => {
    passwordContainer.classList.toggle('visible');
    if (passwordContainer.classList.contains('visible')) {
      eyeIcon.src = './/images/eye.png';
      getUserPassword.type = 'text';
    } else {
      eyeIcon.src = './/images/eye-off.png';
      getUserPassword.type = 'password';
    }
  });

  const passwordConfirmContainer = rootElement.querySelector('.div-confirm-password');
  const eyeIconConfirm = rootElement.querySelector('#icon-eye-confirm');
  eyeIconConfirm.addEventListener('click', () => {
    passwordConfirmContainer.classList.toggle('visible');
    if (passwordConfirmContainer.classList.contains('visible')) {
      eyeIconConfirm.src = './/images/eye.png';
      getUserConfirmPassword.type = 'text';
    } else {
      eyeIconConfirm.src = './/images/eye-off.png';
      getUserConfirmPassword.type = 'password';
    }
  });

  return rootElement;
};
