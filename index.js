

    // Initialize arrays for major and minor scales
    let majorScales = ['C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major', 'F# Major', 'Db Major', 'Ab Major', 'Eb Major', 'Bb Major', 'F Major'];
    let minorScales = ['A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor', 'G# Minor', 'D# Minor', 'Bb Minor', 'F Minor', 'C Minor', 'G Minor', 'D Minor'];

    // Initialize arrays to keep track of selected scales
    let selectedMajorScales = [];
    let selectedMinorScales = [];

    // Function to shuffle arrays
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to suggest scales
    function suggestScales() {
        // Shuffle arrays if all scales have been selected
        if (selectedMajorScales.length === majorScales.length && selectedMinorScales.length === minorScales.length) {
            selectedMajorScales = [];
            selectedMinorScales = [];
        }

        // Shuffle arrays if all major scales have been selected
        if (selectedMajorScales.length === majorScales.length) {
            selectedMajorScales = [];
        }

        // Shuffle arrays if all minor scales have been selected
        if (selectedMinorScales.length === minorScales.length) {
            selectedMinorScales = [];
        }

        // Randomly select two major scales
        let suggestedMajorScales = [];
        while (suggestedMajorScales.length < 2) {
            const randomIndex = Math.floor(Math.random() * majorScales.length);
            const scale = majorScales[randomIndex];
            if (!selectedMajorScales.includes(scale)) {
                suggestedMajorScales.push(scale);
                selectedMajorScales.push(scale);
            }
        }

        // Randomly select two minor scales
        let suggestedMinorScales = [];
        while (suggestedMinorScales.length < 2) {
            const randomIndex = Math.floor(Math.random() * minorScales.length);
            const scale = minorScales[randomIndex];
            if (!selectedMinorScales.includes(scale)) {
                suggestedMinorScales.push(scale);
                selectedMinorScales.push(scale);
            }
        }

        // Display the suggested scales
        document.getElementById('selectedScales').innerHTML = `
            <p>Suggested Major Scales:</p>
            <ul>
                <li>${suggestedMajorScales[0]}</li>
                <li>${suggestedMajorScales[1]}</li>
            </ul>
            <p>Suggested Minor Scales:</p>
            <ul>
                <li>${suggestedMinorScales[0]}</li>
                <li>${suggestedMinorScales[1]}</li>
            </ul>
        `;
    }

    // Add event listener to the button
    document.getElementById('suggestButton').addEventListener('click', suggestScales);
