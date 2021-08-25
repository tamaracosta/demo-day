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
          <label for="input-name"class="login-input-label">Nome</label>
        </div>
        <div class="div-email">
          <input required type="email" class="input-email" id="input-email" placeholder=" " autocomplete="off">
          <label for="input-email" class="login-input-label" id="label-input-email">Email</label>
        </div>
        <div class="div-password" class='div-password'>
          <input required type="password" class='input-password'id="input-password" placeholder=" " autocomplete="off">
          <img class="icon-eye" id="icon-eye" src="../images/eye-off.png"/>
          <label class="login-input-label">Senha</label> 
        </div>
        <div class="div-confirm-password">
            <input required type="password" class='input-confirm-password' id="input-confirm-password" placeholder=" " autocomplete="off">
            <img class="icon-eye" id="icon-eye" src="../images/eye-off.png"/>
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
  return rootElement;
};
