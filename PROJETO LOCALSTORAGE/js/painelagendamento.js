document.addEventListener("DOMContentLoaded", () => {
    const listaContainer = document.getElementById("lista-agendamentos");
    let agendamentosGerais = "";

    // Aqui, vamos pegar todos os itens do localStorage e procurar as chaves que começam com 'agendamentos_'
    for (let chave in localStorage) {
        if (chave.startsWith("agendamentos_")) {
            const cpfCliente = chave.split("_")[1];  // Extraindo o CPF da chave

            const agendamentos = JSON.parse(localStorage.getItem(chave)) || [];

            if (agendamentos.length > 0) {
                agendamentosGerais += `<h3>Cliente: ${cpfCliente}</h3><ul>`;
                agendamentos.forEach(a => {    
                    agendamentosGerais += `<li><strong>Serviço:</strong> ${a.servico} - <strong>Horário:</strong> ${a.horario} - <strong>Data:</strong> ${a.data}</li>`;
                });
                agendamentosGerais += `</ul>`;
            }
        }
    }

    // Se houver agendamentos, exibimos, senão mostramos uma mensagem.
    listaContainer.innerHTML = agendamentosGerais || "<p>Nenhum agendamento encontrado.</p>";
});


// Função para formatar a data para um formato mais legível
function formatarData(dataStr) {
    const data = new Date(dataStr); // Converte a string para um objeto Date
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano}, ${horas}:${minutos}`;
}

// Função para cancelar o agendamento
function cancelarAgendamento(cpf, horario) {
    const chave = `agendamentos_${cpf}`;
    let agendamentos = JSON.parse(localStorage.getItem(chave)) || [];

    // Remove o agendamento
    agendamentos = agendamentos.filter(a => a.horario !== horario);
    localStorage.setItem(chave, JSON.stringify(agendamentos));

    // Atualiza a lista de agendamentos
    location.reload();
}

// Função para alterar o horário do agendamento
function alterarHorario(cpf, horarioAntigo) {
    const novoHorario = prompt("Informe o novo horário:", horarioAntigo);
    if (novoHorario) {
        const chave = `agendamentos_${cpf}`;
        let agendamentos = JSON.parse(localStorage.getItem(chave)) || [];

        // Atualiza o horário
        const agendamento = agendamentos.find(a => a.horario === horarioAntigo);
        if (agendamento) {
            agendamento.horario = novoHorario;
            localStorage.setItem(chave, JSON.stringify(agendamentos));
            alert("Horário alterado com sucesso!");

            // Atualiza a lista de agendamentos
            location.reload();
        }
    }
}
