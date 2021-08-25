export const SettingsProfile = () => {
    const container = document.createElement('div');
    container.innerHTML = ` 
        <header>
            <h1 class="logo"> <p>Not</p> <p>Alone</p></h1>
        </header>   
        <main>
            <div class="upload">
                <input type="file" id="photo"></input>
                <div class="msg-carregando"></div>  
                <img id="image"/>             
            </div>
            <div class="icon-img" id="photo">               
                <img src="icon-camera.png" class="icon-class">
            </div>
            <div class="inputs-class">
                <input type="text" id="name-id" placeholder="Nome"/>   
                <input type="text" id="name-user" placeholder="Nome de Usuário"/>
                <div class="btn-profile-save">
                    <button class="btn-class" id="btn-save">Salvar</button>
                </div>
            </div>
          

        </main> 
            `

            const upload = container.querySelector('#photo');
      
            upload.addEventListener('change', () => {
                const msgImg = container.querySelector('.msg-carregando');
    
                msgImg.innerHTML = 'Carregando imagem...';
            
                const ref = firebase.storage().ref('imagens/perfil');
                //ref caminho onde ira salvar a imagem
                const file = container.querySelector('#photo').files[0];
                //file 
                const name = `${new Date()}-${file.name}`;
                const metadata = {
                    contentType: file.type,
                };
                const task = ref.child(name).put(file, metadata);
                //child nomeia a imagem
                //put comando q faz o upload da imagem
                task
                    .then((snapshot) => snapshot.ref.getDownloadURL())
                    .then((url) => {
                        console.log('deu certo')
                        msgImg.innerHTML = ''
                        const image = container.querySelector('#image');
                        image.src = url;                    
                        
                    });
                })

    return container;
};

