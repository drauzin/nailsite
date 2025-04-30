document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();
  
    if (!nome || !cpf || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  
    const cpfExistente = usuarios.find(usuario => usuario.cpf === cpf);
  
    if (cpfExistente) {
      alert('CPF já cadastrado.');
      return;
    }
  
    const novoUsuario = {
      id: Date.now().toString(),
      nome,
      cpf,
      senha
    };
  
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
  });
  