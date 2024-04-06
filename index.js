document.addEventListener('DOMContentLoaded', () => {
    const suggestButton = document.getElementById('suggestButton');
    const calendarButton = document.getElementById('calendarButton');
    const regenerateButton = document.getElementById('regenerateButton');
    const majorScalesContainer = document.getElementById('majorScalesContainer');
    const minorScalesContainer = document.getElementById('minorScalesContainer');
    const messageContainer = document.createElement('p');
    document.querySelector('.content-wrapper').appendChild(messageContainer);

    let regenerateClicks = 0;
    let shownMajorScales = [];
    let shownMinorScales = [];
    let calendarAddedScales = new Set(JSON.parse(localStorage.getItem('calendarAddedScales') || '[]'));

    function saveScalesToLocalStorage() {
        localStorage.setItem('calendarAddedScales', JSON.stringify([...calendarAddedScales]));
    }

    function clearLocalStorageAndReset() {
        localStorage.clear(); // Clears all local storage, reset specifically if needed
        calendarAddedScales.clear();
        saveScalesToLocalStorage(); // Save the empty set to local storage to reset the state
        messageContainer.textContent = 'All scales have been practiced, starting over.';
    }

    function getRandomScales(scales, shownScales) {
        let availableScales = scales.filter(scale => !calendarAddedScales.has(scale.id) && !shownScales.includes(scale));
        if (availableScales.length < 2) {
            shownScales.length = 0;
            availableScales = scales.filter(scale => !calendarAddedScales.has(scale.id));
            if (availableScales.length < 2) {
                clearLocalStorageAndReset();
                availableScales = [...scales];
            }
        }
        return availableScales.sort(() => 0.5 - Math.random()).slice(0, 2);
    }

    function displayRandomScales() {
        const majorScales = Array.from(majorScalesContainer.children);
        const minorScales = Array.from(minorScalesContainer.children);

        majorScales.forEach(scale => scale.style.display = 'none');
        minorScales.forEach(scale => scale.style.display = 'none');

        const randomMajorScales = getRandomScales(majorScales, shownMajorScales);
        const randomMinorScales = getRandomScales(minorScales, shownMinorScales);

        randomMajorScales.forEach(scale => {
            scale.style.display = 'flex';
            shownMajorScales.push(scale);
        });
        randomMinorScales.forEach(scale => {
            scale.style.display = 'flex';
            shownMinorScales.push(scale);
        });

        document.querySelector('.suggestions-container').style.display = 'block';
    }

    suggestButton.addEventListener('click', () => {
        suggestButton.style.display = 'none';
        calendarButton.style.display = 'flex';
        regenerateButton.style.display = 'flex';

        regenerateClicks = 0;
        messageContainer.textContent = '';
        displayRandomScales();
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
        const shownScales = document.querySelectorAll('#majorScalesContainer .flex, #minorScalesContainer .flex');
        shownScales.forEach(scale => {
            if (scale.style.display === 'flex') {
                calendarAddedScales.add(scale.id);
            }
        });

        if (calendarAddedScales.size === majorScalesContainer.children.length + minorScalesContainer.children.length) {
            clearLocalStorageAndReset();
        } else {
            saveScalesToLocalStorage();
        }

        const allShownScales = Array.from(shownScales).map(scale => document.getElementById(scale.id).textContent.trim());
        const scalesForTitle = allShownScales.slice(0, 5).join(', ') + (allShownScales.length > 5 ? ` +${allShownScales.length - 5} more` : '');
        const eventTitle = `Practice Scales: ${scalesForTitle}`;

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
DESCRIPTION:This week, practice the following scales: ${allShownScales.join(', ')}
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
