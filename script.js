

fetch('data/impactos.json')
  .then(res => res.json())
  .then(data => {
    const nodos = data.elements.filter(e => e.data && e.data.x !== undefined);
    const edges = data.elements.filter(e => e.data.source);

    const botonesContainer = document.getElementById('botones');
    const conexionesSVG = document.getElementById('conexiones');

    const posiciones = {};

    nodos.forEach(node => {
      const { id, label, tipo, x, y } = node.data;

     const boton = document.createElement('div');
boton.className = `boton ${tipo}`;

// Oculta todos excepto los verdes
if (tipo !== 'zona') {
  boton.style.display = 'none';
}
      boton.innerText = label;
      boton.style.left = `${x}px`;
      boton.style.top = `${y}px`;
      boton.dataset.id = id;

      posiciones[id] = { x, y };

      boton.addEventListener('click', () => {
        document.querySelectorAll('.boton').forEach(b => b.style.opacity = '0.2');
        boton.style.opacity = '1';

        const relacionados = edges.filter(e => e.data.source === id || e.data.target === id);
relacionados.forEach(e => {
  const otherId = e.data.source === id ? e.data.target : e.data.source;
  const el = document.querySelector(`[data-id="${otherId}"]`);
  if (el) {
    el.style.display = 'block'; // lo muestra
    el.style.opacity = '1';     // lo activa visualmente
  }
});
        dibujarConexiones(id, relacionados);
        const infoBox = document.getElementById('info-box');
const titulo = document.getElementById('info-titulo');
const descripcion = document.getElementById('info-descripcion');

const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
titulo.textContent = tipoCapitalizado;
document.getElementById('info-label').textContent = label;
descripcion.textContent = node.data.descripcion || 'Sin descripción disponible.';
infoBox.style.display = 'block';

infoBox.classList.remove('zona', 'flujo', 'fase', 'impacto');
infoBox.classList.add(tipo);
      });

      botonesContainer.appendChild(boton);
    });

    function dibujarConexiones(idCentral, relaciones) {
      conexionesSVG.innerHTML = ''; // limpia

      relaciones.forEach(e => {
        const { source, target } = e.data;
        const p1 = posiciones[source];
        const p2 = posiciones[target];

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1.x);
        line.setAttribute('y1', p1.y);
        line.setAttribute('x2', p2.x);
        line.setAttribute('y2', p2.y);
        line.setAttribute('stroke', '#ffffff'); // blanco
        line.setAttribute('stroke-width', '2');
        conexionesSVG.appendChild(line);
      });
    }
  });