const API_URL = 'https://nailsite.onrender.com';
const adminLogado = JSON.parse(localStorage.getItem('adminLogado'));

window.onload = function () {
  if (!adminLogado || !adminLogado.id) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  fetch(`${API_URL}/admin/${adminLogado.id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("admin-photo").src = data.foto_url || "/images/default-avatar.png";
      document.getElementById("nome-admin").textContent = data.nome;
    })
    .catch(() => {
      document.getElementById("admin-photo").src = "/images/default-avatar.png";
      document.getElementById("nome-admin").textContent = "Admin";
    });
};

document.getElementById("input-foto").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('foto', file);
  formData.append('adminId', adminLogado.id);

  try {
    const res = await fetch(`${API_URL}/admin/upload-foto`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    document.getElementById("admin-photo").src = result.foto_url;
  } catch (err) {
    alert("Erro ao enviar foto.");
  }
});
