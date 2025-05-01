document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-login');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const cpf = document.getElementById('cpf').value.trim();
      const senha = document.getElementById('senha').value;

      if (!cpf || !senha) {
        alert('Por favor, preencha CPF e senha.');
        return;
      }

      fetch('https://nailsite.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('CPF ou senha inválidos.');
          }
          return res.json();
        })
        .then(usuario => {
          if (!usuario || !usuario.tipo) {
            alert('Erro: resposta inesperada do servidor.');
            return;
          }

          if (usuario.tipo === 'admin') {
            sessionStorage.setItem('adminId', usuario.id);
            window.location.href = 'painel.html';
          } else if (usuario.tipo === 'cliente') {
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            window.location.href = 'servicos.html';
          } else {
            alert('Tipo de usuário desconhecido.');
          }
        })
        .catch(err => {
          console.error('Erro ao fazer login:', err);
          alert('CPF ou senha incorretos.');
        });
    });
  }
});
