// Formatação do celular para o padrão (XX) XXXXX-XXXX
document.getElementById('celularCliente').addEventListener('input', function (e) {
    let celular = e.target.value;

    // Remove todos os caracteres que não são números
    celular = celular.replace(/\D/g, '');

    // Adiciona a formatação conforme o padrão (XX) XXXXX-XXXX
    if (celular.length <= 2) {
        celular = celular.replace(/(\d{2})/, '($1');
    } else if (celular.length <= 7) {
        celular = celular.replace(/(\d{2})(\d{5})/, '($1) $2');
    } else {
        celular = celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Atualiza o valor do campo de celular
    e.target.value = celular;
});

// Manipulação do formulário de cadastro
document.getElementById('formCadastroCliente').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio do formulário para processar o cadastro manualmente

    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nomeCliente').value.trim();
    const cpf = document.getElementById('cpfCliente').value.trim();
    const celular = document.getElementById('celularCliente').value.trim();
    const senha = document.getElementById('senhaCliente').value.trim();

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        alert('O CPF deve conter exatamente 11 dígitos.');
        return;
    }

    // Verifica se o celular está no formato correto
    const celularRegex = /\(\d{2}\)\s\d{5}-\d{4}/;
    if (!celularRegex.test(celular)) {
        alert('O celular deve estar no formato (XX) XXXXX-XXXX.');
        return;
    }

    // Verifica se os campos obrigatórios não estão vazios
    if (!nome || !cpf || !celular || !senha) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    // Cria um objeto de cliente com os dados fornecidos
    const novoCliente = {
        nome: nome,
        cpf: cpf,
        celular: celular,
        senha: senha
    };

    // Recupera a lista de usuários armazenada no localStorage ou cria um array vazio
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o CPF já está cadastrado
    const cpfExistente = usuarios.find(usuario => usuario.cpf === cpf);
    if (cpfExistente) {
        alert('Este CPF já está cadastrado!');
        return;
    }

    // Adiciona o novo cliente à lista de usuários
    usuarios.push(novoCliente);

    // Armazena a lista de usuários atualizada no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mensagem de sucesso
    alert('Cliente cadastrado com sucesso!');

    // Redireciona de volta para o painel
    window.location.href = 'painel.html';
});

// Função para cancelar o cadastro e voltar para o painel
document.getElementById('cancelarCadastro').addEventListener('click', function () {
    window.location.href = 'painel.html';
});
