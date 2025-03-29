// Constants for note positions
const NOTE_POSITIONS = {
    G3: 0, D4: 1, A4: 2, E5: 3
};

// Constants for finger positions
const L1 = 'L1'; // Low 1
const H1 = 'H1'; // High 1
const L2 = 'L2'; // Low 2
const H2 = 'H2'; // High 2
const L3 = 'L3'; // Low 3
const H3 = 'H3'; // High 3
const L4 = 'L4'; // Low 4
const H4 = 'H4'; // High 4

// Level constants
const LEVEL_OPEN_STRINGS = 1;
const LEVEL_A_STRING = 2;
const LEVEL_D_STRING = 3;
const LEVEL_E_STRING = 4;
const LEVEL_G_STRING = 5;
const LEVEL_NOTES_ON_TAPES = 6;
const LEVEL_LOW_TWOS = 7;
const LEVEL_HIGH_THREES = 8;
const LEVEL_LOW_ONES_AND_FOURS = 9;
const LEVEL_G_STRING_PRACTICE = 10;
const LEVEL_D_STRING_PRACTICE = 11;
const LEVEL_A_STRING_PRACTICE = 12;
const LEVEL_E_STRING_PRACTICE = 13;
const LEVEL_ENHARMONIC = 14;
const LEVEL_ULTIMATE = 15;

// XP requirements for each level
const LEVEL_XP_REQUIREMENTS = {
    [LEVEL_OPEN_STRINGS]: 0,      // Level 1: No requirement
    [LEVEL_A_STRING]: 10,         // Level 2: 10 XP
    [LEVEL_D_STRING]: 20,         // Level 3: 20 XP
    [LEVEL_E_STRING]: 30,         // Level 4: 30 XP
    [LEVEL_G_STRING]: 40,         // Level 5: 40 XP
    [LEVEL_NOTES_ON_TAPES]: 50,   // Level 6: 50 XP
    [LEVEL_LOW_TWOS]: 60,         // Level 7: 60 XP
    [LEVEL_HIGH_THREES]: 70,      // Level 8: 70 XP
    [LEVEL_LOW_ONES_AND_FOURS]: 80, // Level 9: 80 XP
    [LEVEL_G_STRING_PRACTICE]: 90, // Level 10: 90 XP
    [LEVEL_D_STRING_PRACTICE]: 100, // Level 11: 100 XP
    [LEVEL_A_STRING_PRACTICE]: 110, // Level 12: 110 XP
    [LEVEL_E_STRING_PRACTICE]: 120, // Level 13: 120 XP
    [LEVEL_ENHARMONIC]: 130,      // Level 14: 130 XP
    [LEVEL_ULTIMATE]: 140         // Level 15: 140 XP
};

// Get canvas and context
const canvas = document.getElementById('musicStaff');
console.log('Canvas element:', canvas);
const ctx = canvas.getContext('2d');
console.log('Canvas context:', ctx);

let currentNote = null;
let noteGuessed = false;
let fingerGuessed = false;

// Add currentLevel variable with other state variables
let currentLevel = LEVEL_OPEN_STRINGS; // Default to Level 1

// Define note range (G3 to B5)
const notes = [
   'G3', 'Ab3', 'A3', 'Bb3' , 'B3', 'C4', 'C#4', 'Db4', 'D4',
   'Eb4', 'E4', 'F4', 'F#4', 'G4', 'G#4' ,'Ab4','A4',
   'Bb4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'Eb5', 'E5',
   'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'Bb5', 'B5'
];

// Define correct finger positions for each note
const fingerPositions = {
   'G3': ['0'], 'Ab3':['L1'], 'A3': ['1'], 'Bb3': ['L2'], 'B3': ['H2'], 'C4': ['3'], 'C#4': ['H3'], 'Db4': ['L4'], 'D4': ['0'],
   'Eb4': ['L1'], 'E4': ['1'], 'F4': ['L2'], 'F#4': ['H2'], 'G4': ['3'], 'G#4': ['H3'], 'Ab4': ['L4'], 
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

// Function to get notes for current level
function getLevelNotes() {
    switch(currentLevel) {
        case LEVEL_OPEN_STRINGS:
            return ['G3', 'D4', 'A4', 'E5'];
        case LEVEL_A_STRING:
            return ['A4', 'B4', 'C#5', 'D5'];
        case LEVEL_D_STRING:
            return ['D4', 'E4', 'F#4', 'G4'];
        case LEVEL_E_STRING:
            return ['E5', 'F#5', 'G#5', 'A5'];
        case LEVEL_G_STRING:
            return ['G3', 'A3', 'B3', 'C4'];
        case LEVEL_NOTES_ON_TAPES:
            return ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5', 'B5'];
        case LEVEL_LOW_TWOS:
            return ['G3', 'A3', 'Bb3', 'B3', 'C4', 'D4', 'E4', 'F4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'C#5', 'D5', 'E5', 'F#5', 'G5', 'G#5', 'A5', 'B5'];
        case LEVEL_HIGH_THREES:
            return ['G3', 'A3', 'B3', 'C4', 'C#4', 'D4', 'E4', 'F#4', 'G4', 'G#4', 'A4', 'B4', 'C#5', 'D5', 'D#5', 'E5', 'F#5', 'G#5', 'A5', 'A#5', 'B5'];
        case LEVEL_LOW_ONES_AND_FOURS:
            return ['G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'Bb5'];
        case LEVEL_G_STRING_PRACTICE:
            return ['G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'C#4', 'Db4'];
        case LEVEL_D_STRING_PRACTICE:
            return ['D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'Ab4'];
        case LEVEL_A_STRING_PRACTICE:
            return ['A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'Eb5'];
        case LEVEL_E_STRING_PRACTICE:
            return ['E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'Bb5', 'B5'];
        case LEVEL_ENHARMONIC:
            return ['C#4', 'Db4', 'G#4', 'Ab4', 'D#5', 'Eb5', 'A#5', 'Bb5'];
        case LEVEL_ULTIMATE:
            return ['G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'C#4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'Bb5', 'B5'];
        default:
            return ['G3', 'D4', 'A4', 'E5']; // Default to open strings
    }
}

// Function to generate a random note
function getRandomNote() {
    const levelNotes = getLevelNotes();
    const randomIndex = Math.floor(Math.random() * levelNotes.length);
    return levelNotes[randomIndex];
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
    // Recent changes to musical notation positioning:
    // - Sharp sign (#) moved further left (-35px from note) for better visual spacing
    // - Flat sign (b) position matched to sharp sign for consistency
    // - Flat sign kept at -8px vertical offset for proper alignment
    // - Both signs maintain their original size (38x58 for sharp, 32x47 for flat)
    
    // Clear the canvas and redraw the staff
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStaff();

    // Draw ledger lines before the note
    const noteX = 200; // Center position of the note
    drawLedgerLines(note, noteX);

    // Draw sharp or flat if needed (before drawing the note)
    if (noteNeedsSharp(note)) {
        // Position sharp symbol to the left of the note
        // Adjusted position to be further left (-35 instead of -28) for better visual spacing
        const sharpX = noteX - 35;
        const sharpY = notePositions[note];
        ctx.drawImage(images.sharp, sharpX - 15, sharpY - 23, 32, 47);
    } else if (noteNeedsFlat(note)) {
        // Position flat symbol to the left of the note
        // Matched sharp sign position (-35) for consistent spacing
        // Kept vertical offset (-8) to maintain higher position for flat sign
        const flatX = noteX - 35;
        const flatY = notePositions[note] - 8;
        ctx.drawImage(images.flat, flatX - 15, flatY - 23, 32, 47);
    }
    
    // Save canvas state for note and stem
    ctx.save();
    ctx.translate(200, notePositions[note]); // Move to the note's center
    
    // Draw the note head with rotation
    ctx.rotate(-30 * Math.PI / 180); // Rotate -30 degrees for a more natural look
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

// Function to convert note name to audio file name
function getAudioFileName(note) {
    // No conversion needed - return the note name as is
    return note;
}

// Function to load audio files for specific notes
function loadAudioFilesForNotes(notes) {
    console.log('Loading audio files for notes:', notes);
    const audioPromises = notes.map(note => {
        return new Promise((resolve, reject) => {
            const audioFileName = getAudioFileName(note);
            const audioPath = `./audio/${encodeURIComponent(audioFileName)}.mp3`;
            
            console.log(`Loading audio file: ${audioPath}`);
            const audio = new Audio();
            audioFiles[note] = audio;
            
            // Add error handling for audio loading
            audio.onerror = (e) => {
                console.error(`Error loading audio for ${note}:`, e);
                console.error(`Audio path attempted: ${audioPath}`);
                if (e.target.error) {
                    console.error('Audio error details:', e.target.error);
                }
                reject(new Error(`Failed to load audio for ${note}`));
            };
            
            audio.oncanplaythrough = () => {
                console.log(`Audio loaded successfully for ${note}`);
                resolve();
            };
            
            // Set the source after adding all event listeners
            audio.src = audioPath;
        });
    });

    return Promise.all(audioPromises);
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
    updateLevelOptions();
}

// Function to check if a level is unlocked
function isLevelUnlocked(level) {
    return xpPoints >= LEVEL_XP_REQUIREMENTS[level];
}

// Function to show level unlock popup
function showLevelUnlockPopup(level) {
    const popup = document.getElementById('level-unlock-popup');
    const popupText = popup.querySelector('.popup-text');
    
    let message = '';
    switch(level) {
        case 1:
            message = "Level 1: Open Strings - Learn the basic open strings of the violin!";
            break;
        case 2:
            message = "Level 2: A String Notes - Master the first four notes on the A string!";
            break;
        case 3:
            message = "Level 3: D String Notes - Learn the first four notes on the D string!";
            break;
        case 4:
            message = "Level 4: E String Notes - Practice the first four notes on the E string!";
            break;
        case 5:
            message = "Level 5: G String Notes - Master the first four notes on the G string!";
            break;
        case 6:
            message = "Level 6: Notes on Tapes - Learn to play notes using finger tapes!";
            break;
        case 7:
            message = "Level 7: Low 2's - Master the low 2 finger position across all strings!";
            break;
        case 8:
            message = "Level 8: High 3's - Learn the high 3 finger position across all strings!";
            break;
        case 9:
            message = "Level 9: Low 1's and Low 4's - Practice low 1 and low 4 finger positions!";
            break;
        case 10:
            message = "Level 10: G String Practice - Master all notes on the G string!";
            break;
        case 11:
            message = "Level 11: D String Practice - Master all notes on the D string!";
            break;
        case 12:
            message = "Level 12: A String Practice - Master all notes on the A string!";
            break;
        case 13:
            message = "Level 13: E String Practice - Master all notes on the E string!";
            break;
        case 14:
            message = "Level 14: Enharmonic Challenge - Learn enharmonic equivalents!";
            break;
        case 15:
            message = "Level 15: Ultimate Challenge - Test your knowledge of every note in first position!";
            break;
        default:
            message = `Level ${level} unlocked!`;
    }
    
    popupText.textContent = message;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// Function to update level options UI
function updateLevelOptions() {
    const levelOptions = document.querySelectorAll('.level-option');
    let newlyUnlockedLevel = null;
    
    levelOptions.forEach(option => {
        const level = parseInt(option.dataset.level);
        const wasLocked = option.classList.contains('locked');
        
        if (level === LEVEL_OPEN_STRINGS) {
            option.classList.remove('locked');
        } else if (isLevelUnlocked(level)) {
            option.classList.remove('locked');
            // Show popup if level was previously locked
            if (wasLocked) {
                showLevelUnlockPopup(level);
                newlyUnlockedLevel = level; // Store the newly unlocked level
            }
        } else {
            option.classList.add('locked');
        }
    });

    // If a new level was unlocked, automatically switch to it
    if (newlyUnlockedLevel) {
        const levelDisplay = document.getElementById('level-display');
        const levelOption = document.querySelector(`.level-option[data-level="${newlyUnlockedLevel}"]`);
        
        // Update display
        levelDisplay.textContent = newlyUnlockedLevel;
        
        // Update selected state
        levelOptions.forEach(opt => opt.classList.remove('selected'));
        levelOption.classList.add('selected');
        
        // Update game level
        currentLevel = newlyUnlockedLevel;
        updateGameState();
    }
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
            const levelNumber = parseInt(option.dataset.level);
            
            // Check if level is unlocked
            if (levelNumber === LEVEL_OPEN_STRINGS || isLevelUnlocked(levelNumber)) {
                // Update display
                levelDisplay.textContent = levelNumber;
                
                // Update selected state
                levelOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Close dropdown
                levelContainer.classList.remove('active');
                
                // Update game level
                currentLevel = levelNumber;
                updateGameState();
            }
        });
    });
}

// Function to update game state when level changes
function updateGameState() {
    // Reset game state
    noteGuessed = false;
    sharpFlatGuessed = false;
    fingerNumberGuessed = false;
    fingerPositionGuessed = false;
    
    // Reset button states
    document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
    
    // Update level description text
    const levelDescriptionText = document.getElementById('level-description-text');
    if (levelDescriptionText) {
        let message = '';
        switch(currentLevel) {
            case 1:
                message = "Level 1: Open Strings - Learn the basic open strings of the violin!";
                break;
            case 2:
                message = "Level 2: A String Notes - Master the first four notes on the A string!";
                break;
            case 3:
                message = "Level 3: D String Notes - Learn the first four notes on the D string!";
                break;
            case 4:
                message = "Level 4: E String Notes - Practice the first four notes on the E string!";
                break;
            case 5:
                message = "Level 5: G String Notes - Master the first four notes on the G string!";
                break;
            case 6:
                message = "Level 6: Notes on Tapes - Learn to play notes using finger tapes!";
                break;
            case 7:
                message = "Level 7: Low 2's - Master the low 2 finger position across all strings!";
                break;
            case 8:
                message = "Level 8: High 3's - Learn the high 3 finger position across all strings!";
                break;
            case 9:
                message = "Level 9: Low 1's and Low 4's - Practice low 1 and low 4 finger positions!";
                break;
            case 10:
                message = "Level 10: G String Practice - Master all notes on the G string!";
                break;
            case 11:
                message = "Level 11: D String Practice - Master all notes on the D string!";
                break;
            case 12:
                message = "Level 12: A String Practice - Master all notes on the A string!";
                break;
            case 13:
                message = "Level 13: E String Practice - Master all notes on the E string!";
                break;
            case 14:
                message = "Level 14: Enharmonic Challenge - Learn enharmonic equivalents!";
                break;
            case 15:
                message = "Level 15: Ultimate Challenge - Test your knowledge of every note in first position!";
                break;
            default:
                message = `Level ${currentLevel} unlocked!`;
        }
        levelDescriptionText.textContent = message;
    }
    
    // Get notes for current level
    const levelNotes = getLevelNotes();
    
    // Disable all buttons while loading
    document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Load audio files for the current level's notes
    loadAudioFilesForNotes(levelNotes).then(() => {
        // Generate and draw new note for the current level
        currentNote = getRandomNote();
        drawNote(currentNote);
        
        // Reset timer
        startTime = Date.now();
        updateTimer();
        
        // Stop any playing audio
        Object.values(audioFiles).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        // Add a small delay before re-enabling buttons to ensure audio is ready
        setTimeout(() => {
            // Re-enable all buttons after loading
            document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
                btn.disabled = false;
            });
        }, 500); // Wait 500ms after audio loads before enabling buttons
    }).catch(error => {
        console.error('Error loading audio files for level:', error);
        // Re-enable buttons even if there's an error
        document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
            btn.disabled = false;
        });
    });
}

// Modify initGame to load initial level's audio files
function initGame() {
    // Setup level dropdown
    setupLevelDropdown();
    
    // Start the timer
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Preload images
    console.log('Loading images...');
    images.trebleClef.src = 'images/treble-clef.svg';
    images.sharp.src = 'images/sharp.svg';
    images.flat.src = 'images/flat.svg';

    // Get initial level notes
    const initialNotes = getLevelNotes();

    // Wait for all images and initial audio to load before starting
    Promise.all([
        new Promise(resolve => images.trebleClef.onload = resolve),
        new Promise(resolve => images.sharp.onload = resolve),
        new Promise(resolve => images.flat.onload = resolve),
        loadAudioFilesForNotes(initialNotes)
    ]).then(() => {
        console.log('All resources loaded');
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

// Modify the checkBothCorrect function to handle audio playback more safely
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
        
        // Play the audio for the current note with retry mechanism
        const audio = audioFiles[currentNote];
        if (audio) {
            const playAudio = () => {
                if (audio.readyState >= 2) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                    audio.currentTime = 0;
                    audio.play().catch(error => {
                        console.error('Error playing audio:', error);
                        console.error('Audio state:', {
                            note: currentNote,
                            readyState: audio.readyState,
                            error: audio.error,
                            src: audio.src
                        });
                    });
                } else {
                    // If audio isn't ready, wait a bit and try again
                    setTimeout(playAudio, 100);
                }
            };
            playAudio();
        }

        // Disable buttons while transitioning
        document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
            btn.disabled = true;
        });

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

            // Re-enable buttons after drawing new note
            document.querySelectorAll('.note-btn, .finger-btn').forEach(btn => {
                btn.disabled = false;
            });
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