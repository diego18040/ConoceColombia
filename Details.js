import { loadNavbar, loadFooter } from './index.js';
document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
    loadFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('id');
    const itemsPerPage = 5;

    let citiesData = [];
    let naturalAreasData = [];
    let currentPageCities = 1;
    let currentPageNaturalAreas = 1;

    const fetchDepartmentDetails = async () => {
        try {
            const response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}`);
            const department = await response.json();
            displayDepartmentDetails(department);
        } catch (error) {
            console.error('Error al obtener los detalles del departamento:', error);
        }
    };

    const fetchRelatedInfo = async (type) => {
        try {
            let url = '';
            if (type === 'City') {
                url = `https://api-colombia.com/api/v1/Department/${departmentId}/cities`;
            } else if (type === 'NaturalArea') {
                url = `https://api-colombia.com/api/v1/Department/${departmentId}/naturalareas`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (type === 'City') {
                console.log('Cities Data:', data); // Para depuración
                citiesData = data;
                displayRelatedInfo(citiesData, 'City', currentPageCities);
                renderPagination(citiesData.length, 'cities-pagination', currentPageCities, updateCitiesPage);
            } else if (type === 'NaturalArea') {
                console.log('NaturalAreas Data:', data); // Para depuración
                if (data.length > 0) {
                    naturalAreasData = data[0].naturalAreas || [];
                    displayRelatedInfo(naturalAreasData, 'NaturalArea', currentPageNaturalAreas);
                    renderPagination(naturalAreasData.length, 'areas-pagination', currentPageNaturalAreas, updateNaturalAreasPage);
                } else {
                    console.log("No se encontraron áreas naturales para este departamento.");
                }
            }
        } catch (error) {
            console.error(`Error al obtener las ${type}:`, error);
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

    const displayRelatedInfo = (data, type, currentPage) => {
        let tableBodyId = '';
        if (type === 'City') {
            tableBodyId = 'cities-table-body';
        } else if (type === 'NaturalArea') {
            tableBodyId = 'areas-table-body';
        }

        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = data.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description || 'Proximamente'}</td>
                </tr>
            `;
        });
    };

    const renderPagination = (totalItems, paginationId, currentPage, updatePageFunction) => {
        const paginationContainer = document.getElementById(paginationId);
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationContainer.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        }

        document.querySelectorAll(`#${paginationId} .page-link`).forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const newPage = parseInt(event.target.textContent);
                updatePageFunction(newPage);
            });
        });
    };

    const updateCitiesPage = (newPage) => {
        currentPageCities = newPage;
        displayRelatedInfo(citiesData, 'City', currentPageCities);
        renderPagination(citiesData.length, 'cities-pagination', currentPageCities, updateCitiesPage);
    };

    const updateNaturalAreasPage = (newPage) => {
        currentPageNaturalAreas = newPage;
        displayRelatedInfo(naturalAreasData, 'NaturalArea', currentPageNaturalAreas);
        renderPagination(naturalAreasData.length, 'areas-pagination', currentPageNaturalAreas, updateNaturalAreasPage);
    };

    document.getElementById('showCities').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('City');
        } else {
            document.getElementById('cities-table-body').innerHTML = '';
            document.getElementById('cities-pagination').innerHTML = '';
        }
    });

    document.getElementById('showAreas').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('NaturalArea');
        } else {
            document.getElementById('areas-table-body').innerHTML = '';
            document.getElementById('areas-pagination').innerHTML = '';
        }
    });

    document.getElementById('search-bar').addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredCities = citiesData.filter(item => item.name.toLowerCase().includes(searchText));
        const filteredAreas = naturalAreasData.filter(item => item.name.toLowerCase().includes(searchText));

        displayRelatedInfo(filteredCities, 'City', 1);
        renderPagination(filteredCities.length, 'cities-pagination', 1, updateCitiesPage);

        displayRelatedInfo(filteredAreas, 'NaturalArea', 1);
        renderPagination(filteredAreas.length, 'areas-pagination', 1, updateNaturalAreasPage);
    });

    fetchDepartmentDetails();
});



/*import { loadNavbar, loadFooter } from './index.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
    loadFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('id');
    const departmentApiURL = `https://api-colombia.com/api/v1/Department/${departmentId}`;
    const itemsPerPage = 5; // Número de ítems por página

    let citiesData = [];
    let naturalAreasData = [];
    let currentPageCities = 1;
    let currentPageNaturalAreas = 1;

    const fetchDepartmentDetails = async () => {
        try {
            const response = await fetch(departmentApiURL);
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
            let url = '';
            if (type === 'City') {
                url = `https://api-colombia.com/api/v1/Department/${departmentId}/cities`;
            } else if (type === 'NaturalArea') {
                url = `https://api-colombia.com/api/v1/Department/${departmentId}/naturalareas`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (type === 'City') {
                console.log('Cities Data:', data); // Para depuración
                citiesData = data;
                displayRelatedInfo(citiesData, type, currentPageCities);
                renderPagination(citiesData.length, 'cities-pagination', currentPageCities, updateCitiesPage);
                
            } else if (type === 'NaturalArea') {
                console.log('NaturalAreas Data:', data); // Para depuración
                naturalAreasData = data;
                displayRelatedInfo(naturalAreasData, type, currentPageNaturalAreas);
                renderPagination(naturalAreasData.length, 'areas-pagination', currentPageNaturalAreas, updateNaturalAreasPage);
            }
        } catch (error) {
            console.error(`Error al obtener las ${type}:`, error);
        }
    };

    const displayRelatedInfo = (data, type, currentPage) => {
        let tableBodyId = '';
        if (type === 'City') {
            tableBodyId = 'cities-table-body';
        } else if (type === 'NaturalArea') {
            tableBodyId = 'areas-table-body';
        }

        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = data.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            console.log(`${type} Item:`, item); // Para depuración
            tableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description || 'No disponible'}</td>
                </tr>
            `;
        });
    };

    const renderPagination = (totalItems, paginationId, currentPage, updatePageFunction) => {
        const paginationContainer = document.getElementById(paginationId);
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationContainer.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        }

        document.querySelectorAll(`#${paginationId} .page-link`).forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const newPage = parseInt(event.target.textContent);
                updatePageFunction(newPage);
            });
        });
    };

    const updateCitiesPage = (newPage) => {
        currentPageCities = newPage;
        displayRelatedInfo(citiesData, 'City', currentPageCities);
        renderPagination(citiesData.length, 'cities-pagination', currentPageCities, updateCitiesPage);
    };

    const updateNaturalAreasPage = (newPage) => {
        currentPageNaturalAreas = newPage;
        displayRelatedInfo(naturalAreasData, 'NaturalArea', currentPageNaturalAreas);
        renderPagination(naturalAreasData.length, 'areas-pagination', currentPageNaturalAreas, updateNaturalAreasPage);
    };

    document.getElementById('showCities').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('City');
        } else {
            document.getElementById('cities-table-body').innerHTML = '';
            document.getElementById('cities-pagination').innerHTML = '';
        }
    });

    document.getElementById('showAreas').addEventListener('change', (event) => {
        if (event.target.checked) {
            fetchRelatedInfo('NaturalArea');
        } else {
            document.getElementById('areas-table-body').innerHTML = '';
            document.getElementById('areas-pagination').innerHTML = '';
        }
    });

    document.getElementById('search-bar').addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredCities = citiesData.filter(item => item.name.toLowerCase().includes(searchText));
        const filteredAreas = naturalAreasData.filter(item => item.name.toLowerCase().includes(searchText));

        displayRelatedInfo(filteredCities, 'City', 1);
        renderPagination(filteredCities.length, 'cities-pagination', 1, updateCitiesPage);

        displayRelatedInfo(filteredAreas, 'NaturalArea', 1);
        renderPagination(filteredAreas.length, 'areas-pagination', 1, updateNaturalAreasPage);
    });

    fetchDepartmentDetails();
});*/



/*document.addEventListener('DOMContentLoaded', () => {
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

});*/
