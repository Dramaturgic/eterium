const form = document.getElementById('fichaForm');
const result = document.getElementById('fichaResult');
const listaFichas = document.getElementById('listaFichas');
const criarTab = document.getElementById('criar-tab');
const consultarTab = document.getElementById('consultar-tab');
let fichaAtual = null;

function salvarFichaStorage(ficha) {
  let fichas = JSON.parse(localStorage.getItem('fichasDnd')) || [];
  const idx = fichas.findIndex(f => f.nome === ficha.nome);
  if (idx >= 0) fichas[idx] = ficha;
  else fichas.push(ficha);
  localStorage.setItem('fichasDnd', JSON.stringify(fichas));
}

function listarFichas() {
  if (!listaFichas) return;
  let fichas = JSON.parse(localStorage.getItem('fichasDnd')) || [];
  if (fichas.length === 0) {
    listaFichas.innerHTML = '<p class="text-light">Nenhuma ficha salva.</p>';
    return;
  }
  listaFichas.innerHTML = `
    <ul class="list-group">
      ${fichas.map(f => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            <strong>${f.nome}</strong> (${f.raca} ${f.classe} Nível ${f.nivel})
          </span>
          <span>
            <button class="btn btn-sm btn-primary me-2" onclick="carregarFicha('${f.nome.replace(/'/g, "\\'")}')">Carregar</button>
            <button class="btn btn-sm btn-danger" onclick="excluirFicha('${f.nome.replace(/'/g, "\\'")}')">Excluir</button>
          </span>
        </li>
      `).join('')}
    </ul>
  `;
}

window.carregarFicha = function(nome) {
  let fichas = JSON.parse(localStorage.getItem('fichasDnd')) || [];
  const ficha = fichas.find(f => f.nome === nome);
  if (!ficha) return;
  fichaAtual = ficha;
  for (const [key, value] of Object.entries(fichaAtual)) {
    if (key === 'pericias') {
      form.querySelectorAll('input[name="pericias"]').forEach(el => {
        el.checked = value.includes(el.value);
      });
    } else if (form.elements[key]) {
      form.elements[key].value = value;
    }
  }
  if (criarTab) criarTab.click();
  result.style.display = 'none';
  form.style.display = 'block';
};

function mostrarFicha() {
  if (!fichaAtual) return;
  result.innerHTML = `
    <h2>${fichaAtual.nome}</h2>
    <strong>Raça:</strong> ${fichaAtual.raca} |
    <strong>Classe:</strong> ${fichaAtual.classe} |
    <strong>Nível:</strong> ${fichaAtual.nivel} |
    <strong>PV:</strong> ${fichaAtual.pv} |
    <strong>CA:</strong> ${fichaAtual.ca}
    <hr>
    <strong>Atributos:</strong>
    <ul>
      <li>Força: ${fichaAtual.forca}</li>
      <li>Destreza: ${fichaAtual.destreza}</li>
      <li>Constituição: ${fichaAtual.constituicao}</li>
      <li>Inteligência: ${fichaAtual.inteligencia}</li>
      <li>Sabedoria: ${fichaAtual.sabedoria}</li>
      <li>Carisma: ${fichaAtual.carisma}</li>
    </ul>
    <strong>Perícias:</strong> ${fichaAtual.pericias.join(', ') || 'Nenhuma'}<br>
    <strong>Equipamentos:</strong> <pre>${fichaAtual.equipamentos || '-'}</pre>
    <strong>História:</strong> <pre>${fichaAtual.história || '-'}</pre>
    <button class="btn btn-warning mt-2" onclick="editarFicha()">Editar Ficha</button>
  `;
  result.style.display = 'block';
  form.style.display = 'none';
}

window.editarFicha = function() {
  if (!fichaAtual) return;
  for (const [key, value] of Object.entries(fichaAtual)) {
    if (key === 'pericias') {
      form.querySelectorAll('input[name="pericias"]').forEach(el => {
        el.checked = value.includes(el.value);
      });
    } else if (form.elements[key]) {
      form.elements[key].value = value;
    }
  }
  result.style.display = 'none';
  result.innerHTML = '';
  form.style.display = '';
};

form.onsubmit = function(e) {
  e.preventDefault();
  const data = new FormData(form);
  const pericias = [];
  form.querySelectorAll('input[name="pericias"]:checked').forEach(el => pericias.push(el.value));
  fichaAtual = {
    nome: data.get('nome'),
    raca: data.get('raca'),
    classe: data.get('classe'),
    nivel: data.get('nivel'),
    pv: data.get('pv'),
    ca: data.get('ca'),
    forca: data.get('forca'),
    destreza: data.get('destreza'),
    constituicao: data.get('constituicao'),
    inteligencia: data.get('inteligencia'),
    sabedoria: data.get('sabedoria'),
    carisma: data.get('carisma'),
    pericias,
    equipamentos: data.get('Equipamentos'),
    história: data.get('história')
  };
  salvarFichaStorage(fichaAtual);
  mostrarFicha();
  listarFichas();
};

if (consultarTab) {
  consultarTab.addEventListener('click', () => {
    listarFichas();
    if (form) form.style.display = 'none';
    if (result) result.style.display = 'none';
  });
}
if (criarTab) {
  criarTab.addEventListener('click', () => {
    if (form) form.style.display = '';
    if (result) result.style.display = 'none';
  });
}

listarFichas();

window.excluirFicha = function(nome) {
  let fichas = JSON.parse(localStorage.getItem('fichasDnd')) || [];
  fichas = fichas.filter(f => f.nome !== nome);
  localStorage.setItem('fichasDnd', JSON.stringify(fichas));
  listarFichas();
};