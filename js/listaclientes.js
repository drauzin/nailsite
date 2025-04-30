function carregarClientes() {
    fetch('listar_clientes.php')
        .then(response => response.json())
        .then(data => {
            const tabela = document.querySelector('#clientesTable tbody');
            tabela.innerHTML = ''; // Limpa a tabela

            data.forEach(cliente => {
                const tr = document.createElement('tr');

                const tdNome = document.createElement('td');
                tdNome.textContent = cliente.nome;

                const tdCpf = document.createElement('td');
                tdCpf.textContent = cliente.cpf;

                const tdCelular = document.createElement('td');
                tdCelular.textContent = cliente.numero_celular || 'Não informado';

                const tdAcoes = document.createElement('td');
                const botaoEditar = document.createElement('button');
                botaoEditar.textContent = 'Editar';
                tdAcoes.appendChild(botaoEditar);

                tr.appendChild(tdNome);
                tr.appendChild(tdCpf);
                tr.appendChild(tdCelular);
                tr.appendChild(tdAcoes);

                tabela.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os clientes:', error);
        });
}

// Executa a função quando a página for carregada
window.onload = carregarClientes;


// Função para abrir o modal de perfil e carregar os dados do cliente
function abrirModal(cliente) {
    const modal = document.getElementById('modalCliente');
    const perfilCliente = document.getElementById('perfilCliente');
    perfilCliente.innerHTML = `
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>CPF:</strong> ${cliente.cpf}</p>
        <p><strong>Celular:</strong> <input type="text" id="celularInput" value="${cliente.numero_celular}" /></p>
    `;
    modal.style.display = 'block'; // Exibe o modal

    // Quando o usuário clicar no botão "Salvar Alterações"
    document.getElementById('salvarAlteracoes').onclick = () => salvarAlteracoes(cliente.cpf);
}

// Função para salvar as alterações do número de celular
function salvarAlteracoes(cpf) {
    const celularNovo = document.getElementById('celularInput').value; // Obtém o valor do novo celular

    // Enviar os dados de volta para o servidor (para salvar o celular no banco de dados)
    fetch('salvar_celular.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpf: cpf, celular: celularNovo }) // Envia o CPF e o novo celular em formato JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.success) {
            alert('Número de celular atualizado!'); // Mostra sucesso
            fecharModal(); // Fecha o modal
            carregarClientes(); // Recarrega a lista de clientes
        } else {
            alert('Erro ao atualizar celular!'); // Caso tenha algum erro ao salvar
        }
    })
    .catch(error => console.error('Erro ao salvar alteração:', error)); // Exibe erro no console, se houver
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modalCliente');
    modal.style.display = 'none'; // Fecha o modal
}

// Fechar o modal ao clicar no "X"
document.getElementById('fecharModal').onclick = fecharModal;

// Carregar os clientes ao carregar a página
window.onload = carregarClientes;
