function generateID() {
    const id = "PA-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('aerus_id', id);
    document.getElementById('id-display').innerHTML = `ID : <strong>${id}</strong>`;
}

function login() {
    const inputID = document.getElementById('user-id').value;
    if (inputID === localStorage.getItem('aerus_id')) {
        document.getElementById('auth-container').style.display = "none";
        document.getElementById('app-container').style.display = "block";
        for(let i=0; i<5; i++) addRow(); 
    } else { alert("ID incorrect"); }
}

function addRow(name = "") {
    const tbody = document.getElementById('subjects-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" value="${name}" placeholder="Matière"></td>
        <td><input type="number" class="coeff" value="1" min="1"></td>
        <td>
            <div class="note-inputs">
                <input type="number" class="i1" placeholder="n1">
                <input type="number" class="i2" placeholder="n2">
                <input type="number" class="i3" placeholder="n3">
            </div>
        </td>
        <td>
            <div class="note-inputs">
                <input type="number" class="d1" placeholder="n1">
                <input type="number" class="d2" placeholder="n2">
                <input type="number" class="d3" placeholder="n3">
            </div>
        </td>
        <td class="moy-matiere">-</td>
        <td class="moy-coeff">-</td>
    `;
    tbody.appendChild(row);
}

function calculerBulletin() {
    const rows = document.querySelectorAll('#subjects-body tr');
    let sommePointsCoeff = 0;
    let sommeCoeffs = 0;

    rows.forEach(row => {
        const c = parseFloat(row.querySelector('.coeff').value) || 0;
        
        // Moyenne Interros (prend en compte uniquement les cases remplies)
        const getMoy = (selector) => {
            const inputs = Array.from(row.querySelectorAll(selector));
            const notes = inputs.map(i => parseFloat(i.value)).filter(n => !isNaN(n));
            return notes.length > 0 ? notes.reduce((a, b) => a + b) / notes.length : 0;
        };

        const moyInt = getMoy('.i1, .i2, .i3');
        const moyDev = getMoy('.d1, .d2, .d3');

        const moyMat = (moyInt + moyDev) / 2;
        const moyC = moyMat * c;

        row.querySelector('.moy-matiere').innerText = moyMat.toFixed(2);
        row.querySelector('.moy-coeff').innerText = moyC.toFixed(2);

        sommePointsCoeff += moyC;
        sommeCoeffs += c;
    });

    const generale = sommeCoeffs > 0 ? sommePointsCoeff / sommeCoeffs : 0;
    document.getElementById('moy-gen').innerText = generale.toFixed(2);
}

function changeTheme(color) {
    document.documentElement.style.setProperty('--primary-color', color);
}
