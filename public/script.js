document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const autocompleteList = document.getElementById("autocompleteList");
    const flightsContainer = document.getElementById("flightsContainer");
    const flightsList = document.getElementById("flightsList");
    const titleElement = flightsContainer.querySelector("h2");
    const filtersSection = document.getElementById("filtersSection");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let destinations = [];
    let flightsData = [];
    let selectedMonths = new Set();

    titleElement.style.display = "none";
    filtersSection.style.display = "none";

    async function loadDestinations() {
        try {
            const response = await fetch("/api/data");
            const data = await response.json();
            flightsData = data;
            destinations = [...new Set(data.map(flight => flight.destination))];
        } catch (error) {
            console.error("Errore nel caricamento dei dati:", error);
        }
    }

    await loadDestinations();

    searchInput.addEventListener("input", function () {
        let query = this.value.toLowerCase().trim();
        autocompleteList.innerHTML = "";

        if (query.length < 1) {
            autocompleteList.style.display = "none";
            return;
        }

        let filtered = destinations.filter(dest => dest.toLowerCase().includes(query));

        if (filtered.length === 0) {
            autocompleteList.style.display = "none";
            return;
        }

        autocompleteList.style.display = "block";

        filtered.forEach(dest => {
            let item = document.createElement("div");
            item.classList.add("dropdown-item");
            item.textContent = dest;

            item.addEventListener("click", function () {
                searchInput.value = dest;
                autocompleteList.style.display = "none";
                filtersSection.style.display = "block";
                selectedMonths.clear();
                updateFiltersUI();
                displayFlights(dest);
            });

            autocompleteList.appendChild(item);
        });
    });

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !autocompleteList.contains(event.target)) {
            autocompleteList.style.display = "none";
        }
    });

    searchInput.addEventListener("blur", function () {
        if (!destinations.includes(this.value)) {
            this.value = "";
        }
    });

    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
                        "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
        const [day, month, year] = dateString.split("-").map(num => parseInt(num));
        return { text: `${day} ${months[month - 1]} ${year}`, month };
    }

    function translateDay(day) {
        const daysMap = {
            "Lun": "Lunedì", "Mar": "Martedì", "Mer": "Mercoledì",
            "Gio": "Giovedì", "Ven": "Venerdì", "Sab": "Sabato", "Dom": "Domenica"
        };
        return daysMap[day] || day;
    }

    function displayFlights(destination) {
        flightsList.innerHTML = "";

        const filteredFlights = flightsData.filter(flight => flight.destination === destination);

        titleElement.textContent = `Voli disponibili per ${destination}`;
        titleElement.style.display = "block";

        if (filteredFlights.length === 0) {
            flightsList.innerHTML = "<p class='has-text-centered has-text-danger'>Nessun volo trovato.</p>";
            return;
        }

        let hasResults = false;

        filteredFlights.forEach(flight => {
            let periodText = "";
            let monthFilter = [];

            if (flight.period.single) {
                let singleDate = formatDate(flight.period.single);
                periodText = `Attivo il ${singleDate.text}`;
                monthFilter.push(singleDate.month);
            } else {
                let fromDate = formatDate(flight.period.from);
                let toDate = formatDate(flight.period.to);
                periodText = `dal ${fromDate.text} al ${toDate.text}`;
                monthFilter.push(fromDate.month, toDate.month);
            }

            if (selectedMonths.size > 0 && !monthFilter.some(month => selectedMonths.has(month))) {
                return;
            }

            hasResults = true;

            let card = document.createElement("div");
            card.classList.add("flight-card");

            let formattedTime = `alle ore ${flight.time} (${translateDay(flight.frequency)})`;

            card.innerHTML = `
                <div class="flight-header">
                    <p class="flight-title">${flight.airline}</p>
                </div>
                <div class="flight-content">
                    <p><strong>Periodo:</strong> ${periodText}</p>
                    <p><strong>Partenza:</strong> ${formattedTime}</p>
                </div>
                <div class="flight-footer">
                    <p>N. volo: ${flight.flightNumber}</p>
                </div>
            `;

            flightsList.appendChild(card);
        });

        if (!hasResults) {
            flightsList.innerHTML = "<p class='no-results'>Nessun risultato trovato.</p>";
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            let month = parseInt(this.dataset.month);
            selectedMonths.has(month) ? selectedMonths.delete(month) : selectedMonths.add(month);
            updateFiltersUI();
            displayFlights(searchInput.value);
        });
    });

    function updateFiltersUI() {
        filterButtons.forEach(button => {
            let month = parseInt(button.dataset.month);
            button.classList.toggle("is-active", selectedMonths.has(month));
        });
    }
});
