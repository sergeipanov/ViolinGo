// Get canvas and context
const canvas = document.getElementById('musicStaff');
console.log('Canvas element:', canvas);
const ctx = canvas.getContext('2d');
console.log('Canvas context:', ctx);

let currentNote = null;
let noteGuessed = false;
let fingerGuessed = false;

// Define note range (G3 to B5)
const notes = [
   'G3', 'Ab3', 'A3', 'Bb3' , 'B3', 'C4', 'C#4', 'Db4', 'D4',
   'D#4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'G#4' ,'Ab4','A4',
   'Bb4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'Eb5', 'E5',
   'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'Bb5', 'B5'
];

// Define correct finger positions for each note
const fingerPositions = {
   'G3': ['0'], 'Ab3':['L1'], 'A3': ['1'], 'Bb3': ['L2'], 'B3': ['H2'], 'C4': ['3'], 'C#4': ['H3'], 'Db4': ['L4'], 'D4': ['0'],
   'D#4': ['L1'], 'Eb4': ['L1'], 'E4': ['1'], 'F4': ['L2'], 'F#4': ['H2'], 'G4': ['3'], 'G#4': ['H3'], 'Ab4': ['L4'], 
   'A4': ['0'], 'Bb4': ['L1'], 'B4': ['1'], 'C5': ['L2'], 'C#5': ['H2'], 'D5': ['3'], 'D#5': ['H3'], 'Eb5': ['L4'], 
   'E5': ['0'], 'F5': ['L1'], 'F#5': ['1'], 'G5': ['L2'], 'G#5': ['H2'], 'A5': ['3'], 'A#5': ['H3'], 'Bb5': ['L4'], 'B5': ['4']
};

// Add at the top with other state variables
const audioFiles = {};

// Add these variables at the top with other state variables
let startTime = null;
let timerInterval = null;
let xpPoints = 0;
let totalAttempts = 0;
let correctAttempts = 0;
let sharpFlatGuessed = false;
let fingerNumberGuessed = false;
let fingerPositionGuessed = false;

// Define notes that need a sharp
const sharpNotes = ['C#4', 'F#4', 'G#4', 'C#5', 'D#5', 'F#5', 'G#5', 'A#5'];
const flatNotes = ['Ab3', 'Bb3', 'Db4', 'Eb4', 'Ab4', 'Bb4', 'Eb5', 'Bb5'];

// Function to check if a note needs a sharp
function noteNeedsSharp(note) {
    return sharpNotes.includes(note);
}

// Function to check if a note needs a flat
function noteNeedsFlat(note) {
    return flatNotes.includes(note);
}

// Function to check if a note is an alternate position
function isAlternatePosition(note) {
    return note.endsWith('_alt');
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
    console.log('Drawing staff...');
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
    console.log('Drawing treble clef...');
    ctx.drawImage(images.trebleClef, 55, 110, 110, 160); // y changed from 60 to 110
}

// Calculate note position (simplified for now)
const notePositions = {
   // Below staff
   'G3': 280, // Lowest note - below two ledger lines
   'Ab3': 270, // L1 On second ledger line
   'A3': 270, // On second ledger line
   'Bb3': 260, // L2 On second ledger line
   'B3': 260, // Between ledger lines
   'C4': 250, // On first ledger line
   'C#4': 250, // On first ledger line
   'Db4': 240, // On first ledger line
   'D4': 240, // Space below bottom line
   'D#4': 240, // Sharp on D4
   'Eb4': 230, //L1 On first ledger line
   'E4': 230, //1 On first ledger line
   'F4': 220, // L2 On first ledger line
   'F#4': 220, //H2 on first space
   'G4': 210, // Second line
   'G#4': 210, // H3 on second line
   'Ab4': 200, // L4 on second space
   'A4': 200, // Second space
   'A4_alt': 200, // Open string on second space
   'Bb4': 190, // L1 on third line
   'B4': 190, // Third line
   'C5': 180, //L2
   'C#5': 180, //H2 ird space
   'D5': 170, // Fourth line
   'D#5': 170, // H3 on fourth line
   'Eb5': 160, // L4 on fourth space
   'E5': 160, // Fourth space
   'E5_alt': 160, // Open string on fourth space
   'F5': 150, // L1 on E stringFifth line (top line)
   'F#5': 150, // 1 on E string 5th line
   'G5': 140, // Fifth space
   'G#5': 140, // H5 on fifth space
   'A5': 130, // Sixth line
   'A#5': 130, // H3 on E string
   'Bb5': 120,//     'Ab5': 130, // Sixth line
   'B5': 120  // Sixth space
};

// Update ledger line positions
function drawLedgerLines(note, noteX) {
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'black';
    
    const lineLength = 45;
    
    // Get the note's position to determine if it needs ledger lines
    const noteY = notePositions[note];
    
    // Notes below the staff (G3 to D4)
    if (noteY >= 240) {
        // Two ledger lines for G3, Ab3, A3
        if (noteY >= 270) {
            ctx.moveTo(noteX - lineLength/2, 250); // First ledger line
            ctx.lineTo(noteX + lineLength/2, 250);
            ctx.moveTo(noteX - lineLength/2, 270); // Second ledger line
            ctx.lineTo(noteX + lineLength/2, 270);
        }
        // One ledger line for Bb3, B3, C4, C#4, Db4
        else if (noteY >= 250) {
            ctx.moveTo(noteX - lineLength/2, 250); // First ledger line
            ctx.lineTo(noteX + lineLength/2, 250);
        }
        // No ledger lines for D4 (it's in the space below the bottom staff line)
    }
    // Notes above the staff (G5 to B5)
    else if (noteY <= 140) {
        // One ledger line for A5, A#5, Bb5, B5
        if (noteY <= 130) {
            ctx.moveTo(noteX - lineLength/2, 130); // First ledger line above staff
            ctx.lineTo(noteX + lineLength/2, 130);
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

    // Draw sharp or flat if needed (before drawing the note)
    if (noteNeedsSharp(note)) {
        // Position sharp symbol to the left of the note, further left
        const sharpX = noteX - 35; // Moved further left (was -28)
        const sharpY = notePositions[note];
        ctx.drawImage(images.sharp, sharpX - 15, sharpY - 23, 32, 47);
    } else if (noteNeedsFlat(note)) {
        // Position flat symbol to the left of the note, matching sharp position
        const flatX = noteX - 35; // Match sharp position
        const flatY = notePositions[note] - 8;
        ctx.drawImage(images.flat, flatX - 15, flatY - 23, 32, 47);
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
    console.log('Starting to load audio files...');
    notes.forEach(note => {
        // Use relative path and proper URL encoding
        const audioPath = `./audio/${encodeURIComponent(note)}.mp3`;
        
        console.log(`Loading audio file: ${audioPath}`);
        const audio = new Audio();
        audioFiles[note] = audio;
        
        // Add error handling for audio loading
        audio.onerror = (e) => {
            console.error(`Error loading audio for ${note}:`, e);
            console.error(`Audio path attempted: ${audioPath}`);
            // Try to get more details about the error
            if (e.target.error) {
                console.error('Audio error details:', e.target.error);
            }
        };
        
        audio.oncanplaythrough = () => {
            console.log(`Audio loaded successfully for ${note}`);
        };
        
        // Add load event handler
        audio.addEventListener('load', () => {
            console.log(`Audio load event fired for ${note}`);
        });
        
        // Add loadeddata event handler
        audio.addEventListener('loadeddata', () => {
            console.log(`Audio data loaded for ${note}`);
        });

        // Set the source after adding all event listeners
        audio.src = audioPath;
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

// Add level dropdown functionality
function setupLevelDropdown() {
    const levelContainer = document.querySelector('.level');
    const levelDisplay = document.getElementById('level-display');
    const levelOptions = document.querySelectorAll('.level-option');

    // Toggle dropdown on click
    levelContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        levelContainer.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        levelContainer.classList.remove('active');
    });

    // Handle level selection
    levelOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const levelNumber = option.querySelector('.level-number').textContent;
            
            // Update display
            levelDisplay.textContent = levelNumber;
            
            // Update selected state
            levelOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Close dropdown
            levelContainer.classList.remove('active');
            
            // Update game level
            currentLevel = parseInt(levelNumber);
            updateGameState();
        });
    });
}

// Modify initGame to include level dropdown setup
function initGame() {
    // Setup level dropdown
    setupLevelDropdown();
    
    // Start the timer
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Load audio files
    loadAudioFiles();
    
    // Preload images
    console.log('Loading images...');
    images.trebleClef.src = 'images/treble-clef.svg';
    images.sharp.src = 'images/sharp.svg';
    images.flat.src = 'images/flat.svg';

    // Wait for all images to load before starting
    Promise.all([
        new Promise(resolve => images.trebleClef.onload = resolve),
        new Promise(resolve => images.sharp.onload = resolve),
        new Promise(resolve => images.flat.onload = resolve)
    ]).then(() => {
        console.log('Treble clef loaded');
        drawStaff();
        currentNote = getRandomNote();
        drawNote(currentNote);
    });
}

// Modify the note button click handler
document.querySelectorAll('.note-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedNote = e.target.dataset.note;
        const selectedType = e.target.dataset.type; // 'note', 'sharp', or 'flat'
        totalAttempts++;
        
        let isCorrect = false;
        
        // Check if this is a note button (A, B, C, etc.)
        if (selectedType === 'note') {
            isCorrect = selectedNote === currentNote.charAt(0);
            if (isCorrect) {
                noteGuessed = true;
                // If note doesn't need sharp/flat, mark sharpFlatGuessed as true
                if (!noteNeedsSharp(currentNote) && !noteNeedsFlat(currentNote)) {
                    sharpFlatGuessed = true;
                }
                console.log('Note guessed correctly:', selectedNote);
            }
        }
        // Check if this is a sharp button
        else if (selectedType === 'sharp') {
            isCorrect = noteNeedsSharp(currentNote);
            if (isCorrect) {
                sharpFlatGuessed = true;
                console.log('Sharp guessed correctly');
            }
        }
        // Check if this is a flat button
        else if (selectedType === 'flat') {
            isCorrect = noteNeedsFlat(currentNote);
            if (isCorrect) {
                sharpFlatGuessed = true;
                console.log('Flat guessed correctly');
            }
        }
        
        if (isCorrect) {
            e.target.classList.add('correct');
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
        const selectedFinger = e.target.dataset.finger;
        const selectedType = e.target.dataset.type; // 'number' or 'position' (L/H)
        const correctFingers = fingerPositions[currentNote];
        totalAttempts++;
        
        // Debug logging
        console.log('Current note:', currentNote);
        console.log('Selected finger:', selectedFinger);
        console.log('Selected type:', selectedType);
        console.log('Correct fingers:', correctFingers);
        
        let isCorrect = false;
        
        // Check if this is a number button (0-4)
        if (selectedType === 'number') {
            // Check if the number matches any of the correct fingers
            isCorrect = correctFingers.some(f => {
                // Match simple numbers (like '0' or '3')
                if (f === selectedFinger) return true;
                // Match numbers in L/H positions (like '3' in 'L3')
                if (f.endsWith(selectedFinger)) return true;
                return false;
            });
            
            // Debug logging
            console.log('Is number correct?', isCorrect);
            
            if (isCorrect) {
                fingerNumberGuessed = true;
                // If note doesn't need H/L position, mark fingerPositionGuessed as true
                if (!correctFingers.some(f => f.startsWith('L') || f.startsWith('H'))) {
                    fingerPositionGuessed = true;
                }
                console.log('Finger number guessed correctly:', selectedFinger);
            }
        }
        // Check if this is a position button (L/H)
        else if (selectedType === 'position') {
            // For notes that need L position
            if (selectedFinger === 'L' && correctFingers.some(f => f.startsWith('L'))) {
                isCorrect = true;
                fingerPositionGuessed = true;
                console.log('L position guessed correctly');
            }
            // For notes that need H position
            else if (selectedFinger === 'H' && correctFingers.some(f => f.startsWith('H'))) {
                isCorrect = true;
                fingerPositionGuessed = true;
                console.log('H position guessed correctly');
            }
            
            // Debug logging
            console.log('Is position correct?', isCorrect);
        }
        
        if (isCorrect) {
            e.target.classList.add('correct');
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
    // Check if we have all required correct answers
    const needsSharpFlat = noteNeedsSharp(currentNote) || noteNeedsFlat(currentNote);
    const needsPosition = fingerPositions[currentNote].some(f => f.startsWith('L') || f.startsWith('H'));
    
    // For debugging
    console.log('Current note:', currentNote);
    console.log('Note guessed:', noteGuessed);
    console.log('Sharp/Flat needed:', needsSharpFlat);
    console.log('Sharp/Flat guessed:', sharpFlatGuessed);
    console.log('Finger number guessed:', fingerNumberGuessed);
    console.log('Position needed:', needsPosition);
    console.log('Position guessed:', fingerPositionGuessed);
    
    const allCorrect = noteGuessed && 
                      (!needsSharpFlat || sharpFlatGuessed) && 
                      fingerNumberGuessed && 
                      (!needsPosition || fingerPositionGuessed);

    if (allCorrect) {
        // Add XP point when all required answers are correct
        xpPoints++;
        updateStats();
        
        // Play the audio for the current note
        const audio = audioFiles[currentNote];
        if (audio) {
            // Check if the audio is ready to play
            if (audio.readyState >= 2) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                audio.currentTime = 0;
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    console.error('Audio state:', {
                        readyState: audio.readyState,
                        error: audio.error,
                        src: audio.src
                    });
                });
            } else {
                console.error('Audio not ready to play:', {
                    note: currentNote,
                    readyState: audio.readyState,
                    error: audio.error,
                    src: audio.src
                });
            }
        } else {
            console.error('No audio found for note:', currentNote);
        }

        setTimeout(() => {
            // Reset all states
            noteGuessed = false;
            sharpFlatGuessed = false;
            fingerNumberGuessed = false;
            fingerPositionGuessed = false;
            
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