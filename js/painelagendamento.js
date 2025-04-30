// Atualizar a lista de agendamentos
function carregarAgendamentos() {
    fetch('http://localhost:3000/agendamentos-com-clientes')
      .then(response => response.json())
      .then(agendamentos => {
        console.log("Resposta do servidor:", agendamentos);

        // Ordenar os agendamentos por data e hora (mais próximos primeiro)
        agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

        const lista = document.getElementById('listaAgendamentos');
        lista.innerHTML = ''; // Limpar a lista de agendamentos antes de preencher
        
        // Verificar se há agendamentos
        if (agendamentos.length === 0) {
            // Se não houver agendamentos, exibe a mensagem
            const mensagem = document.createElement('p');
            mensagem.textContent = "Não há agendamentos marcados.";
            lista.appendChild(mensagem);
        } else {
            // Exibir os agendamentos
            agendamentos.forEach(agendamento => {
                const item = document.createElement('div');
                item.classList.add('agendamento');
        
                item.innerHTML = `
                    <p><strong>Cliente:</strong> <span class="dado-cliente">${agendamento.nome}</span></p>
                    <p><strong>Data:</strong> <span class="dado-data">${formatarData(agendamento.data)}</span></p>
                    <p><strong>Hora:</strong> <span class="dado-hora">${agendamento.hora.slice(0, 5)}h</span></p>
                    <br>
                    <button class="alterar" onclick="abrirModal(${agendamento.id}, '${agendamento.data}', '${agendamento.hora}')">Alterar</button>
                    <button class="btn cancelar" data-id="${agendamento.id}">Cancelar</button>
                `;
        
                lista.appendChild(item);
            });
        }

        // Adicionar eventos aos botões
        adicionarEventosBotoes();
      })
      .catch(error => console.error('Erro ao carregar agendamentos:', error));
}


// Função para abrir o modal de alteração
function abrirModal(agendamentoId, dataAtual, horaAtual) {
  const modal = document.getElementById('modal');
  const modalData = document.getElementById('modalData');
  const modalHora = document.getElementById('modalHora');
  const btnSalvar = document.getElementById('btnSalvarAlteracao');

  agendamentoSelecionadoId = agendamentoId;

  modalData.value = formatarDataParaInput(dataAtual);
  modalHora.value = horaAtual?.slice(0, 5) || '';

  modal.style.display = 'flex';

  btnSalvar.onclick = () => {
      const novaData = modalData.value;
      const novaHora = modalHora.value;

      if (!novaData || !validarHora(novaHora)) {
          alert("Data ou hora inválida.");
          return;
      }

      console.log("Enviando para o servidor:", novaData, novaHora);

      fetch(`http://localhost:3000/agendamentos/${agendamentoSelecionadoId}/alterar-hora`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ novaData, novaHora })
      })
      .then(res => {
          if (!res.ok) throw new Error("Erro ao salvar no servidor");
          return res.json();
      })
      .then(() => {
          fecharModal();
          carregarAgendamentos();
      })
      .catch(err => {
          console.error('Erro ao salvar:', err);
          alert("Erro ao alterar agendamento.");
      });
  };
}

// Função para formatar a data no formato yyyy-MM-dd (necessário para input type="date")
function formatarDataParaInput(data) {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`; // Formato yyyy-MM-dd
}

// Evento para salvar alterações
document.addEventListener('DOMContentLoaded', function () {
    const btnSalvarAlteracao = document.getElementById('btnSalvarAlteracao');
    if (btnSalvarAlteracao) {
        btnSalvarAlteracao.onclick = () => {
            const novaData = document.getElementById('modalData').value;
            const novaHora = document.getElementById('modalHora').value;

            console.log("Dados antes de salvar:");
            console.log("Nova Data:", novaData);
            console.log("Nova Hora:", novaHora);

            if (!novaData || !novaHora || !validarHora(novaHora)) {
                alert("Data ou hora inválida.");
                return;
            }

            // Log para verificar a chamada do fetch
            console.log(`Enviando requisição para atualizar agendamento ID: ${agendamentoSelecionadoId}`);

            fetch(`http://localhost:3000/agendamentos/${agendamentoSelecionadoId}/alterar-hora`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ novaData, novaHora })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Erro ao salvar no servidor");
                }
                return res.json();
            })
            .then(() => {
                fecharModal();
                carregarAgendamentos();
            })
            .catch(err => {
                console.error('Erro ao salvar:', err);
                alert("Erro ao alterar agendamento.");
            });
        };
    }
});

// Função para validar a hora (se for no formato correto HH:MM)
function validarHora(hora) {
    const regexHora = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regexHora.test(hora);
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}


// Função para validar o formato de hora
function validarHora(hora) {
  const regexHora = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regexHora.test(hora);
}

// Função para formatar data
function formatarData(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Adicionar eventos aos botões "Cancelar"
function adicionarEventosBotoes() {
  document.querySelectorAll('.btn.cancelar').forEach(botao => {
      botao.addEventListener('click', function () {
          const id = this.dataset.id;
          if (confirm('Deseja cancelar este agendamento?')) {
              fetch(`http://localhost:3000/agendamentos/${id}`, {
                  method: 'DELETE'
              })
              .then(res => res.json())
              .then(data => {
                  alert(data.message || 'Agendamento cancelado!');
                  carregarAgendamentos(); // Recarrega os agendamentos
              })
              .catch(err => {
                  console.error('Erro ao cancelar agendamento:', err);
                  alert('Erro ao cancelar agendamento.');
              });
          }
      });
  });
}

// Event listener para carregar os agendamentos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarAgendamentos();})
  
  agendamentos.forEach(a => {
    console.log("DATA:", a.data, "HORA:", a.hora);
  });
  