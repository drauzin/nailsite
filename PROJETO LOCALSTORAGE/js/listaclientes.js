// Função para carregar clientes armazenados no localStorage
function carregarClientes() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const tableBody = document.querySelector('#clientesTable tbody');
    tableBody.innerHTML = ''; // Limpar a tabela antes de adicionar os dados

    usuarios.forEach((cliente, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.celular}</td>
            <td><button class="acaoBtn" data-index="${index}">Ação</button></td>
        `;
        
        // Adiciona o evento para o botão "Ação"
        tr.querySelector('.acaoBtn').addEventListener('click', function() {
            exibirPerfil(cliente, index);
        });

        tableBody.appendChild(tr);
    });
}

// Função para exibir os dados do cliente no modal
function exibirPerfil(cliente, index) {
    const modal = document.getElementById('modalCliente');
    const perfilCliente = document.getElementById('perfilCliente');
    const salvarAlteracoes = document.getElementById('salvarAlteracoes');

    perfilCliente.innerHTML = `
        <label for="nomeCliente">Nome:</label>
        <input type="text" id="nomeCliente" value="${cliente.nome}" /><br>

        <label for="cpfCliente">CPF:</label>
        <input type="text" id="cpfCliente" value="${cliente.cpf}" readonly /><br>

        <label for="celularCliente">Celular:</label>
        <input type="text" id="celularCliente" value="${cliente.celular}" /><br>
    `;

    // Exibe o modal de perfil
    modal.style.display = 'block';

    // Evento para fechar o modal
    document.getElementById('fecharModal').onclick = function() {
        modal.style.display = 'none';
    };

    // Evento para salvar alterações com confirmação via pop-up
    salvarAlteracoes.onclick = function() {
        const nome = document.getElementById('nomeCliente').value.trim();
        const celular = document.getElementById('celularCliente').value.trim();

        // Verifica se houve alteração nos dados
        if (nome !== cliente.nome || celular !== cliente.celular) {
            // Exibe o modal de confirmação
            const modalConfirmacao = document.getElementById('modalConfirmacao');
            modalConfirmacao.style.display = 'flex';

            // Confirmação para salvar alterações
            document.getElementById('confirmarAlteracoes').onclick = function() {
                // Atualiza o cliente no array
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                usuarios[index].nome = nome;
                usuarios[index].celular = celular;

                // Salva as alterações no localStorage
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Atualiza a tabela
                carregarClientes();

                // Fecha o modal de confirmação
                modalConfirmacao.style.display = 'none';
                modal.style.display = 'none';
            };

            // Cancela a ação de salvar
            document.getElementById('cancelarAlteracoes').onclick = function() {
                modalConfirmacao.style.display = 'none';
            };
        } else {
            alert('Nenhuma alteração feita.');
        }
    };
}

// Carrega os clientes ao carregar a página
window.onload = carregarClientes;
