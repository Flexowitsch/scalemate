
document.addEventListener('DOMContentLoaded', () => {
    const subline = document.getElementById("subline");
    const suggestButton = document.getElementById('suggestButton');
    const calendarButton = document.getElementById('calendarButton');
    const regenerateButton = document.getElementById('regenerateButton');
    const majorScalesContainer = document.getElementById('majorScalesContainer');
    const minorScalesContainer = document.getElementById('minorScalesContainer');
    const messageContainer = document.createElement('p');
    let regenerateClicks = 0;
    let shownMajorScales = [];
    let shownMinorScales = [];

    document.querySelector('.content-wrapper').appendChild(messageContainer);

    function getRandomScales(scales, shownScales) {
        let availableScales = scales.filter(scale => !shownScales.includes(scale));
        if (availableScales.length < 2) {
            shownScales.length = 0; // Reset if there are not enough scales left for selection
            availableScales = [...scales];
        }
        return availableScales.sort(() => 0.5 - Math.random()).slice(0, 2); // Return 2 random scales
    }

    suggestButton.addEventListener('click', () => {
        suggestButton.style.display = 'none';
        calendarButton.style.display = 'flex';
        regenerateButton.style.display = 'flex';

        regenerateClicks = 0; // Reset the counter if suggest is clicked again after practicing.
        messageContainer.textContent = ''; // Clear message
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

    function displayRandomScales() {
        const majorScales = Array.from(majorScalesContainer.children);
        const minorScales = Array.from(minorScalesContainer.children);


        majorScalesContainer.style.justifyContent = 'space-between';
        minorScalesContainer.style.justifyContent = 'space-between';

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

        document.querySelector('.suggestions-container').style.display = 'block'; // Show the suggestions container
    }
});


// Calendar Button functionality

calendarButton.addEventListener('click', () => {
    const shownMajorScaleNames = Array.from(document.querySelectorAll('#majorScalesContainer .flex[style="display: flex;"] span')).map(element => element.textContent);
    const shownMinorScaleNames = Array.from(document.querySelectorAll('#minorScalesContainer .flex[style="display: flex;"] span')).map(element => element.textContent);
    let allShownScales = shownMajorScaleNames.concat(shownMinorScaleNames);

    // Limit the number of scales in the title to keep it reasonable
    const scalesForTitle = allShownScales.slice(0, 5);
    const moreScales = allShownScales.length > 5 ? ` +${allShownScales.length - 5} more` : '';
    const eventTitle = `Practice Scales: ${scalesForTitle.join(', ')}${moreScales}`;

    // Find next Monday
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));

    // Find following Sunday
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6);

    const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };

    // Create an iCal event for the whole next week
    const iCalContent = 
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:${nextMonday.toLocaleDateString('en-CA', dateFormat).replace(/-/g, '')}
DTEND;VALUE=DATE:${nextSunday.toLocaleDateString('en-CA', dateFormat).replace(/-/g, '')}
SUMMARY:${eventTitle}
DESCRIPTION:This week, practice the following scales: ${allShownScales.join(', ')}
END:VEVENT
END:VCALENDAR`;

    // Trigger the download
    const blob = new Blob([iCalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WeeklyScalesPractice.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
