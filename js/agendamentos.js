document.addEventListener("DOMContentLoaded", function () {
    const clienteLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Padronizado para 'usuarioLogado'
    const container = document.getElementById("lista-agendamentos");

    if (!clienteLogado) {
        container.innerHTML = "<p>Nenhum usuário logado.</p>";
        return;
    }


    const chaveAgendamentos = `agendamentos_${clienteLogado.cpf}`; // Usando CPF como chave
    const agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];

    if (agendamentos.length === 0) {
        container.innerHTML = "<p>Você ainda não possui agendamentos.</p>";
        return;
    }

    agendamentos.forEach(agendamento => {
        const div = document.createElement("div");
        div.classList.add("agendamento");
        div.innerHTML = `
            <h3>${agendamento.servico}</h3>
            <p><strong>Horário:</strong> ${agendamento.horario}</p>
            <p><strong>Data do Agendamento:</strong> ${agendamento.data}</p>
        `;
        container.appendChild(div);
    });
});
