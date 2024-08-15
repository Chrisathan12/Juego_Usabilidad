// Llama a startGame cuando se carga la página
document.addEventListener('DOMContentLoaded', startGame);

// Lista de organelos disponibles
let availableOrganelles = ['nucleus', 'mitochondria'];
let score = 0;

//variables de tiempo
let timerDuration = 300;
let timerInterval; 
let isPaused = false;
let pauseTime;

//Zoom variables
let zoomLevel = 1;
const zoomStep = 0.1;  // Define cuánto aumenta o disminuye el zoom por cada clic
const maxZoomIn = 2;   // Máximo nivel de zoom
const maxZoomOut = 0.5; // Mínimo nivel de zoom

// Información de organelos
const organelInfo = {
    'nucleus': {
        description: 'El núcleo es el centro de control de la célula, donde se encuentra el ADN.',
        image: 'images/nucleus.jpg' // falta las imagenes
    },
    'mitochondria': {
        description: 'Las mitocondrias son las encargadas de producir la energía de la célula.',
        image: 'images/mitochondria.jpg' 
    },
    // Añadir más organelos según sea necesario
};

// Función para iniciar el juego
function startGame() {
    // Selecciona un organelo al azar y actualiza el texto de la instrucción
    showAvailableOrganelles()
    startTimer();

}

// Asociar los eventos a los elementos relevantes
document.getElementById('instruction-text2').addEventListener('dragstart', handleDragStart);
document.getElementById('cell-svg').addEventListener('dragover', handleDragOver);
document.querySelectorAll('polygon').forEach(function(element) {
    element.addEventListener('drop', handleDrop);
});

// Función para manejar el dragstart
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-organelle'));
}
// Función para manejar el dragover
function handleDragOver(event) {
    event.preventDefault(); // Necesario para permitir el drop
}

// Función para manejar el drop
function handleDrop(event) {
    event.preventDefault();
    const droppedOrganelle = event.dataTransfer.getData('text/plain');
    const targetOrganelle = event.target.getAttribute('id');
    if (droppedOrganelle === targetOrganelle) {
        event.target.classList.remove('hidden-border');
        availableOrganelles = availableOrganelles.filter(organelle => organelle !== droppedOrganelle);
        updateScore(10);
        if (availableOrganelles.length === 0) {
            showFinalModal();
            return;
        }
        showCongratulations(10);
        if (availableOrganelles.length > 0) {
            showAvailableOrganelles()
        }
    } else {
        // Mostrar el modal de "Buen intento"
        document.getElementById('incorrect-part').textContent = document.getElementById('instruction-text2').textContent;
        var tryAgainModal = new bootstrap.Modal(document.getElementById('tryAgainModal'));
        tryAgainModal.show();

        // Permitir el control por teclado en los botones del modal
        document.getElementById('return-btn').focus();
        document.getElementById('return-btn').addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                document.getElementById('hint-btn').focus();
            }
        });
        document.getElementById('hint-btn').addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                document.getElementById('return-btn').focus();
            }
        });

        document.getElementById('hint-btn').addEventListener('click', function() {
            showHintModal();
        });
    }
}

function showAvailableOrganelles() {
    const selectedOrganelle = getRandomOrganelle();
    const instructionText = document.getElementById('instruction-text2');
    instructionText.textContent = `${selectedOrganelle}`;
    instructionText.setAttribute('data-organelle', selectedOrganelle);
}

// Función para seleccionar un organelo al azar de la lista disponible
function getRandomOrganelle() {
    const randomIndex = Math.floor(Math.random() * availableOrganelles.length);
    return availableOrganelles[randomIndex];
}

// Evento click del botón de pausa
document.getElementById('pause-btn').addEventListener('click', function () {
    if (!isPaused) {
      clearInterval(timerInterval); // Detener el temporizador
      pauseTime = timerDuration; // Suponiendo que elapsedTime es el tiempo transcurrido hasta ahora
      showPauseModal();
      isPaused = true;
    }
  });

function showPauseModal(){
    document.getElementById('pause-time-summary').textContent = formatTime(pauseTime);
    document.getElementById('pause-points-summary').textContent = score;
    $('#pauseModal').modal('show');
}

document.getElementById('resumen-btn').addEventListener('click', function () {
    if (isPaused) {
        $('#pauseModal').modal('hide');
        timerInterval = setInterval(updateTimer, 1000); 
        isPaused = false;
    }
});

// Función para actualizar el temporizador
function updateTimer() {
    timerDuration -= 1; 
    document.getElementById('timer').textContent = formatTime(timerDuration); // Actualizar la visualización del temporizador
  }

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes} min : ${seconds} sec`;
}

// Función para iniciar el temporizador
function startTimer() {
    clearInterval(timerInterval);
    timerDuration = 300;
    timerInterval = setInterval(() => {
        const timerElement = document.getElementById('timer');
        let minutes = Math.floor(timerDuration / 60);
        let seconds = timerDuration % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerElement.textContent = `${minutes} min : ${seconds} sec`;
        timerDuration--;

        if (timerDuration <=0) {
            clearInterval(timerInterval); 
            showTimeUpModal();
        }
    }, 1000);
}

// Función para actualizar la puntuación en el DOM
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

// Función para regresar a la pantalla de inicio
document.getElementById('back-to-start').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Función para manejar el modal de ayuda
document.getElementById('help-btn').addEventListener('click', function() {
    var helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
    helpModal.show();
});

function resetGame() {
    availableOrganelles = ['nucleus', 'mitochondria']; 
    score = 0;
    updateScore(score)
    const polygons = document.querySelectorAll('#cell-svg polygon');
    polygons.forEach(polygon => {
        polygon.classList.add('hidden-border')
    });
    startTimer();
}

document.getElementById('zoom-in').addEventListener('click', function() {
    if (zoomLevel < maxZoomIn) {
        zoomLevel += zoomStep;
        applyZoom();
    }
});

document.getElementById('zoom-out').addEventListener('click', function() {
    if (zoomLevel > maxZoomOut) {
        zoomLevel -= zoomStep;
        applyZoom();
    }
});

function applyZoom() {
    const svgElement = document.getElementById('cell-svg');
    svgElement.style.transform = `scale(${zoomLevel})`;
    svgElement.style.transformOrigin = 'center center'; 
}

function applyZoom() {
    const svgElement = document.getElementById('cell-svg');
    svgElement.style.transform = `scale(${zoomLevel})`;
    svgElement.style.transformOrigin = 'center center'; 
}

/*function showInfo(organelleName) {
    const infoBox = document.getElementById('info-box');
    const organelInfo = {
        'nucleus': 'Información sobre el núcleo.',
        'mitochondria': 'Información sobre las mitocondrias.',
        // Añadir más organelos según sea necesario
    };

    infoBox.textContent = organelInfo[organelleName] || "Haz clic en un organelo para ver más información.";
    infoBox.classList.remove('hidden');
}*/

// Mostrar el modal de felicitaciones
function showCongratulations(points) {
    const instructionText = document.getElementById('instruction-text2').textContent;
    
    // Configurar el contenido del modal de felicitaciones
    document.getElementById('congratulationsModalLabel').textContent = `¡Felicitaciones! Has ganado ${points} puntos.`;
    document.getElementById('congratulations-message').textContent = `¡Eres increíble! Seleccionaste correctamente ${instructionText}.`;

    var congratulationsModal = new bootstrap.Modal(document.getElementById('congratulationsModal'));
    congratulationsModal.show();

    // Permitir el control por teclado en los botones
    document.getElementById('continue-playing-btn').focus();
    document.getElementById('continue-playing-btn').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            congratulationsModal.hide();
        }
    });

    /*document.getElementById('learn-more-btn').addEventListener('click', function() {
        // Mostrar el modal de pista asociado
        congratulationsModal.hide();
        showHintModal();
    });*/
}

// Mostrar el modal de pista 
function showHintModal() {
    const currentOrganelle = document.getElementById('instruction-text2').textContent;
    const organelData = organelInfo[currentOrganelle];

    // Configurar el contenido del modal de pista
    document.getElementById('hintModalLabel').textContent = currentOrganelle;
    document.getElementById('organelle-description').textContent = organelData.description;
    document.getElementById('organelle-image').innerHTML = `<img src="${organelData.image}" alt="Imagen de ${currentOrganelle}" class="img-fluid">`;

    var hintModal = new bootstrap.Modal(document.getElementById('hintModal'));
    hintModal.show();

    // Permitir el control por teclado en el botón de retorno
    document.getElementById('return-to-game-btn').focus();
    document.getElementById('return-to-game-btn').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            hintModal.hide();
        }
    });
}

function showFinalModal() {
    const finalTime = document.getElementById('timer').innerText;
    const finalScore = score; 
    console.log(finalTime)

    let minutes = Math.floor(timerDuration / 60);
    let seconds = timerDuration % 60;

    const finalTimer = 300 - (seconds + Math.floor(minutes*60))
    let minutesf = Math.floor(finalTimer / 60);
    let secondsf = finalTimer % 60;


    document.getElementById('final-time').innerText = `Tiempo tomado: ${minutesf} min : ${secondsf} sec`;
    document.getElementById('final-score').innerText = `Puntaje obtenido: ${finalScore}`;

    // Mostrar el modal con opciones para prevenir cierre con backdrop y teclado
    const finalModal = new bootstrap.Modal(document.getElementById('finalModal'), {
        backdrop: 'static', // Evita cerrar el modal haciendo clic fuera
        keyboard: false // Desactiva el cierre con teclado, pero permite navegación por teclado
    });
    finalModal.show();

    // Foco en el botón de "Seguir jugando" al abrir el modal
    const playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.focus();

    playAgainBtn.addEventListener('click', function() {
        finalModal.hide();
        resetGame(); 
    });

    const exitGameBtn = document.getElementById('exitGameBtn');
    exitGameBtn.addEventListener('click', function() {
        window.location.href = 'index.html'; 
    });

    // Desactivar cierre con tecla Escape
    document.getElementById('finalModal').addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            event.preventDefault(); 
        }
    });
}

function showTimeUpModal() {
    document.getElementById('timeOut-score').textContent = `Puntos totales obtenidos: ${score}`;
    const showTimeUpModal = new bootstrap.Modal(document.getElementById('timeUpModal'), {
        backdrop: 'static', // Evita cerrar el modal haciendo clic fuera
        keyboard: false // Desactiva el cierre con teclado, pero permite navegación por teclado
    });
    showTimeUpModal.show();

    document.getElementById('continueBtn').addEventListener('click',() => {
        showTimeUpModal.hide()
        resetGame()
    })

    document.getElementById('exitBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    })
}