document.addEventListener("DOMContentLoaded", () => {
  const btnAgendar = document.querySelectorAll(".btn-agendar");

  // Ao clicar no botão "Agendar"
  btnAgendar.forEach(button => {
      button.addEventListener("click", async () => {
          const servicoId = button.dataset.id;
          const horariosDiv = document.getElementById(`horarios-${servicoId}`);
          
          // Se os horários ainda não foram carregados, vamos carregá-los
          if (horariosDiv.style.display === "none" || horariosDiv.style.display === "") {
              horariosDiv.style.display = "block";  // Exibe a lista de horários

              // Carregar os horários disponíveis (esses horários são os mesmos para todos os serviços)
              try {
                  const response = await fetch("https://nailsite.onrender.com/horarios");
                  const horarios = await response.json();

                  horariosDiv.innerHTML = '';  // Limpar a lista de horários antes de preencher

                  // Exibir os horários
                  horarios.forEach(horario => {
                      const horarioElemento = document.createElement("div");
                      horarioElemento.classList.add("horario-item");
                      horarioElemento.innerHTML = `
                          <p>${horario.data} - ${horario.hora}</p>
                          <button onclick="agendar(${horario.id})">Agendar</button>
                      `;
                      horariosDiv.appendChild(horarioElemento);
                  });
              } catch (error) {
                  console.error("Erro ao carregar horários", error);
                  alert("Erro ao carregar os horários disponíveis.");
              }
          } else {
              // Se já estiverem visíveis, apenas esconder
              horariosDiv.style.display = "none";
          }
      });
  });
});

// Função para agendar um horário

// servicos.js
async function agendar(horarioId) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) {
      alert("Você precisa estar logado para agendar.");
      return;
  }

  try {
      const response = await fetch("https://nailsite.onrender.com/agendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              usuario_cpf: usuario.cpf,  // Enviando o CPF do usuário
              horario_id: horarioId
          })
      });

      const data = await response.json();
      if (data.message) {
          alert(data.message); // Exibir a resposta do backend
      } else {
          alert("Erro ao agendar.");
      }
  } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      alert("Erro no servidor.");
  }
}


document.addEventListener('DOMContentLoaded', function () {
    const clienteId = sessionStorage.getItem('clienteId');
    if (!clienteId) {
      window.location.href = 'index.html';
      return;
    }
  
    fetch(`https://nailsite.onrender.com/cliente/${clienteId}`)
      .then(res => res.json())
      .then(cliente => {
        document.getElementById('nome-usuario').innerText = cliente.nome;
        document.getElementById('fotoPerfil').src = cliente.foto_url || 'images/default-avatar.png';
      })
      .catch(err => {
        console.error('Erro ao buscar cliente:', err);
      });
  });
  