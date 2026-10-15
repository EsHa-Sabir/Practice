// AUDIO ELEMENTS
const humSound = document.getElementById("sound-hum");
const heartbeatSound = document.getElementById("sound-heartbeat");
const flashSound = document.getElementById("sound-flash");
const soundMarsWind = document.getElementById("sound-mars-wind");
const soundDustStorm = document.getElementById("sound-dust-storm");
const soundRotor = document.getElementById("sound-rotor-damage");

// TERMINAL ELEMENTS
const typeContainer = document.getElementById("typewriter-text");
const actionDiv = document.getElementById("mission-action");
const acceptBtn = document.getElementById("accept-btn");
const chapter1 = document.getElementById("chapter-1");
const chapter2 = document.getElementById("chapter-2");

// STORY LINES[cite: 32]
const lines = [
    "YEAR: 2126",
    "Insaniyat Chand par gayi. Insaniyat Mars par gayi. Insaniyat ne door signals bheje.",
    "Phir, isne jo nishan chhore the unme se kuch bhula diye gaye.",
    "---PAUSE---",
    "THE HUMAN ARCHIVE",
    "ARCHIVE STATUS: INCOMPLETE. LAST UPDATE: 2026. ARCHIVE RECORDS: 9. ACCESSIBLE: 0/9.",
    "Jab hum ek duniya ko piche chhor dete hain, toh hum uske sath kya chhortay hain?",
    "RECORDS MISSING. TRACES ERASED. STORIES INCOMPLETE.",
    "THESE TRACES NEED A SPACE ARCHAEOLOGIST."
];

let lineIdx = 0;
let charIdx = 0;

function typeWriter() {
    if (lineIdx < lines.length) {
        let currentText = lines[lineIdx];

        if (currentText === "---PAUSE---") {
            lineIdx++;
            setTimeout(typeWriter, 3000);
            return;
        }

        let p = document.getElementById(`line-${lineIdx}`);
        if (!p) {
            p = document.createElement("p");
            p.id = `line-${lineIdx}`;
            p.className = "terminal-line";
            if(currentText.includes("YEAR") || currentText.includes("THE HUMAN ARCHIVE")) {
                p.classList.add("highlight");
            }
            typeContainer.appendChild(p);
        }

        if (charIdx < currentText.length) {
            p.textContent += currentText.charAt(charIdx);
            charIdx++;
            
            if(humSound.paused) {
                humSound.play().catch(e => console.log("Audio waiting for user interaction"));
            }

            setTimeout(typeWriter, 30);
        } else {
            lineIdx++;
            charIdx = 0;
            setTimeout(typeWriter, 600);
        }
    } else {
        heartbeatSound.play().catch(e => {});
        actionDiv.classList.remove("hidden");
    }
}

window.onload = () => {
    setTimeout(typeWriter, 1000);
};

// ACCEPT MISSION
acceptBtn.addEventListener("click", () => {
    flashSound.play().catch(e => {});
    document.body.style.backgroundColor = "#ffffff";
    chapter1.classList.add("hidden");

    setTimeout(() => {
        document.body.style.backgroundColor = "#000000";
        alert("SPACE ARCHAEOLOGIST IDENTIFICATION ASSIGNED");
        chapter2.classList.remove("hidden");
        localStorage.setItem("SpaceBadge", "HUMAN-2126-ASSIGNED");
    }, 1000);
});

// MOON MODAL & LOGIC
const moonCard = document.getElementById("moon-card");
const moonModal = document.getElementById("moon-modal");
const closeMoonBtn = document.getElementById("close-moon-btn");
const moonProgressText = document.getElementById("moon-progress");
let moonUnlockedCount = 0;
let openedClues = 0;

moonCard.addEventListener("click", () => {
    if(!moonCard.classList.contains("locked")) {
        moonModal.classList.remove("hidden");
    }
});

closeMoonBtn.addEventListener("click", () => {
    moonModal.classList.add("hidden");
});

const accordions = document.querySelectorAll(".accordion");
accordions.forEach((acc) => {
    acc.addEventListener("click", function() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
            if (!this.dataset.opened) {
                this.dataset.opened = "true";
                openedClues++;
                if (openedClues === 4) {
                    document.getElementById("rec1-result").classList.remove("hidden");
                    unlockMoonRecord(2);
                }
            }
        }
    });
});

document.getElementById("sim-btn").addEventListener("click", () => {
    document.getElementById("sim-canvas").classList.remove("hidden");
    document.getElementById("sim-btn").style.display = "none";
    unlockMoonRecord(3);
});

function makeChoice(choice) {
    const resBox = document.getElementById("choice-result");
    const msg = document.getElementById("choice-msg");
    msg.textContent = `Aapne "${choice}" chuna. Insaniyat ne memorial apne jazbaat bayan karne ke liye chhode.`;
    resBox.classList.remove("hidden");
    updateMoonProgress(3);
}

function unlockMoonRecord(recNum) {
    const recBox = document.getElementById(`record-${recNum}`);
    if (recBox) {
        recBox.classList.remove("locked-rec");
    }
    updateMoonProgress(recNum - 1);
}

function updateMoonProgress(count) {
    moonUnlockedCount = count;
    moonProgressText.textContent = `${moonUnlockedCount}/3`;
    document.querySelector("#moon-card p").textContent = `[ ${moonUnlockedCount}/3 ]`;

    // Moon Complete (3/3) -> Unlock Mars Card[cite: 33]
    if (moonUnlockedCount === 3) {
        const marsCard = document.getElementById("mars-card");
        marsCard.classList.remove("locked");
        marsCard.classList.add("active");
        marsCard.style.cursor = "pointer";
    }
}

// MARS MODAL & LOGIC
const marsCard = document.getElementById("mars-card");
const marsModal = document.getElementById("mars-modal");
const closeMarsBtn = document.getElementById("close-mars-btn");
const marsProgressText = document.getElementById("mars-progress");
let marsCount = 0;

marsCard.addEventListener("click", () => {
    if(!marsCard.classList.contains("locked")) {
        marsModal.classList.remove("hidden");
        soundMarsWind.play().catch(e => {});
    }
});

closeMarsBtn.addEventListener("click", () => {
    marsModal.classList.add("hidden");
    soundMarsWind.pause();
});

document.getElementById("btn-pathfinder").addEventListener("click", function() {
    this.style.display = "none";
    document.getElementById("res-pathfinder").classList.remove("hidden");
    document.getElementById("record-5").classList.remove("locked-rec");
    updateMarsProgress(1);
});

document.getElementById("btn-mera").addEventListener("click", function() {
    this.style.display = "none";
    document.getElementById("res-mera").classList.remove("hidden");
    document.getElementById("record-6").classList.remove("locked-rec");
    updateMarsProgress(2);
});

// Opportunity Dust Storm & Silence Logic[cite: 33]
const timeBtns = document.querySelectorAll(".time-btn");
timeBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        if(this.classList.contains("active")) return;
        this.classList.add("active");
        
        if(this.dataset.year === "2018") {
            document.getElementById("res-oppy").classList.remove("hidden");
            const statusText = document.getElementById("oppy-status");
            statusText.textContent = "2018 A MAJOR DUST STORM ON MARS...";
            
            soundMarsWind.pause(); 
            soundDustStorm.play().catch(e=>{});
            
            setTimeout(() => {
                soundDustStorm.pause(); // Toofan achanak band[cite: 33]
                statusText.textContent = "SIGNAL LOST. (Silence...)[cite: 33]";
                
                setTimeout(() => {
                    document.getElementById("oppy-data").classList.remove("hidden");
                    document.getElementById("oppy-story").classList.remove("hidden");
                    document.getElementById("record-7").classList.remove("locked-rec");
                    updateMarsProgress(3);
                }, 5000); // 5 seconds exact silence[cite: 33]

            }, 4000);
        }
    });
});

// Ingenuity Slider & Shake[cite: 34]
const flightSlider = document.getElementById("flight-slider");
const flightCountText = document.getElementById("flight-count");
let ingenuityCompleted = false;

flightSlider.addEventListener("input", function() {
    if(ingenuityCompleted) return;
    flightCountText.textContent = this.value;
    
    if(this.value == 72) {
        ingenuityCompleted = true;
        this.disabled = true;
        
        marsModal.classList.add("shake-screen");
        setTimeout(() => marsModal.classList.remove("shake-screen"), 500);
        
        soundRotor.play().catch(e=>{});
        
        document.getElementById("res-ingenuity").classList.remove("hidden");
        updateMarsProgress(4);
        
        // Unlock Other Traces card[cite: 34]
        const otherTracesCard = document.querySelectorAll(".card")[2];
        otherTracesCard.classList.remove("locked");
        otherTracesCard.classList.add("active");
        otherTracesCard.style.cursor = "pointer";
    }
});

function updateMarsProgress(count) {
    marsCount = count;
    marsProgressText.textContent = `${marsCount}/4`;
    document.querySelector("#mars-card p").textContent = `[ ${marsCount}/4 ]`;
}