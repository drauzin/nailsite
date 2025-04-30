document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio do formulário

  const cpfLogin = document.getElementById('cpfLogin').value;
  const senhaLogin = document.getElementById('senhaLogin').value;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se o CPF e a senha estão corretos
  const usuario = usuarios.find(usuario => usuario.cpf === cpfLogin && usuario.senha === senhaLogin);

  if (usuario) {
      // Salva o usuário logado no localStorage
      localStorage.setItem('clienteLogado', JSON.stringify(usuario));
      alert('Login realizado com sucesso!');
      window.location.href = 'servicos.html';
  } else {
      alert('CPF ou senha incorretos.');
  }
});
