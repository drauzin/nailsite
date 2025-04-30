document.getElementById('formCadastroCliente').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio do formulário para processar o cadastro manualmente

    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nomeCliente').value.trim();
    const cpf = document.getElementById('cpfCliente').value.trim();
    const numero_celular = document.getElementById('celularCliente').value.trim();
    const senha = document.getElementById('senhaCliente').value.trim();

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        alert('O CPF deve conter exatamente 11 dígitos.');
        return;
    }

    // Verifica se o celular está no formato correto
    const celularRegex = /\(\d{2}\)\s\d{5}-\d{4}/;
    if (!celularRegex.test(numero_celular)) {
        alert('O celular deve estar no formato (XX) XXXXX-XXXX.');
        return;
    }

    // Verifica se os campos obrigatórios não estão vazios
    if (!nome || !cpf || !senha || !numero_celular) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    // Enviar dados para o servidor via fetch
    fetch('http://localhost:3000/usuario/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            cpf: cpf,
            numero_celular: numero_celular,
            senha: senha
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.message === 'Cliente cadastrado com sucesso!') {
                window.location.href = 'painel.html';
            }
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Ocorreu um erro ao cadastrar o cliente.');
    });
});

document.getElementById('cancelarCadastro').addEventListener('click', function () {
    // Redireciona para a página painel.html
    window.location.href = 'painel.html';
});
