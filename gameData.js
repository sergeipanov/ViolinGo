// This contains all game data
const gameData = {
  // All possible notes in the game
  allNotes: {
    // G String (lowest)
    "G3": {
      ledgerLines: 2,
      fingerPositions: [0],
      string: "G",
      audioFile: "G3.mp3"
    },
    "G#3": {
      ledgerLines: 2,
      fingerPositions: [L1],
      string: "G",
      isEnharmonic: true,
      enharmonicName: "Ab3",
      audioFile: "Ab3.mp3"
    },
    "Ab3": {
      ledgerLines: 2,
      fingerPositions: [L1],
      string: "G",
      isEnharmonic: true,
      enharmonicName: "G#3",
      audioFile: "Ab3.mp3" // Using the same audio file as G#3
    },
    "A3": {
      ledgerLines: 2,
      fingerPositions: [1],
      string: "G",
      audioFile: "A3.mp3"
    },
    "Bb3": {
      ledgerLines: 1,
      fingerPositions: [L2],
      string: "G",
      isEnharmonic: true,
      enharmonicName: "A#3",
      audioFile: "Bb3.mp3" // Using the same audio file as A#3
    },
    "B3": {
      ledgerLines: 1,
      fingerPositions: [H2],
      string: "G",
      audioFile: "B3.mp3"
    },
    "C4": {
      ledgerLines: 1,
      fingerPositions: [3],
      string: "G",
      audioFile: "C4.mp3"
    },
    "C#4": {
      ledgerLines: 1,
      fingerPositions: [H3],
      string: "G",
      isEnharmonic: true,
      enharmonicName: "Db4",
      audioFile: "C#4.mp3"
    },
    "Db4": {
      ledgerLines: 0,
      fingerPositions: [L4],
      string: "G",
      isEnharmonic: true,
      enharmonicName: "C#4",
      audioFile: "C#4.mp3" // Using the same audio file as C#4
    },
    "D4": {
      ledgerLines: 0,
      fingerPositions: [4],
      string: "G",
      audioFile: "D4.mp3"
    },
    
    // D String
    "D4_alt": {
      ledgerLines: 0,
      fingerPositions: [0],
      string: "D",
      audioFile: "D4.mp3"
    },
    "D#4": {
      ledgerLines: 0,
      fingerPositions: [L1],
      string: "D",
      isEnharmonic: true,
      enharmonicName: "Eb4",
      audioFile: "Eb4.mp3"
    },
    "Eb4": {
      ledgerLines: 0,
      fingerPositions: [L1],
      string: "D",
      isEnharmonic: true,
      enharmonicName: "D#4",
      audioFile: "Eb4.mp3" // Using the same audio file as D#4
    },
    "E4": {
      ledgerLines: 0,
      fingerPositions: [1],
      string: "D",
      audioFile: "E4.mp3"
    },
    "F4": {
      ledgerLines: 0,
      fingerPositions: [L2],
      string: "D",
      audioFile: "F4.mp3"
    },
    "F#4": {
      ledgerLines: 0,
      fingerPositions: [H2],
      string: "D",
      audioFile: "F#4.mp3"
    },
    "G4": {
      ledgerLines: 0,
      fingerPositions: [3],
      string: "D",
      audioFile: "G4.mp3"
    },
    "G#4": {
      ledgerLines: 0,
      fingerPositions: [H3],
      string: "D",
      isEnharmonic: true,
      enharmonicName: "Ab4",
      audioFile: "G#4.mp3"
    },
    "Ab4": {
      ledgerLines: 0,
      fingerPositions: [L4],
      string: "D",
      isEnharmonic: true,
      enharmonicName: "G#4",
      audioFile: "G#4.mp3" // Using the same audio file as G#4
    },
    "A4": {
      ledgerLines: 0,
      fingerPositions: [4],
      string: "D",
      audioFile: "A4.mp3"
    },
    
    // A String
    "A4_alt": {
      ledgerLines: 0,
      fingerPositions: [0],
      string: "A",
      audioFile: "A4.mp3"
    },
    "A#4": {
      ledgerLines: 0,
      fingerPositions: [L1],
      string: "A",
      isEnharmonic: true,
      enharmonicName: "Bb4",
      audioFile: "Bb4.mp3"
    },
    "Bb4": {
      ledgerLines: 0,
      fingerPositions: [L1],
      string: "A",
      isEnharmonic: true,
      enharmonicName: "A#4",
      audioFile: "Bb4.mp3" // Using the same audio file as A#4
    },
    "B4": {
      ledgerLines: 0,
      fingerPositions: [1],
      string: "A",
      audioFile: "B4.mp3"
    },
    "C5": {
      ledgerLines: 0,
      fingerPositions: [L2],
      string: "A",
      audioFile: "C5.mp3"
    },
    "C#5": {
      ledgerLines: 0,
      fingerPositions: [H2],
      string: "A",
      audioFile: "C#5.mp3"
    },
    "D5": {
      ledgerLines: 0,
      fingerPositions: [3],
      string: "A",
      audioFile: "D5.mp3"
    },
    "D#5": {
      ledgerLines: 0,
      fingerPositions: [H3],
      string: "A",
      isEnharmonic: true,
      enharmonicName: "Eb5",
      audioFile: "D#5.mp3"
    },
    "Eb5": {
      ledgerLines: 0,
      fingerPositions: [L4],
      string: "A",
      isEnharmonic: true,
      enharmonicName: "D#5",
      audioFile: "D#5.mp3" // Using the same audio file as D#5
    },
    "E5": {
      ledgerLines: 0,
      fingerPositions: [4],
      string: "A",
      audioFile: "E5.mp3"
    },
    
    // E String (highest)
    "E5_alt": {
      ledgerLines: 0,
      fingerPositions: [0],
      string: "E",
      audioFile: "E5.mp3"
    },
    "F5": {
      ledgerLines: 0,
      fingerPositions: [L1],
      string: "E",
      audioFile: "F5.mp3"
    },
    "F#5": {
      ledgerLines: 0,
      fingerPositions: [1],
      string: "E",
      audioFile: "F#5.mp3"
    },
    "G5": {
      ledgerLines: 0,
      fingerPositions: [L2],
      string: "E",
      audioFile: "G5.mp3"
    },
    "G#5": {
      ledgerLines: 0,
      fingerPositions: [H2],
      string: "E",
      audioFile: "G#5.mp3"
    },
    "A5": {
      ledgerLines: 0,
      fingerPositions: [3],
      string: "E",
      audioFile: "A5.mp3"
    },
    "A#5": {
      ledgerLines: 0,
      fingerPositions: [H3],
      string: "E",
      isEnharmonic: true,
      enharmonicName: "Bb5",
      audioFile: "A#5.mp3"
    },
    "Bb5": {
      ledgerLines: 0,
      fingerPositions: [L4],
      string: "E",
      isEnharmonic: true,
      enharmonicName: "A#5",
      audioFile: "A#5.mp3" // Using the same audio file as A#5
    },
    "B5": {
      ledgerLines: 0,
      fingerPositions: [4],
      string: "E",
      audioFile: "B5.mp3"
    }
  },
  
  // Define different levels
  levels: {
    level1: {
      name: "Level 1: Open Strings",
      description: "Learn the open strings of the violin",
      notes: ["G3", "D4", "A4", "E5"],
      unlockRequirement: 10, // Need 10 XP to unlock level 2
      sharps: false,
      flats: false
    },
    level2: {
      name: "Level 2: Notes on Tapes",
      description: "Learn notes that use fingers on tapes",
      notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5", "E5", "F#5", "G#5", "A5", "B5"],
      unlockRequirement: 20, // Need 20 XP total to unlock level 3
      sharps: true,
      flats: false
    },
    level3: {
      name: "Level 3: Low 2's",
      description: "Introduction of low 2 finger position on all strings",
      notes: ["G3", "A3", "Bb3", "B3", "C4", "D4", "E4", "F4", "F#4", "G4", "A4", "B4", "C5", "C#5", "D5", "E5", "F#5", "G5" , "G#5" , "A5" , "B5"],
      unlockRequirement: 30, // Need 30 XP total to unlock level 4
      sharps: true,
      flats: true
    },
    level4: {
      name: "Level 4: Low 1's and Low 4's",
      description: "Introduction of low 1 and low 4 finger positions",
      notes: ["G3", "G#3", "Ab3", "A3", "Bb3", "B3", "C4", "C#4", "Db4", "D4", "D#4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "Ab4", "A4", "Bb4", "B4", "C5", "C#5", "D5", "D#5", "Eb5", "E5", "F5", "F#5", "G5", "G#5" , "A5", "A#5", "Bb5" , "B5"],
      unlockRequirement: 40,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level5: {
      name: "G String Practice",
      description: "Focus on all notes in the G string",
      notes: ["G3", "G#3", "Ab3", "A3", "Bb3", "A#3", "B3", "C4", "C#4", "Db4", "D4"],
      unlockRequirement: 50,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level6: {
      name: "D String Practice",
      description: "Focus on all notes in the D string",
      notes: ["D4_alt", "D#4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "Ab4", "A4"],
      unlockRequirement: 60,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level7: {
      name: "A String Practice",
      description: "Focus on all notes in the A string",
      notes: ["A4_alt", "A#4", "Bb4", "B4", "C5", "C#5", "D5", "D#5", "Eb5", "E5"],
      unlockRequirement: 70,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level8: {
      name: "E String Practice",
      description: "Focus on all notes in the E string",
      notes: ["E5_alt", "F5", "F#5", "G5", "G#5", "Ab5", "A5", "A#5", "Bb5", "B5"],
      unlockRequirement: 80,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level9: {
      name: "Enharmonic Challenge",
      description: "Master enharmonic equivalents across all strings",
      notes: ["G#3", "Ab3", "A#3", "Bb3", "C#4", "Db4", "D#4", "Eb4", "G#4", "Ab4", "A#4", "Bb4", "D#5", "Eb5", "G#5", "Ab5", "A#5", "Bb5"],
      unlockRequirement: 90,
      sharps: true,
      flats: true,
      enharmonics: true
    },
    level10: {
      name: "Master Violinist Challenge",
      description: "Test your knowledge of all notes in first position on the violin",
      notes: ["G3", "G#3", "Ab3", "A3", "Bb3", "B3", "C4", "C#4", "Db4", "D4", "D4_alt", "D#4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "Ab4", "A4", "A4_alt", "A#4", "Bb4", "B4", "C5", "C#5", "D5", "D#5", "Eb5", "E5", "E5_alt", "F5", "F#5", "G5", "G#5", "Ab5", "A5", "A#5", "Bb5", "B5"],
      unlockRequirement: 100,
      sharps: true,
      flats: true, 
      enharmonics: true,
      timer: true,
      minAccuracy: 85
    }
  },
}
  