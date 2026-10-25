/* =========================================================
   Portfólio Maicon Rodrigues
   1. Menu
   2. Animação de entrada dos blocos
   3. Avatar 3D que olha para o cursor
   ========================================================= */

// ---------- 1. Menu ----------
const botaoMenu = document.querySelector(".nav__botao");
const menu = document.getElementById("menu");

function alternarMenu(abrir) {
  document.body.classList.toggle("menu-aberto", abrir);
  botaoMenu.setAttribute("aria-expanded", String(abrir));
  botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  menu.setAttribute("aria-hidden", String(!abrir));
}

botaoMenu.addEventListener("click", () => {
  alternarMenu(!document.body.classList.contains("menu-aberto"));
});

// Fecha ao clicar num link, fora do menu ou ao apertar Esc
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) alternarMenu(false);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu, .nav__botao")) alternarMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") alternarMenu(false);
});

// ---------- 2. Animação de entrada ----------
const blocos = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  blocos.forEach((bloco) => observador.observe(bloco));
} else {
  blocos.forEach((bloco) => bloco.classList.add("visivel"));
}

// ---------- 3. Avatar que olha para o cursor ----------
// Versão em JavaScript puro do componente CursorAvatar do Framer:
// troca o ângulo da cabeça, gira em 3D com mola e move o céu ao contrário.
const avatar = document.querySelector(".hero__avatar");

if (avatar) {
  const SENSIBILIDADE = 70; // % (maior = troca de ângulo mais cedo)
  const GIRO = 8;           // graus extras de giro 3D
  const limite = 1 - SENSIBILIDADE / 100;

  const ceu = document.querySelector(".hero__ceu");
  const imagens = {};
  avatar.querySelectorAll("img").forEach((img) => {
    imagens[img.dataset.olhar] = img;
  });

  let atual = "centro";
  function olharPara(direcao) {
    if (direcao === atual || !imagens[direcao]) return;
    imagens[atual].classList.remove("ativo");
    imagens[direcao].classList.add("ativo");
    atual = direcao;
  }

  // Mola simples (rigidez 90, amortecimento 16, massa 0.8)
  const mola = { x: 0, y: 0, vx: 0, vy: 0, alvoX: 0, alvoY: 0 };
  let rodando = false;
  let ultimo = 0;

  function passo(agora) {
    const dt = Math.min((agora - ultimo) / 1000, 0.04);
    ultimo = agora;
    const k = 90, c = 16, m = 0.8;
    mola.vx += ((-k * (mola.x - mola.alvoX) - c * mola.vx) / m) * dt;
    mola.vy += ((-k * (mola.y - mola.alvoY) - c * mola.vy) / m) * dt;
    mola.x += mola.vx * dt;
    mola.y += mola.vy * dt;

    avatar.style.transform =
      `translate(${mola.x * 8}px, ${mola.y * 5}px) ` +
      `rotateY(${mola.x * GIRO}deg) rotateX(${-mola.y * GIRO * 0.7}deg)`;
    if (ceu) ceu.style.transform = `translate(${-mola.x * 12}px, ${-mola.y * 8}px)`;

    const parado =
      Math.abs(mola.x - mola.alvoX) < 0.001 && Math.abs(mola.y - mola.alvoY) < 0.001 &&
      Math.abs(mola.vx) < 0.001 && Math.abs(mola.vy) < 0.001;
    if (parado) { rodando = false; return; }
    requestAnimationFrame(passo);
  }

  function animarMola() {
    if (rodando) return;
    rodando = true;
    ultimo = performance.now();
    requestAnimationFrame(passo);
  }

  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduzirMovimento && temMouse) {
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = avatar.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      mola.alvoX = nx;
      mola.alvoY = ny;
      animarMola();

      let proxima = "centro";
      if (Math.abs(nx) >= Math.abs(ny)) {
        if (Math.abs(nx) > limite) proxima = nx < 0 ? "esquerda" : "direita";
      } else if (Math.abs(ny) > limite) {
        proxima = ny < 0 ? "cima" : "baixo";
      }
      olharPara(proxima);
    });

    document.documentElement.addEventListener("mouseleave", () => {
      mola.alvoX = 0;
      mola.alvoY = 0;
      animarMola();
      olharPara("centro");
    });
  } else if (!reduzirMovimento) {
    // No celular não tem cursor, então ele olha em volta sozinho
    const sequencia = ["centro", "esquerda", "centro", "direita", "centro", "cima"];
    let n = 0;
    setInterval(() => {
      n = (n + 1) % sequencia.length;
      olharPara(sequencia[n]);
    }, 1800);
  }
}

// ---------- 4. Aviso de erro no formulário ----------
const formulario = document.querySelector(".form");
if (formulario && new URLSearchParams(location.search).has("erro")) {
  const aviso = document.createElement("p");
  aviso.className = "form__erro";
  aviso.setAttribute("role", "alert");
  aviso.textContent = "Não consegui enviar sua mensagem. Confira os campos ou me chame por e-mail.";
  formulario.prepend(aviso);
}
