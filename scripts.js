document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-button').addEventListener('click', function() {
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('game-screen').classList.remove('hidden');
    });

    document.getElementById('restart-button').addEventListener('click', function() {
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('start-button').style.display = 'block';
    });
});

function showInfo(organelleName) {
    const infoBox = document.getElementById('info-box');
    const organelInfo = {
        'nucleus': 'Información sobre el núcleo.',
        'mitochondria': 'Información sobre las mitocondrias.',
        // Añadir más organelos según sea necesario
    };

    infoBox.textContent = organelInfo[organelleName] || "Haz clic en un organelo para ver más información.";
    infoBox.classList.remove('hidden');
}
