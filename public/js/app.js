document.addEventListener('DOMContentLoaded', async () => {
    let plants = []; // Store fetched plant data

    // Function to fetch plants from the server
    async function fetchPlants() {
        try {
            const response = await fetch('/plants');
            const data = await response.json();
            plants = data; // Store fetched plants in the global array
            displayPlants(plants); // Display all plants initially
        } catch (error) {
            console.error('Error fetching plant data:', error);
        }
    }

    // Function to display plants in the table
    function displayPlants(plants) {
        const tableBody = document.getElementById('plantTableBody');
        tableBody.innerHTML = ''; // Clear existing table rows

        plants.forEach(plant => {
            // Create a new table row
            const row = document.createElement('tr');

            // Create table data cells for each plant property
            const nameCell = document.createElement('td');
            nameCell.textContent = plant.name;

            const bloomTimeCell = document.createElement('td');
            bloomTimeCell.textContent = plant.bloom_time;

            const plantingTimeCell = document.createElement('td');
            plantingTimeCell.textContent = plant.planting_time;

            const discovererCell = document.createElement('td');
            discovererCell.textContent = plant.discoverer;

            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(bloomTimeCell);
            row.appendChild(plantingTimeCell);
            row.appendChild(discovererCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    }

    // Function to filter plants based on selected bloom and planting times
    function filterPlants() {
        const bloomMonth = document.getElementById('bloomTimeFilter').value;
        const plantingMonth = document.getElementById('plantingTimeFilter').value;

        const filteredPlants = plants.filter(plant => plant.bloom_time.includes(bloomMonth) && plant.planting_time.includes(plantingMonth));

        displayPlants(filteredPlants); // Display the filtered results
    }

    // Event listener for filtering
    document.getElementById('filterPlants').addEventListener('click', filterPlants);

    // Initial fetch on page load
    fetchPlants();
});