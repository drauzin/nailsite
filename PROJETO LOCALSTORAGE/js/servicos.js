let horarioSelecionado = null;

const servicos = [
    { nome: "Alongamento de Unhas", preco: "R$ 150,00" },
    { nome: "Manutenção de Gel", preco: "R$ 100,00" },
    { nome: "Design de Sobrancelha", preco: "R$ 50,00" },
    { nome: "Blindagem de Unhas", preco: "R$ 130,00" },
    { nome: "Esmaltação em Gel", preco: "R$ 70,00" }
];

function mostrarHorarios(idServico) {
    const horarios = document.getElementById(`horarios-${idServico}`);

    if (horarios.style.display === "block") {
        horarios.style.display = "none";
        horarios.innerHTML = "";
    } else {
        horarios.style.display = "block";

        const horariosDisponiveis = JSON.parse(localStorage.getItem("horariosDisponiveis")) || [];
        if (horariosDisponiveis.length === 0) {
            horarios.innerHTML = "<p>Nenhum horário disponível.</p>";
            return;
        }

        horarios.innerHTML = `
            <div class="botoes-horarios">
                ${horariosDisponiveis.map(h => `
                    <button class="horario" onclick="selecionarHorario(this, ${idServico})">
                        ${h.data} às ${h.hora}
                    </button>
                `).join('')}
            </div>
            <button class="confirmar-button" id="confirmar-button-${idServico}" style="display: none;" onclick="confirmarAgendamento(${idServico})">
                Confirmar Agendamento
            </button>
        `;
    }
}


function selecionarHorario(botao, idServico) {
    if (horarioSelecionado) {
        horarioSelecionado.classList.remove('selecionado');
    }
    horarioSelecionado = botao;
    horarioSelecionado.classList.add('selecionado');

    document.querySelectorAll(".confirmar-button").forEach(btn => btn.style.display = "none");
    const confirmarButton = document.getElementById(`confirmar-button-${idServico}`);
    if (confirmarButton) {
        confirmarButton.style.display = "block";
    }
}

function confirmarAgendamento(idServico) {
    const clienteLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!clienteLogado) {
        alert("Nenhum usuário logado.");
        return;
    }

    if (horarioSelecionado) {
        alert(`Agendamento confirmado para ${servicos[idServico].nome} no horário ${horarioSelecionado.innerText}!`);

        const agendamento = {
            servico: servicos[idServico].nome,
            horario: horarioSelecionado.innerText,
            dataAgendamento: new Date().toLocaleString()
        };

        const chaveAgendamentos = `agendamentos_${clienteLogado.cpf}`;
        let agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];
        agendamentos.push(agendamento);
        localStorage.setItem(chaveAgendamentos, JSON.stringify(agendamentos));

        // Atualizar lista de horários disponíveis (remove o horário agendado)
        const horariosDisponiveis = JSON.parse(localStorage.getItem("horariosDisponiveis")) || [];
        const novoHorario = horarioSelecionado.innerText.split(" às ");
        const novaLista = horariosDisponiveis.filter(h => !(h.data === novoHorario[0] && h.hora === novoHorario[1]));
        localStorage.setItem("horariosDisponiveis", JSON.stringify(novaLista));

        // Resetar tela
        horarioSelecionado = null;
        document.getElementById(`horarios-${idServico}`).style.display = "none";
        document.getElementById(`horarios-${idServico}`).innerHTML = "";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const containerServicos = document.getElementById("container-servicos");

    servicos.forEach((servico, index) => {
        const div = document.createElement("div");
        div.className = "servico";
        div.innerHTML = `
            <h3>${servico.nome}</h3>
            <p>Preço: ${servico.preco}</p>
            <button onclick="mostrarHorarios(${index})">Agendar</button>
            <div class="horarios" id="horarios-${index}" style="display: none;"></div>
        `;
        containerServicos.appendChild(div);
    });

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("clienteLogado");
            window.location.href = "index.html";
        });
    }
});
