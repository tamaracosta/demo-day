import {
  loginWithGoogle,
} from '../../lib/firebase-services.js';

export const Login = () => {
  const rootElement = document.createElement('div');
  rootElement.className = 'login-container';
  rootElement.innerHTML = `
  <section class="login-left-section">
  <main>
    <div class=img-login>
      <img src="../images/logo-login.png"/>
    </div>
    <form>
      <div class="div-email" id="div-email">
        <input required type="email" class="input-email" id="input-email" placeholder=" " autocomplete="off">
        <label for="input-email" class="login-input-label" id="label-input-email">Email</label>
      </div>
      <div class="div-password" id="div-password">
        <input required type="password" class="input-password" id="input-password" placeholder=" " autocomplete="off">
          <img class="eye" id="eye" src="../images/eye-off.png"/>
          <label for="input-password" class="login-input-label">Senha</label> 
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
    <p class="connect">Ou conecte-se com</p>
    <div class="enter-icons">
        <button id="btn-login-with-google"><img src="../images/google-btn.png"> </button>
        <button id="btn-login-with-insta"> <img src="../images/insta-btn.jpeg"></button>
        <button id='btn-login-with-facebook'><img src="../images/face-btn.jpeg"></button>
    </div>
  </main>
  <footer> Not Alone &#169;</footer>
</section> 
    `;

    const getUserEmail = rootElement.querySelector('#input-email');
    const getUserPassword = rootElement.querySelector('#input-password');
    const checkboxKeepLoggedIn = rootElement.querySelector('#checkbox-keep-logged-in');
  
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

  return rootElement;
};

/* <div class="login-additionals">
      <button id="btn-login-with-google"> Ou conecte-se com o gmail</button>
      <br>
      <button id="btn-forgot-password"> Esqueceu a senha?</button>
    </div> */


