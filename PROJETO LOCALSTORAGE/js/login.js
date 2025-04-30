document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // CPF e senha do Admin
    const cpfAdmin = '00000000000';  // CPF do admin
    const senhaAdmin = '0';          // Senha do admin

    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(usuario => usuario.cpf === cpf && usuario.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado)); // Mantém o nome 'usuarioLogado'

        if (cpf === cpfAdmin && senha === senhaAdmin) {
            // Se for administrador
            window.location.href = 'painel.html';
        } else {
            // Caso contrário, vai para servicos.html
            window.location.href = 'servicos.html';
        }
    } else {
        alert('CPF ou senha incorretos!');
    }
});
