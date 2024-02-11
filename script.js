document.addEventListener("DOMContentLoaded", function() {
    const victoriasLista = document.getElementById("victorias-lista");
    const configForm = document.getElementById("config-form");
    const cartonesContainer = document.getElementById("cartones");
    const sacarNumeroBtn = document.getElementById("sacar-numero");
    const numeroSacadoDiv = document.getElementById("numero-sacado");
    const contadorElemento = document.getElementById("contador");
    const terminarJuegoBtn = document.getElementById("terminar-juego");

  
    let jugadores = [];
    let cartones = [];
    let puntajes = [];
    let contadorClicks = 0;
  
    // Cargar victorias acumuladas desde localStorage
    function cargarVictorias() {
      const victoriasGuardadas = JSON.parse(localStorage.getItem("victorias")) || {};
      for (const jugador in victoriasGuardadas) {
        const listItem = document.createElement("li");
        listItem.textContent = `${jugador}: ${victoriasGuardadas[jugador]}`;
        victoriasLista.appendChild(listItem);
      }
    }
  
    cargarVictorias();
  
    // Generar cartón de tamaño N x N
    function generarCarton(tamaño) {
      const numerosDisponibles = Array.from({ length: 50 }, (_, i) => i + 1);
      const carton = [];
      for (let i = 0; i < tamaño; i++) {
        const fila = [];
        for (let j = 0; j < tamaño; j++) {
          const randomIndex = Math.floor(Math.random() * numerosDisponibles.length);
          fila.push(numerosDisponibles.splice(randomIndex, 1)[0]);
        }
        carton.push(fila);
      }
      return carton;
    }
  
    // Iniciar juego de Bingo
    function iniciarJuego(event) {
      event.preventDefault();
      const jugador1 = document.getElementById("player1").value;
      const jugador2 = document.getElementById("player2").value;
      const jugador3 = document.getElementById("player3").value;
      const jugador4 = document.getElementById("player4").value;
      // Obtener nombres de los jugadores
      jugadores = [jugador1,jugador2,jugador3,jugador4];
      // Generar cartones para todos los jugadores
      const tamañoCarton = parseInt(document.getElementById("carton-size").value);
      cartones = jugadores.map(() => generarCarton(tamañoCarton));
      // Mostrar cartones en la interfaz
      mostrarCartones();
      // Mostrar sección de juego y ocultar menú principal
      document.getElementById("menu").style.display = "none";
      document.getElementById("juego").style.display = "block";
    }
  
    // Mostrar cartones en la interfaz
    function mostrarCartones() {
      cartonesContainer.innerHTML = "";
      cartones.forEach((carton, index) => {
        const cartonDiv = document.createElement("div");
        cartonDiv.classList.add("carton");
        cartonDiv.innerHTML = `<h3>${jugadores[index]}</h3>`;
        const table = document.createElement("table");
        carton.forEach(fila => {
          const tr = document.createElement("tr");
          fila.forEach(numero => {
            const td = document.createElement("td");
            td.textContent = numero;
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        cartonDiv.appendChild(table);
        cartonesContainer.appendChild(cartonDiv);
      });
    }
    
    // Sacar número de Bingo aleatorio
    function sacarNumero() {
        const numero = generarNumeroAleatorio();
        numeroSacadoDiv.textContent = `Número sacado: ${numero}`;
        // Actualizar cartones y puntajes
        cartones.forEach((carton, index) => {
          const marca = marcarNumero(carton, numero);
          if (marca) {
            calcularPuntajes(marca, index);
            mostrarCartones();
          }
        });
    }
  
    // Generar número aleatorio entre 1 y 50
    function generarNumeroAleatorio() {
      return Math.floor(Math.random() * 50) + 1;
    }

    function marcarNumero(carton, numero) {
        for (let i = 0; i < carton.length; i++) {
          const fila = carton[i];
          const numeroIndex = fila.indexOf(numero);
          if (numeroIndex !== -1) {
            fila[numeroIndex] = "X";
            return { fila: i, columna: numeroIndex };
          }
        }
        return null;
    }

    // Calcular puntajes y verificar si hay ganador
    function calcularPuntajes(marca, jugadorIndex) {
        const [fila, columna] = [marca.fila, marca.columna];
        // Verificar si hay línea horizontal
        const lineaHorizontal = cartones[jugadorIndex][fila].every(num => num === "X");
        // Verificar si hay línea vertical
        const lineaVertical = cartones[jugadorIndex].every(fila => fila[columna] === "X");
        // Verificar si hay línea diagonal (principal o inversa)
        const diagonalPrincipal = cartones[jugadorIndex].every((fila, i) => fila[i] === "X");
        const diagonalInversa = cartones[jugadorIndex].every((fila, i) => fila[fila.length - 1 - i] === "X");
      
        let puntaje = 0;
        if (lineaHorizontal) puntaje += 1;
        if (lineaVertical) puntaje += 1;
        if (diagonalPrincipal || diagonalInversa) puntaje += 3;
      
        puntajes[jugadorIndex] = (puntajes[jugadorIndex] || 0) + puntaje;
        // Actualizar tabla de puntajes
        actualizarTablaPuntajes();
        // Verificar si hay cartón lleno
        const cartonLleno = cartones[jugadorIndex].every(fila => fila.every(num => num === "X"));
        if (cartonLleno || puntajes[jugadorIndex] >= 5) {
          // Terminar juego
          finalizarJuego(jugadorIndex);
        }
    }

        // Actualizar tabla de puntajes
    function actualizarTablaPuntajes() {
        const puntajesTabla = document.getElementById("puntajes-tabla");
        puntajesTabla.innerHTML = "";
        puntajes.forEach((puntaje, index) => {
            const jugador = jugadores[index];
            const row = document.createElement("tr");
            row.innerHTML = `<td>${jugador}</td><td>${puntaje}</td>`;
            puntajesTabla.appendChild(row);
        });
    }

    // Finalizar juego y mostrar resultados
    function finalizarJuego(jugadorIndex) {
      const victoriasGuardadas = JSON.parse(localStorage.getItem("victorias")) || {};
      const jugador = jugadores[jugadorIndex];
      const victorias = (victoriasGuardadas[jugador] || 0) + 1;
      victoriasGuardadas[jugador] = victorias;
      localStorage.setItem("victorias", JSON.stringify(victoriasGuardadas));
      alert(`¡Felicidades ${jugador}! Has ganado el juego.`);
      location.reload();
    }
    
    // Manejar evento de terminar juego
    terminarJuegoBtn.addEventListener("click", () => {
    finalizarJuego();
    });
    // Manejar evento de inicio de juego
    configForm.addEventListener("submit", iniciarJuego);
    // Manejar evento de sacar número de Bingo
    sacarNumeroBtn.addEventListener("click", sacarNumero);
    // Manejar evento de sacar número de Bingo
    sacarNumeroBtn.addEventListener("click", () => {
    contadorClicks++;
    contadorElemento.textContent = contadorClicks;
  });
  });
  