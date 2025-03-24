// Get canvas and context
const canvas = document.getElementById('musicStaff');
const ctx = canvas.getContext('2d');

let currentNote = null;
let noteGuessed = false;
let fingerGuessed = false;

// Define note range (G3 to B5)
const notes = [
    'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'
];

// Define correct finger positions for each note
const fingerPositions = {
    'G3': [0], 'A3': [1], 'B3': [2], 'C4': [3],
    'D4': [4, 0], 'E4': [1], 'F4': [2], 'G4': [3],
    'A4': [4, 0], 'B4': [1], 'C5': [2], 'D5': [3],
    'E5': [4, 0], 'F5': [1], 'G5': [2], 'A5': [3],
    'B5': [4]
};

// Add at the top with other state variables
const audioFiles = {};

// Add these variables at the top with other state variables
let startTime = null;
let timerInterval = null;
let xpPoints = 0;
let totalAttempts = 0;
let correctAttempts = 0;

// Define notes that need a sharp
const sharpNotes = ['F4', 'C5', 'F5', 'G5'];

// Function to check if a note needs a sharp
function noteNeedsSharp(note) {
    return sharpNotes.includes(note);
}

// Function to generate a random note
function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    const note = notes[randomIndex];
    
    // For display and internal logic purposes, keep the note name as is
    return note;
    
    // If we wanted to add sharp to the note name (e.g., F4♯), we could do:
    // return sharpNotes.includes(note) ? note + '♯' : note;
}

// Function to draw the staff lines
function drawStaff() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Draw 5 staff lines - moved down by adding 50px
    for (let i = 0; i < 5; i++) {
        const y = 150 + (i * 20); // Changed from 100 to 150 to move staff down
        ctx.moveTo(50, y);
        ctx.lineTo(350, y);
    }
    ctx.stroke();

    // Draw treble clef using SVG - adjusted position
    ctx.drawImage(images.trebleClef, 55, 110, 110, 160); // y changed from 60 to 110
}

// Calculate note position (simplified for now)
const notePositions = {
    // Below staff
    'G3': 280, // Lowest note - below two ledger lines
    'A3': 270, // On second ledger line
    'B3': 260, // Between ledger lines
    'C4': 250, // On first ledger line
    'D4': 240, // Space below bottom line
    
    // On staff
    'E4': 230, // Bottom line (first line)
    'F4': 220, // First space
    'G4': 210, // Second line
    'A4': 200, // Second space
    'B4': 190, // Third line
    'C5': 180, // Third space
    'D5': 170, // Fourth line
    'E5': 160, // Fourth space
    'F5': 150, // Fifth line (top line)
    
    // Above staff
    'G5': 140, // Space above staff
    'A5': 130, // First ledger line above
    'B5': 120  // Space above first ledger
};

// Update ledger line positions
function drawLedgerLines(note, noteX) {
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'black';
    
    const lineLength = 45;
    
    if (notes.indexOf(note) <= notes.indexOf('D4')) {
        switch(note) {
            case 'G3':
            case 'A3':
                // Two ledger lines for G3/A3
                ctx.moveTo(noteX - lineLength/2, 250); // First ledger line
                ctx.lineTo(noteX + lineLength/2, 250);
                ctx.moveTo(noteX - lineLength/2, 270); // Second ledger line
                ctx.lineTo(noteX + lineLength/2, 270);
                break;
            case 'B3':
                // One ledger line for B3
                ctx.moveTo(noteX - lineLength/2, 250); // First ledger line
                ctx.lineTo(noteX + lineLength/2, 250);
                break;
            case 'C4':
                // One ledger line for C4
                ctx.moveTo(noteX - lineLength/2, 250); // First ledger line
                ctx.lineTo(noteX + lineLength/2, 250);
                break;
            case 'D4':
                // No ledger lines for D4 - it's in the space below the bottom staff line
                break;
        }
    } else if (notes.indexOf(note) >= notes.indexOf('G5')) {
        switch(note) {
            case 'B5':
            case 'A5':
                ctx.moveTo(noteX - lineLength/2, 130); // First ledger line above staff
                ctx.lineTo(noteX + lineLength/2, 130);
                break;
        }
    }
    ctx.stroke();
}

// Function to draw a note at a specific position
function drawNote(note) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw staff
    drawStaff();

    // Draw ledger lines before the note
    const noteX = 200; // Center position of the note
    drawLedgerLines(note, noteX);

    // Draw sharp if needed (before drawing the note)
    if (noteNeedsSharp(note)) {
        // Position sharp symbol to the left of the note
        const sharpX = noteX - 28; // Moved 2px closer to note (was 30px away)
        const sharpY = notePositions[note]; // Same Y position as the note
        
        // Draw the sharp symbol with vertical centering - reduced by 10%
        ctx.drawImage(images.sharp, sharpX - 15, sharpY - 23, 32, 47); // Was 36x52
    }
    
    // Save canvas state for note and stem
    ctx.save();
    ctx.translate(200, notePositions[note]); // Move to the note's center
    
    // Draw the note head with rotation
    ctx.rotate(-30 * Math.PI / 180); // Rotate -30 degrees
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2); // Note coordinates now at center
    ctx.fill();
    
    // Reset rotation for stem (we don't want stem rotated)
    ctx.rotate(30 * Math.PI / 180); // Undo the rotation
    
    // Draw note stem
    ctx.beginPath();
    ctx.lineWidth = 2;
    
    // Notes B4 and above have stems down on the left
    if (notes.indexOf(note) >= notes.indexOf('B4')) {
        ctx.moveTo(-12, 0); // Left side of note (12px from center)
        ctx.lineTo(-12, 65); // Stem goes down
    } else {
        // Lower notes have stems up on the right
        ctx.moveTo(12, 0); // Right side of note (12px from center)
        ctx.lineTo(12, -65); // Stem goes up
    }
    ctx.stroke();
    
    // Restore canvas state
    ctx.restore();
}

// Make images accessible to all functions
const images = {
    trebleClef: new Image(),
    sharp: new Image(),
    flat: new Image()
};

// Add this function to load audio files
function loadAudioFiles() {
    notes.forEach(note => {
        audioFiles[note] = new Audio(`audio/${note}.mp3`);
    });
}

// Add this function to format the time
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Add this function to update the timer display
function updateTimer() {
    if (!startTime) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    document.getElementById('timer').textContent = formatTime(elapsedTime);
}

// Add function to update stats display
function updateStats() {
    document.getElementById('xp-points').textContent = xpPoints;
    const accuracy = totalAttempts === 0 ? 100 : Math.round((correctAttempts / totalAttempts) * 100);
    document.getElementById('accuracy').textContent = accuracy;
}

// Modify the initGame function to start the timer
function initGame() {
    // Start the timer
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Load audio files
    loadAudioFiles();
    
    // Preload images
    images.trebleClef.src = 'images/treble-clef.svg';
    images.sharp.src = 'images/Sharp.svg';
    images.flat.src = 'images/flat.svg';

    // Wait for all images to load before starting
    Promise.all([
        new Promise(resolve => images.trebleClef.onload = resolve),
        new Promise(resolve => images.sharp.onload = resolve),
        new Promise(resolve => images.flat.onload = resolve)
    ]).then(() => {
        drawStaff();
        currentNote = getRandomNote();
        drawNote(currentNote);
    });
}

// Modify the note button click handler
document.querySelectorAll('.note-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedNote = e.target.dataset.note;
        const correctNote = currentNote.charAt(0);
        totalAttempts++;
        
        if (selectedNote === correctNote) {
            e.target.classList.add('correct');
            noteGuessed = true;
            correctAttempts++;
            checkBothCorrect();
        } else {
            e.target.classList.add('incorrect');
        }
        updateStats();
    });
});

// Modify the finger button click handler
document.querySelectorAll('.finger-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedFinger = parseInt(e.target.dataset.finger);
        const correctFingers = fingerPositions[currentNote];
        totalAttempts++;
        
        if (correctFingers.includes(selectedFinger)) {
            e.target.classList.add('correct');
            fingerGuessed = true;
            correctAttempts++;
            checkBothCorrect();
        } else {
            e.target.classList.add('incorrect');
        }
        updateStats();
    });
});

// Modify the checkBothCorrect function
function checkBothCorrect() {
    if (noteGuessed && fingerGuessed) {
        // Add XP point when both are correct
        xpPoints++;
        updateStats();
        
        // Play the audio for the current note
        const audio = audioFiles[currentNote];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }

        setTimeout(() => {
            // Reset states
            noteGuessed = false;
            fingerGuessed = false;
            
            // Reset button states
            document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
                btn.classList.remove('correct', 'incorrect');
            });
            
            // Generate and draw new note
            currentNote = getRandomNote();
            drawNote(currentNote);
        }, 1500);
    }
}

// Modify the canvas click handler to reset stats
canvas.addEventListener('click', () => {
    // Reset all stats
    xpPoints = 0;
    totalAttempts = 0;
    correctAttempts = 0;
    updateStats();
    
    // Reset timer
    startTime = Date.now();
    updateTimer();
    
    // Stop any playing audio
    Object.values(audioFiles).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    // Reset states
    noteGuessed = false;
    fingerGuessed = false;
    
    // Reset button states
    document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
    
    currentNote = getRandomNote();
    drawNote(currentNote);
});

// Add cleanup when leaving the page
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Start the game when the page loads
window.addEventListener('load', initGame); 