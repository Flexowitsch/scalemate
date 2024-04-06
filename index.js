/*document.addEventListener('DOMContentLoaded', () => {
    const suggestButton = document.getElementById('suggestButton');
    const calendarButton = document.getElementById('calendarButton');
    const regenerateButton = document.getElementById('regenerateButton');
    const majorScalesContainer = document.getElementById('majorScalesContainer');
    const minorScalesContainer = document.getElementById('minorScalesContainer');
    const messageContainer = document.createElement('p');
    document.querySelector('.content-wrapper').appendChild(messageContainer);

    let regenerateClicks = 0;
    let calendarAddedScales = new Set(JSON.parse(localStorage.getItem('calendarAddedScales') || '[]'));

    function saveScalesToLocalStorage() {
        localStorage.setItem('calendarAddedScales', JSON.stringify([...calendarAddedScales]));
    }

    function getRandomScales(container) {
        const scales = Array.from(container.children);
        const visibleScales = scales.filter(scale => scale.style.display === 'flex');
        let availableScales = scales.filter(scale => !calendarAddedScales.has(scale.id) && !visibleScales.includes(scale));
        
        if (availableScales.length < 2) {
            calendarAddedScales.clear(); // Clear the set if not enough scales are available
            availableScales = [...scales]; // Restart the cycle
            saveScalesToLocalStorage(); // Save the reset state
        }
        return availableScales.sort(() => 0.5 - Math.random()).slice(0, 2); // Pick 2 random scales
    }

    function displayRandomScales() {
        const randomMajorScales = getRandomScales(majorScalesContainer);
        const randomMinorScales = getRandomScales(minorScalesContainer);

        // Reset display styles for all scales
        Array.from(majorScalesContainer.children).forEach(scale => scale.style.display = 'none');
        Array.from(minorScalesContainer.children).forEach(scale => scale.style.display = 'none');

        // Display the randomly selected scales
        randomMajorScales.forEach(scale => scale.style.display = 'flex');
        randomMinorScales.forEach(scale => scale.style.display = 'flex');
        document.querySelector('.suggestions-container').style.display = 'block';
    }

    suggestButton.addEventListener('click', () => {
        displayRandomScales();
        suggestButton.style.display = 'none';
        calendarButton.style.display = 'flex';
        regenerateButton.style.display = 'flex';
        regenerateClicks = 0;
        messageContainer.textContent = '';
    });

    regenerateButton.addEventListener('click', () => {
        if (regenerateClicks < 3) {
            displayRandomScales();
            regenerateClicks += 1;
        } else {
            messageContainer.textContent = 'No more regeneration possible now. It is time to practice!';
        }
    });

    calendarButton.addEventListener('click', () => {
        const shownScales = document.querySelectorAll('#majorScalesContainer .flex[style="display: flex;"], #minorScalesContainer .flex[style="display: flex;"]');
        shownScales.forEach(scale => calendarAddedScales.add(scale.id));
        saveScalesToLocalStorage();

        const visibleScaleNames = Array.from(shownScales).map(scale => scale.textContent.trim().replace(/\s+/g, ' '));
        const eventTitle = `Practice Scales: ${visibleScaleNames.join(', ')}`;

        const nextMonday = new Date();
        nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextSunday.getDate() + 6);

        const formatAsICalDate = date => date.toISOString().slice(0, 10).replace(/-/g, '');
        const iCalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:${formatAsICalDate(nextMonday)}
DTEND;VALUE=DATE:${formatAsICalDate(nextSunday)}
SUMMARY:${eventTitle}
DESCRIPTION:This week, practice the following scales: ${visibleScaleNames.join(', ')}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([iCalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'WeeklyScalesPractice.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
*/

document.addEventListener('DOMContentLoaded', () => {
    const suggestButton = document.getElementById('suggestButton');
    const calendarButton = document.getElementById('calendarButton');
    const regenerateButton = document.getElementById('regenerateButton');
    const majorScalesContainer = document.getElementById('majorScalesContainer');
    const minorScalesContainer = document.getElementById('minorScalesContainer');
    const messageContainer = document.createElement('p');
    document.querySelector('.content-wrapper').appendChild(messageContainer);

    let regenerateClicks = 0;
    let calendarAddedScales = new Set(JSON.parse(localStorage.getItem('calendarAddedScales') || '[]'));

    function saveScalesToLocalStorage() {
        localStorage.setItem('calendarAddedScales', JSON.stringify([...calendarAddedScales]));
    }

    function clearLocalStorageAndReset() {
        localStorage.clear();
        calendarAddedScales.clear();
        saveScalesToLocalStorage();
        messageContainer.textContent = 'All scales have been practiced. Repetition will now begin again.';
        messageContainer.style.color = 'red'; // Optional: style the message
    }

    function getRandomScales(container) {
        const scales = Array.from(container.children);
        const visibleScales = scales.filter(scale => scale.style.display === 'flex');
        let availableScales = scales.filter(scale => !calendarAddedScales.has(scale.id) && !visibleScales.includes(scale));
        
        if (availableScales.length < 2) {
            clearLocalStorageAndReset();
            availableScales = [...scales]; // Restart the cycle
            saveScalesToLocalStorage(); // Save the reset state
            return availableScales.sort(() => 0.5 - Math.random()).slice(0, 2); // Pick 2 random scales
        }
        return availableScales.sort(() => 0.5 - Math.random()).slice(0, 2);
    }

    function displayRandomScales() {
        const randomMajorScales = getRandomScales(majorScalesContainer);
        const randomMinorScales = getRandomScales(minorScalesContainer);

        Array.from(majorScalesContainer.children).concat(Array.from(minorScalesContainer.children))
            .forEach(scale => scale.style.display = 'none');

        randomMajorScales.forEach(scale => scale.style.display = 'flex');
        randomMinorScales.forEach(scale => scale.style.display = 'flex');
        document.querySelector('.suggestions-container').style.display = 'block';
    }

    suggestButton.addEventListener('click', () => {
        displayRandomScales();
        suggestButton.style.display = 'none';
        calendarButton.style.display = 'flex';
        regenerateButton.style.display = 'flex';
        regenerateClicks = 0;
        messageContainer.textContent = '';
    });

    regenerateButton.addEventListener('click', () => {
        if (regenerateClicks < 3) {
            displayRandomScales();
            regenerateClicks += 1;
        } else {
            messageContainer.textContent = 'No more regeneration possible now. It is time to practice!';
        }
    });

    calendarButton.addEventListener('click', () => {
        const shownScales = document.querySelectorAll('#majorScalesContainer .flex[style="display: flex;"], #minorScalesContainer .flex[style="display: flex;"]');
        shownScales.forEach(scale => calendarAddedScales.add(scale.id));
        saveScalesToLocalStorage();

        const visibleScaleNames = Array.from(shownScales).map(scale => scale.textContent.trim().replace(/\s+/g, ' '));
        const eventTitle = `Practice Scales: ${visibleScaleNames.join(', ')}`;

        const nextMonday = new Date();
        nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextSunday.getDate() + 6);

        const formatAsICalDate = date => date.toISOString().slice(0, 10).replace(/-/g, '');
        const iCalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:${formatAsICalDate(nextMonday)}
DTEND;VALUE=DATE:${formatAsICalDate(nextSunday)}
SUMMARY:${eventTitle}
DESCRIPTION:This week, practice the following scales: ${visibleScaleNames.join(', ')}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([iCalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'WeeklyScalesPractice.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
