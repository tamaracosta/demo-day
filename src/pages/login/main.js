import {
  loginWithGoogle, loginWithEmailAndPassword, getTheRoad, resetPassword,
 } from '../../lib/firebase-services.js';
  
 export const Login = () => {
  const rootElement = document.createElement('div');
  rootElement.className = 'login-container';
  rootElement.innerHTML = `
   <main>
    <div class=img-login>
      <img src="../images/logo-login.png">
    </div>
    <form>
      <div class="div-email" id="div-email">
        <input required type="email" class="input-email" id="input-email" placeholder=" " autocomplete="off">
        <label for="input-email" class="login-input-label" id="label-input-email">Email</label>
      </div>
      <div class="div-password" id="div-password">
        <input required type="password" class="input-password" id="input-password" placeholder=" " autocomplete="off">
          <img class="eye" id="eye" src="../images/eye-off.png">
          <label for="input-password" class="login-input-label">Senha</label>
        </div>
        <div class='checkbox-forgot-password'>
        <input type="checkbox" id="checkbox-keep-logged-in">
        <label for="checkbox-keep-logged-in" class="checkbox-keep-logged-in"> Mantenha-me logada</label>
      <button id="btn-forgot-password"> Esqueceu a senha?</button>
    </div>
      </div>
     
    </form>
    <div class="login-error-div" id="print-error-here">
      <p class="transparent"> . </p>
    </div>
    <div class="login-btn-sig-log">
      <button id="btn-login" class="btn-login">ENTRAR</button> 
    </div>
    <div class="register-new-user">
        Não possui conta? <button id="btn-sign-in">Registre-se</button>
    </div>
    <p class="connect"> Ou conecte-se com </p>
    <div class="enter-icons">
        <button id="btn-login-with-google"><img src="../images/google-btn.png"></button>
    </div>
    <div class='alert-reset' id='alert-reset'>
    <div class='modal-reset' id='modal-reset'>
    <p class='h1-modal' id='h1-modal'>Um link foi enviado para o seu email.</p>
    <button class='button-modal' id='confirm-modal'>Entendi</button>
    </div>

  
 </div>


</div>

  </main>
  <footer> Not Alone &#169;</footer>
    `;
  
    // <button id='btn-login-with-insta' hidden> <img src="../images/insta-btn.jpeg"></button>
    // <button id='btn-login-with-facebook' hidden ><img src="../images/face-btn.jpeg"></button>
  const getUserEmail = rootElement.querySelector('#input-email');
  const getUserPassword = rootElement.querySelector('#input-password');
  const checkboxKeepLoggedIn = rootElement.querySelector('#checkbox-keep-logged-in');
  
  const btnSignIn = rootElement.querySelector('#btn-sign-in');
  btnSignIn.addEventListener('click', () => {
    getTheRoad('/register');
  });
  
  getUserEmail.addEventListener('keyup', (event) => {
    const labelEmail = rootElement.querySelector('#label-input-email');
    const inputEmailValue = event.target.value;
    if (inputEmailValue.length > 1) {
      labelEmail.classList.add('login-input-label-up');
    }
  });
  
  const btnLoginWithGoogle = rootElement.querySelector('#btn-login-with-google');
  btnLoginWithGoogle.addEventListener('click', () => {
    loginWithGoogle(checkboxKeepLoggedIn);
  });
  
  const btnLogin = rootElement.querySelector('#btn-login');
  btnLogin.addEventListener('click', () => {
    const userEmail = getUserEmail.value;
    const userPassword = getUserPassword.value;
    loginWithEmailAndPassword(userEmail, userPassword, checkboxKeepLoggedIn);
  });
  
  const btnResetPassword = rootElement.querySelector('#btn-forgot-password');
  btnResetPassword.addEventListener('click', () => {
    const userEmail = getUserEmail.value;
    const alertReset = rootElement.querySelector('#alert-reset');
    const btnModal = rootElement.querySelector('#confirm-modal');
    resetPassword(userEmail)
    alertReset.style.display = 'block';
    btnModal.addEventListener('click', () => {
      alertReset.style.display = 'none';
    });
  });
  
  const passwordContainer = rootElement.querySelector('#div-password');
  const eyeIcon = rootElement.querySelector('#eye');
  eyeIcon.addEventListener('click', () => {
    passwordContainer.classList.toggle('visible');
    if (passwordContainer.classList.contains('visible')) {
      eyeIcon.src = './/images/eye.png';
      getUserPassword.type = 'text';
    } else {
      eyeIcon.src = './images/eye-off.png';
      getUserPassword.type = 'password';
    }
  });
  return rootElement;
 };
 