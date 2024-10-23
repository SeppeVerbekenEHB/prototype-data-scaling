document.addEventListener('DOMContentLoaded', async () => {
    let plants = []; // Store fetched plant data
    let currentPage = 0; // Track the current page
    let plantsPerPage = 10; // Default number of plants per page

    // Function to fetch plants from the server
    async function fetchPlants() {
        showSpinner(); // Show loading spinner
        try {
            const response = await fetch(`/plants?limit=${plantsPerPage}&offset=${currentPage * plantsPerPage}`);
            const data = await response.json();
            plants = data.plants; // Store fetched plants in the global array
            const totalPlants = data.total; // Get total plants for pagination
            displayPlants(plants); // Display the fetched plants
            updatePagination(totalPlants); // Update pagination controls
        } catch (error) {
            console.error('Error fetching plant data:', error);
        } finally {
            hideSpinner(); // Hide loading spinner
        }
    }

    // Function to display plants in the table
    function displayPlants(plants) {
        const tableBody = document.getElementById('plantTableBody');
        tableBody.innerHTML = ''; // Clear existing table rows

        plants.forEach(plant => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = plant.name;

            const bloomTimeCell = document.createElement('td');
            bloomTimeCell.textContent = plant.bloom_time;

            const plantingTimeCell = document.createElement('td');
            plantingTimeCell.textContent = plant.planting_time;

            const discovererCell = document.createElement('td');
            discovererCell.textContent = plant.discoverer;

            row.appendChild(nameCell);
            row.appendChild(bloomTimeCell);
            row.appendChild(plantingTimeCell);
            row.appendChild(discovererCell);

            tableBody.appendChild(row);
        });
    }

    // Function to convert plant data to CSV format
    function convertToCSV(plants) {
        const header = ['Name', 'Bloom Time', 'Planting Time', 'Discoverer'];
        const rows = plants.map(plant => [
            plant.name,
            plant.bloom_time,
            plant.planting_time,
            plant.discoverer
        ]);

        const csvContent = [header, ...rows]
            .map(e => e.join(','))
            .join('\n');

        return csvContent;
    }

    // Function to download the CSV file
    function downloadCSV(plants) {
        const csvData = convertToCSV(plants);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plants_data.csv'); // File name for the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
    }

    // Function to filter plants based on search and filters
    function filterPlants() {
        const searchTerm = document.getElementById('searchPlant').value.toLowerCase();
        const discovererSearchTerm = document.getElementById('searchDiscoverer').value.toLowerCase();
        const bloomMonth = document.getElementById('bloomTimeFilter').value;
        const plantingMonth = document.getElementById('plantingTimeFilter').value;

        const filteredPlants = plants.filter(plant => {
            const matchesName = plant.name.toLowerCase().includes(searchTerm);
            const matchesDiscoverer = plant.discoverer.toLowerCase().includes(discovererSearchTerm);
            const matchesBloom = !bloomMonth || plant.bloom_time.includes(bloomMonth);
            const matchesPlanting = !plantingMonth || plant.planting_time.includes(plantingMonth);

            return matchesName && matchesDiscoverer && matchesBloom && matchesPlanting;
        });

        displayPlants(filteredPlants); // Display the filtered results
    }

    // Function to handle pagination
    function updatePagination(totalPlants) {
        const paginationInfo = document.getElementById('pageInfo');
        const totalPages = Math.ceil(totalPlants / plantsPerPage);
        
        paginationInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        
        document.getElementById('prevPage').disabled = currentPage === 0; // Disable previous button if on first page
        document.getElementById('nextPage').disabled = currentPage >= totalPages - 1; // Disable next button if on last page
    }

    // Show the loading spinner
    function showSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'block';
    }

    // Hide the loading spinner
    function hideSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'none';
    }

    // Event listeners for searching and filtering
    document.getElementById('filterPlants').addEventListener('click', filterPlants);
    document.getElementById('searchPlant').addEventListener('input', filterPlants);
    document.getElementById('searchDiscoverer').addEventListener('input', filterPlants);

    // Event listener for plants per page dropdown
    document.getElementById('plantsPerPage').addEventListener('change', (event) => {
        plantsPerPage = parseInt(event.target.value);
        currentPage = 0; // Reset to first page
        fetchPlants(); // Fetch plants with new limit
    });

    // Event listener for pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchPlants(); // Fetch plants for previous page
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchPlants(); // Fetch plants for next page
    });

    // Event listener for CSV export
    document.getElementById('exportCSV').addEventListener('click', () => {
        downloadCSV(plants); // Pass the current plants data to download
    });

    // Initial fetch on page load
    fetchPlants();
});
