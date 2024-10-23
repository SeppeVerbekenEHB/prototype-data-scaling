document.addEventListener('DOMContentLoaded', async () => {
    let plants = []; // Store fetched plant data
    let currentPage = 0; // Track the current page
    let plantsPerPage = 10; // Default plants per page
    let totalPlants = 0; // Track the total number of plants

    // Function to show the loading spinner
    function showSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'flex';
    }

    // Function to hide the loading spinner
    function hideSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'none';
    }

    // Function to fetch plants from the server
    async function fetchPlants() {
        showSpinner(); // Show spinner before fetching data
        try {
            const response = await fetch(`/plants?limit=${plantsPerPage}&offset=${currentPage * plantsPerPage}`);
            const data = await response.json();
            plants = data.plants; // Store fetched plants in the global array
            totalPlants = data.total; // Get the total number of plants
            displayPlants(plants); // Display the current page of plants
            updatePagination(); // Update pagination controls
        } catch (error) {
            console.error('Error fetching plant data:', error);
        } finally {
            hideSpinner(); // Hide spinner after fetching data
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

    // Function to update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(totalPlants / plantsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${currentPage + 1} of ${totalPages}`;

        document.getElementById('prevPage').disabled = currentPage === 0; // Disable previous button on first page
        document.getElementById('nextPage').disabled = currentPage >= totalPages - 1; // Disable next button on last page
    }

    // Event listeners for pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchPlants();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(totalPlants / plantsPerPage);
        if (currentPage < totalPages - 1) {
            currentPage++;
            fetchPlants();
        }
    });

    // Event listener for plants per page change
    document.getElementById('plantsPerPage').addEventListener('change', (event) => {
        plantsPerPage = parseInt(event.target.value);
        currentPage = 0; // Reset to first page
        fetchPlants(); // Fetch plants again with the new limit
    });

    // Initial fetch on page load
    fetchPlants();
});
