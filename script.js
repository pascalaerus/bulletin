function generateID() {
    const id = "AERUS-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('aerus_id', id);
    document.getElementById('id-display').innerHTML = `Votre ID : <strong style="color:#E8112D">${id}</strong> (Notez-le)`;
}

function login() {
    const input = document.getElementById('user-id').value;
    if(input === localStorage.getItem('aerus_id')) {
        document.getElementById('auth-container').style.display = "none";
        document.getElementById('app-container').style.display = "block";
        updateP();
        for(let i=0; i<8; i++) addRow();
    } else { alert("ID incorrect !"); }
}

function updateP() {
    const type = document.getElementById('type-p').value;
    const num = document.getElementById('num-p');
    num.innerHTML = "";
    const limit = (type === "Trimestre") ? 3 : 2;
    for(let i=1; i<=limit; i++) num.innerHTML += `<option value="${i}">${i}${i==1?'er':'ème'} ${type}</option>`;
}

function previewLogo(e) {
    const reader = new FileReader();
    reader.onload = () => { 
        const img = document.getElementById('logo-img');
        img.src = reader.result; img.style.display = "block";
    };
    reader.readAsDataURL(e.target.files[0]);
}

function addRow() {
    const tbody = document.getElementById('grades-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" placeholder="Matière" style="width:110px; border:none; border-bottom:1px solid #eee;"></td>
        <td><input type="number" class="c" value="1" oninput="calc()"></td>
        <td><input type="number" class="n" oninput="calc()"></td>
        <td><input type="number" class="n" oninput="calc()"></td>
        <td><input type="number" class="n" oninput="calc()"></td>
        <td><input type="number" class="d" oninput="calc()"></td>
        <td><input type="number" class="d" oninput="calc()"></td>
        <td><input type="number" class="d" oninput="calc()"></td>
        <td class="m-mat" style="font-weight:bold">0.00</td>
        <td class="m-coef" style="font-weight:bold">0.00</td>
    `;
    tbody.appendChild(row);
}

function calc() {
    let tPoints = 0, tCoefs = 0;
    document.querySelectorAll('#grades-body tr').forEach(tr => {
        const c = parseFloat(tr.querySelector('.c').value) || 0;
        const getM = (sel) => {
            const vals = Array.from(tr.querySelectorAll(sel)).map(i=>parseFloat(i.value)).filter(v=>!isNaN(v));
            return vals.length ? vals.reduce((a,b)=>a+b)/vals.length : 0;
        };
        const m = (getM('.n') + getM('.d')) / 2;
        tr.querySelector('.m-mat').innerText = m.toFixed(2);
        tr.querySelector('.m-coef').innerText = (m * c).toFixed(2);
        tPoints += (m * c); tCoefs += c;
    });
    document.getElementById('total-points').innerText = tPoints.toFixed(2);
    document.getElementById('total-coefs').innerText = tCoefs;
    document.getElementById('moy-gen').innerText = tCoefs ? (tPoints/tCoefs).toFixed(2) : "0.00";
}

function printReport() {
    const school = document.getElementById('school-name').value;
    const name = document.getElementById('nom').value;
    const dob = document.getElementById('dob').value;

    if(!school || !name || !dob) {
        alert("🛑 Erreur Pascal Aérus : Veuillez remplir le nom de l'école, de l'élève et sa date de naissance !");
        return;
    }

    document.getElementById('disp-school').innerText = school.toUpperCase();
    document.getElementById('disp-year').innerText = "Année : " + document.getElementById('school-year').value;

    // GENERATION PDF POUR APPLICATION ET NAVIGATEUR
    const element = document.getElementById('bulletin-paper');
    const opt = {
        margin: 0,
        filename: 'Bulletin_' + name + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
