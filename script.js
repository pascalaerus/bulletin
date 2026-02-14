function generateID() {
    const id = "PA-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('aerus_id', id);
    document.getElementById('id-display').innerHTML = `Votre ID : <strong>${id}</strong>`;
}

function login() {
    if (document.getElementById('user-id').value === localStorage.getItem('aerus_id')) {
        document.getElementById('auth-container').style.display = "none";
        document.getElementById('app-container').style.display = "block";
        togglePeriodes();
        for(let i=0; i<5; i++) addRow();
    } else { alert("Accès refusé."); }
}

function togglePeriodes() {
    const type = document.getElementById('type-période').value;
    const num = document.getElementById('num-période');
    num.innerHTML = "";
    const max = (type === "Trimestre") ? 3 : 2;
    for(let i=1; i<=max; i++) {
        num.innerHTML += `<option value="${i}">${i}${i==1?'er':''} ${type}</option>`;
    }
}

function previewLogo(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const img = document.getElementById('logo-img');
        img.src = reader.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function addRow(name = "") {
    const tbody = document.getElementById('subjects-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" value="${name}" class="cell-input"></td>
        <td><input type="number" class="coef" value="1" oninput="calculs()"></td>
        <td><input type="number" class="i1" oninput="calculs()"></td>
        <td><input type="number" class="i2" oninput="calculs()"></td>
        <td><input type="number" class="i3" oninput="calculs()"></td>
        <td><input type="number" class="d1" oninput="calculs()"></td>
        <td><input type="number" class="d2" oninput="calculs()"></td>
        <td><input type="number" class="d3" oninput="calculs()"></td>
        <td class="m-mat">0.00</td>
        <td class="m-coef">0.00</td>
    `;
    tbody.appendChild(row);
}

function calculs() {
    let tPts = 0, tCoef = 0;
    document.querySelectorAll('#subjects-body tr').forEach(row => {
        const c = parseFloat(row.querySelector('.coef').value) || 0;
        const getM = (sel) => {
            const n = Array.from(row.querySelectorAll(sel)).map(i=>parseFloat(i.value)).filter(v=>!isNaN(v));
            return n.length ? n.reduce((a,b)=>a+b)/n.length : 0;
        };
        const moy = (getM('.i1,.i2,.i3') + getM('.d1,.d2,.d3')) / 2;
        row.querySelector('.m-mat').innerText = moy.toFixed(2);
        row.querySelector('.m-coef').innerText = (moy * c).toFixed(2);
        tPts += (moy * c); tCoef += c;
    });
    document.getElementById('total-pts').innerText = tPts.toFixed(2);
    document.getElementById('total-coefs').innerText = tCoef;
    document.getElementById('moy-gen').innerText = tCoef ? (tPts/tCoef).toFixed(2) : "0.00";
}

function validerEtImprimer() {
    // Mise à jour des textes d'en-tête
    document.getElementById('disp-school').innerText = document.getElementById('school-name').value || "ÉTABLISSEMENT NON DÉFINI";
    document.getElementById('disp-year').innerText = "Année : " + document.getElementById('school-year').value;

    // Validation des champs obligatoires
    const champs = ['nom', 'dob', 'lieu', 'classe', 'school-name'];
    let vide = champs.some(id => !document.getElementById(id).value);

    if (vide) {
        alert("Attention : Toutes les informations de l'élève et de l'établissement doivent être remplies avant l'impression !");
    } else {
        calculs();
        window.print();
    }
}
