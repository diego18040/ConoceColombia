import { loadNavbar, loadFooter } from './index.js'; // Importa la función loadNavbar desde index.js

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
    loadFooter();

    const apiURL = 'https://api-colombia.com/api/v1/Invasivespecie';
    const itemsPerPage = 5;
    let currentPage = 1;
    let invasiveSpecies = [];

    const fetchInvasiveSpecies = async () => {
        try {
            const response = await fetch(apiURL);
            invasiveSpecies = await response.json();
            renderTable();
            renderPagination();
        } catch (error) {
            console.error('Error al obtener las especies invasoras:', error);
        }
    };

    const createTableRow = (species) => {
        let rowColor = '';
        if (species.riskLevel === 1) {
            rowColor =  'table-primary';
        } else if (species.riskLevel === 2) {
            rowColor = 'table-success';
        }

        return `
            <tr class="${rowColor}">
                <td>${species.name}</td>
                <td>${species.scientificName}</td>
                <td>${species.impact}</td>
                <td>${species.manage}</td>
                <td>${species.riskLevel}</td>
                <td><img src="${species.urlImage}" alt="${species.name}" width="100"></td>
            </tr>
        `;
    };

    const renderTable = () => {
        const tableBody = document.getElementById('invasive-species-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = invasiveSpecies.slice(startIndex, endIndex);

        pageItems.forEach(species => {
            tableBody.innerHTML += createTableRow(species);
        });
    };

    const renderPagination = () => {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(invasiveSpecies.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationContainer.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        }

        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                currentPage = parseInt(event.target.textContent);
                renderTable();
                renderPagination();
            });
        });
    };

    fetchInvasiveSpecies();
});
