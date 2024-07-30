import { loadNavbar,loadFooter } from './index.js';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('id');

    const apiURL = `https://api-colombia.com/api/v1/Department/${departmentId}`;

    const fetchDepartmentDetails = async () => {
        try {
            const response = await fetch(apiURL);
            const department = await response.json();
            displayDepartmentDetails(department);
        } catch (error) {
            console.error('Error al obtener los detalles del departamento:', error);
        }
    };

    const displayDepartmentDetails = (department) => {
        const departmentInfo = document.getElementById('department-info');
        departmentInfo.innerHTML = `
            <h3>${department.name}</h3>
            <p>Código: ${department.id}</p>
            <p>Descripción: ${department.description}</p>
        `;
    };

    const fetchRelatedInfo = async (type) => {
        try {
            const response = await fetch(`https://api-colombia.com/api/v1/${type}?departmentId=${departmentId}`);
            const data = await response.json();
            displayRelatedInfo(data, type);
        } catch (error) {
            console.error(`Error al obtener las ${type}:`, error);
        }
    };

    const displayRelatedInfo = (data, type) => {
        const relatedInfoContainer = document.getElementById('related-info');
        relatedInfoContainer.innerHTML = '';

        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('col-md-4');
            card.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Descripción: ${item.description || 'N/A'}</p>
                    </div>
                </div>
            `;
            relatedInfoContainer.appendChild(card);
        });
    };

    document.getElementById('showCities').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('City');
        } else {
            document.getElementById('related-info').innerHTML = '';
        }
    });

    document.getElementById('showAreas').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('NaturalArea');
        } else {
            document.getElementById('related-info').innerHTML = '';
        }
    });

    fetchDepartmentDetails();

    // Funcion filtros ordena por letra inicial o busqueda
    const filterDepartments = () => {
        const searchText = document.getElementById('search-bar').value.toLowerCase();
        const selectedFilters = Array.from(document.querySelectorAll('#filter-checkboxes input:checked')).map(cb => cb.value);
        
        const filteredDepartments = departments.filter(department => {
            const matchesSearch = department.name.toLowerCase().includes(searchText);
            const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(department.name.charAt(0).toUpperCase());
            return matchesSearch && matchesFilter;
        });

        displayDepartments(filteredDepartments);
    };

    document.getElementById('search-bar').addEventListener('input', filterDepartments);

});
