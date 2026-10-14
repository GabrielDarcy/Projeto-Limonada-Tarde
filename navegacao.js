/* ================================================================
   THERMAL EXPRESS — MENU RESPONSIVO (navegacao.js)
   Usado somente no cabeçalho das páginas públicas.
   Sem JavaScript, o menu continua visível no celular (fallback CSS).
   ================================================================ */
(function () {
  "use strict";
  var botao = document.querySelector(".site-nav-toggle");
  var menu = document.getElementById("site-navigation");
  if (!botao || !menu) return;

  document.documentElement.classList.add("js-menu");

  function abrirMenu(aberto) {
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
    menu.classList.toggle("is-open", aberto);
  }

  botao.addEventListener("click", function () {
    abrirMenu(botao.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      abrirMenu(false);
      botao.focus();
    }
  });

  document.addEventListener("click", function (evento) {
    if (botao.getAttribute("aria-expanded") === "true" && !evento.target.closest(".site-header")) {
      abrirMenu(false);
    }
  });

  menu.addEventListener("click", function (evento) {
    if (evento.target.closest("a")) abrirMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) abrirMenu(false);
  });
})();
