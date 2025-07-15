// Test the phase cycling logic
const phases = ['Dusk', 'Night', 'Midnight', 'Dawn'];
let phaseIndex = 0;
let currentPhase = phases[phaseIndex];

console.log('=== PHASE CYCLING TEST ===');
console.log('Initial phase:', currentPhase, 'Index:', phaseIndex);

for (let i = 0; i < 10; i++) {
    phaseIndex = (phaseIndex + 1) % phases.length;
    currentPhase = phases[phaseIndex];
    console.log(`Turn ${i + 1}: Phase: ${currentPhase}, Index: ${phaseIndex}`);
}
