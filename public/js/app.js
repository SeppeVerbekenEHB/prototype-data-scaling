document.addEventListener('DOMContentLoaded', async () => {
    let plants = [];
    let currentPage = 0;
    let plantsPerPage = 10;

    async function fetchPlants() {
        showSpinner();
        try {
            const response = await fetch(`/plants?limit=${plantsPerPage}&offset=${currentPage * plantsPerPage}`);
            const data = await response.json();
            plants = data.plants;
            const totalPlants = data.total;
            displayPlants(plants);
            updatePagination(totalPlants);
        } catch (error) {
            console.error('Error fetching plant data:', error);
        } finally {
            hideSpinner();
        }
    }

    function displayPlants(plants) {
        const tableBody = document.getElementById('plantTableBody');
        tableBody.innerHTML = '';

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

    function updatePagination(totalPlants) {
        const paginationInfo = document.getElementById('pageInfo');
        const totalPages = Math.ceil(totalPlants / plantsPerPage);
        
        paginationInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        
        document.getElementById('prevPage').disabled = currentPage === 0; // Disable previous button if on first page
        document.getElementById('nextPage').disabled = currentPage >= totalPages - 1; // Disable next button if on last page
    }

    function showSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'block';
    }

    function hideSpinner() {
        document.getElementById('loadingSpinnerContainer').style.display = 'none';
    }

    document.getElementById('filterPlants').addEventListener('click', filterPlants);
    document.getElementById('searchPlant').addEventListener('input', filterPlants);
    document.getElementById('searchDiscoverer').addEventListener('input', filterPlants);

    document.getElementById('plantsPerPage').addEventListener('change', (event) => {
        plantsPerPage = parseInt(event.target.value);
        currentPage = 0;
        fetchPlants();
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchPlants();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchPlants();
    });

    document.getElementById('exportCSV').addEventListener('click', () => {
        downloadCSV(plants);
    });

    fetchPlants();
});
