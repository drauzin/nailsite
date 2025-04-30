// horarios.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-horario");
    const lista = document.getElementById("lista-horarios");

    const API_URL = "http://localhost:3000/horarios";

    // Função para carregar horários do servidor
    async function carregarHorarios() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro ao buscar horários');
            const horarios = await response.json();

            lista.innerHTML = "";
            horarios.forEach(horario => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${horario.data} às ${horario.hora} 
                    <button onclick="removerHorario(${horario.id})">Remover</button>
                `;
                lista.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
        }
    }

    // Adicionar novo horário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;

        if (data && hora) {
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data, hora })
                });

                if (!response.ok) throw new Error('Erro ao adicionar horário');
                form.reset();
                carregarHorarios();
            } catch (error) {
                console.error('Erro ao adicionar horário:', error);
            }
        }
    });

    // Função global para remover horário
    window.removerHorario = async (id) => {
        if (confirm("Deseja realmente remover este horário?")) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error('Erro ao remover horário');
                carregarHorarios();
            } catch (error) {
                console.error('Erro ao remover horário:', error);
            }
        }
    };

    carregarHorarios();
});
