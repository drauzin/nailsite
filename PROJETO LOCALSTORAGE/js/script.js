function fazerLogin() {
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(u => u.cpf === cpf && u.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        if (usuarioEncontrado.tipo === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'servicos.html';
        }
    } else {
        alert('CPF ou senha inválidos!');
    }

    return false; // impede o envio do formulário
}
