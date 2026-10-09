const locais = [

  {
    numero: "01",
    nome: "Local de Recebimento 01",
    endereco:
      "Av. Ipiranga, 1145 - Praia de Belas, Porto Alegre - RS",
    lat: -30.048365,
    lng: -51.217051,
    pagina: "local-01.html"
  },

  {
    numero: "02",
    nome: "Local de Recebimento 02",
    endereco:
      "Av. João Pessoa, 57 - Farroupilha, Porto Alegre - RS",
    lat: -30.0330729,
    lng: -51.222893,
    pagina: "local-02.html"
  },

  {
    numero: "03",
    nome: "Local de Recebimento 03",
    endereco:
      "Rua José do Patrocínio, 400 - Cidade Baixa, Porto Alegre - RS",
    lat: -30.0386901,
    lng: -51.2242465,
    pagina: "local-03.html"
  },

  {
    numero: "04",
    nome: "Local de Recebimento 04",
    endereco:
      "Av. Borges de Medeiros, 1376 - Centro Histórico, Porto Alegre - RS",
    lat: -30.0393667,
    lng: -51.2284062,
    pagina: "local-04.html"
  },

  {
    numero: "05",
    nome: "Local de Recebimento 05",
    endereco:
      "Rua 24 de Outubro, 112 - Moinhos de Vento, Porto Alegre - RS",
    lat: -30.027876,
    lng: -51.2064342,
    pagina: "local-05.html"
  },

  {
    numero: "06",
    nome: "Local de Recebimento 06",
    endereco:
      "Rua Mostardeiro, 233 - Rio Branco, Porto Alegre - RS",
    lat: -30.0290363,
    lng: -51.2048559,
    pagina: "local-06.html"
  },

  {
    numero: "07",
    nome: "Local de Recebimento 07",
    endereco:
      "Av. Cristóvão Colombo, 1096 - Floresta, Porto Alegre - RS",
    lat: -30.0217788,
    lng: -51.2085402,
    pagina: "local-07.html"
  },

  {
    numero: "08",
    nome: "Local de Recebimento 08",
    endereco:
      "Av. São Pedro, 1110 - São Geraldo, Porto Alegre - RS",
    lat: -30.0116103,
    lng: -51.1983408,
    pagina: "local-08.html"
  }

];



/* =========================================================
   INICIALIZAÇÃO DO MAPA
   ========================================================= */

const mapa = L.map("mapa-rota");



/* =========================================================
   CAMADA DO MAPA
   =========================================================

   Antes:

   https://tile.openstreetmap.org/

   Agora:

   ArcGIS World Street Map

   Isso evita o servidor de tiles que estava retornando
   o erro 403 no seu projeto.
   ========================================================= */

L.tileLayer(
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,

    attribution:
      "Sources: Esri, DeLorme, HERE, USGS, Intermap, " +
      "iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), " +
      "Esri (Thailand), MapmyIndia, TomTom"
  }
).addTo(mapa);



/* =========================================================
   ÍCONE DOS MARCADORES
   ========================================================= */

function criarIcone(numero) {

  return L.divIcon({

    className: "icone-rota",

    html:
      '<div class="marcador-rota">' +
        "<span>" +
          numero +
        "</span>" +
      "</div>",

    iconSize: [38, 38],

    iconAnchor: [19, 38],

    popupAnchor: [0, -38]

  });

}



/* =========================================================
   CRIAÇÃO DOS MARCADORES
   ========================================================= */

const marcadores = [];



locais.forEach(function (local) {


  const marcador = L.marker(

    [
      local.lat,
      local.lng
    ],

    {
      icon: criarIcone(local.numero)
    }

  ).addTo(mapa);



  /* =====================================================
     POPUP
     ===================================================== */

  const popup =

    '<div class="popup-numero">' +
      "Ponto " +
      local.numero +
    "</div>" +

    '<div class="popup-titulo">' +
      local.nome +
    "</div>" +

    '<div class="popup-endereco">' +
      local.endereco +
    "</div>" +

    "<br>" +

    '<a href="' +
      local.pagina +
      '" ' +
      'style="color:#a27b19;font-weight:bold;text-decoration:none;">' +
      "Ver local →" +
    "</a>";



  marcador.bindPopup(popup);



  marcadores.push(marcador);

});



/* =========================================================
   COORDENADAS DA ROTA
   ========================================================= */

const coordenadas = locais

  .map(function (local) {

    return (
      local.lng +
      "," +
      local.lat
    );

  })

  .join(";");



/* =========================================================
   URL DO OSRM
   =========================================================

   O OSRM calcula o caminho seguindo as ruas.
   ========================================================= */

const urlRota =

  "https://router.project-osrm.org/route/v1/driving/" +

  coordenadas +

  "?overview=full&geometries=geojson";



/* =========================================================
   FORMATAR DISTÂNCIA
   ========================================================= */

function formatarDistancia(metros) {


  if (metros < 1000) {

    return (
      Math.round(metros) +
      " m"
    );

  }


  return (

    (metros / 1000)

      .toFixed(1)

      .replace(".", ",") +

    " km"

  );

}



/* =========================================================
   FORMATAR TEMPO
   ========================================================= */

function formatarTempo(segundos) {


  const minutos =

    Math.round(
      segundos / 60
    );



  if (minutos < 60) {

    return (
      minutos +
      " min"
    );

  }



  const horas =

    Math.floor(
      minutos / 60
    );



  const minutosRestantes =

    minutos % 60;



  if (minutosRestantes === 0) {

    return (
      horas +
      "h"
    );

  }



  return (

    horas +
    "h " +

    minutosRestantes +
    "min"

  );

}



/* =========================================================
   CALCULAR ROTA
   ========================================================= */

async function calcularRota() {


  const loading =

    document.getElementById(
      "map-loading"
    );



  try {


    /* =====================================================
       SOLICITAR ROTA AO OSRM
       ===================================================== */

    const resposta =

      await fetch(
        urlRota
      );



    if (!resposta.ok) {

      throw new Error(
        "Erro ao acessar o serviço de rotas."
      );

    }



    const dados =

      await resposta.json();



    /* =====================================================
       VERIFICAR RESPOSTA
       ===================================================== */

    if (

      dados.code !== "Ok" ||

      !dados.routes ||

      dados.routes.length === 0

    ) {

      throw new Error(
        "Nenhuma rota encontrada."
      );

    }



    const rota =

      dados.routes[0];



    /* =====================================================
       CONTORNO BRANCO DA ROTA
       ===================================================== */

    const contorno =

      L.geoJSON(

        rota.geometry,

        {

          style: {

            color: "#ffffff",

            weight: 10,

            opacity: 0.9,

            lineCap: "round",

            lineJoin: "round"

          }

        }

      );



    contorno.addTo(mapa);



    /* =====================================================
       LINHA DOURADA DA ROTA
       ===================================================== */

    const linhaRota =

      L.geoJSON(

        rota.geometry,

        {

          style: {

            color: "#d4af37",

            weight: 6,

            opacity: 1,

            lineCap: "round",

            lineJoin: "round"

          }

        }

      );



    linhaRota.addTo(mapa);



    /* =====================================================
       AJUSTAR ZOOM PARA A ROTA
       ===================================================== */

    mapa.fitBounds(

      linhaRota.getBounds(),

      {

        padding: [40, 40]

      }

    );



    /* =====================================================
       MOSTRAR DISTÂNCIA
       ===================================================== */

    const distancia =

      document.getElementById(
        "distancia-rota"
      );



    if (distancia) {

      distancia.textContent =

        formatarDistancia(
          rota.distance
        );

    }



    /* =====================================================
       MOSTRAR TEMPO
       ===================================================== */

    const tempo =

      document.getElementById(
        "tempo-rota"
      );



    if (tempo) {

      tempo.textContent =

        formatarTempo(
          rota.duration
        );

    }



    /* =====================================================
       ESCONDER LOADING
       ===================================================== */

    if (loading) {

      loading.classList.add(
        "hidden"
      );

    }


  }


  catch (erro) {


    console.error(
      "Erro ao calcular rota:",
      erro
    );



    /* =====================================================
       MESMO SE A ROTA FALHAR,
       MOSTRAR OS 8 MARCADORES
       ===================================================== */

    if (marcadores.length > 0) {


      const grupo =

        L.featureGroup(
          marcadores
        );



      mapa.fitBounds(

        grupo.getBounds(),

        {

          padding: [40, 40]

        }

      );

    }



    /* =====================================================
       MOSTRAR AVISO
       ===================================================== */

    if (loading) {

      loading.innerHTML =

        '<div class="loading-icon">⚠️</div>' +

        "<p>" +

        "Não foi possível calcular a rota." +

        "</p>";

    }

  }

}



/* =========================================================
   INICIAR
   ========================================================= */

calcularRota();