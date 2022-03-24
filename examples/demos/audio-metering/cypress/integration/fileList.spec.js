// import exampleTrackAnalysis from './exampleAnalysis';

describe('upload & analysis tests', () => {
    const testFiles = [
        '/home/jorge/Downloads/Ketsa-Vitality/01 Ketsa - Amigo.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/02 Ketsa - Big Love.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/03 Ketsa - Bright Daze.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/04 Ketsa - Bring the Swing.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/05 Ketsa - Deep Mystery.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/06 Ketsa - Found Amongst the Rocks.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/07 Ketsa - Hide-and-Seek.mp3',
        '/home/jorge/Downloads/Ketsa-Vitality/08 Ketsa - Looking Down.mp3'
    ];

    // it('upload produces list on screen', () => {
    //     cy.visit('http://localhost:3000');
    //     let inputElem = cy.get('#dropzone > input[type=file]');
    //     inputElem.selectFile(testFiles, {force: true});
    // })

    it('automatic file upload', () => {
        const shortTrack = '/home/jorge/Downloads/277325_4548252-lq.mp3';
        const testRight = '/home/jorge/Downloads/phase-test-right.mp3';
        const testLeft = '/home/jorge/Downloads/phase-test-left.mp3';
        const testInverse = '/home/jorge/Downloads/phase-test-inverse.mp3';
        const testDecorr = '/home/jorge/Downloads/phase-test-decorr.mp3';

        cy.visit('http://localhost:3000');
        let inputElem = cy.get('#dropzone > input[type=file]');
        // inputElem.selectFile(testFiles.slice(0, 4), {force: true});
        inputElem.selectFile(shortTrack, {force: true});

        cy.contains('Analyse my tracks').click();
    })
})