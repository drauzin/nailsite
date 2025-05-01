document.querySelector('#loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const cpf = document.querySelector('#cpf').value;
    const senha = document.querySelector('#senha').value;
  
    const response = await fetch('https://nailsite.onrender.com/usuario/' + cpf);
    const usuario = await response.json();
  
    if (usuario && usuario.senha === senha) {
      alert('Login bem-sucedido!');
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario)); // Salvar no localStorage
      window.location.href = 'painel.html';
    } else {
      alert('Usuário ou senha incorretos');
    }
  });
  