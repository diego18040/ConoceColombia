import { loadNavbar, createCard, fetchDepartments, loadFooter } from './index.js'; //importa los comados repetidos como navbar y footer//

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
    loadFooter();

    const colombiaApiURL = 'https://api-colombia.com/api/v1/Country/Colombia'; // Nuestras apis//
    const departmentsApiURL = 'https://api-colombia.com/api/v1/Department';
    let departments = []; // Imagenes en las cards por pc deben ser el mismo formato .jpg
    const itemsPerPage = 9; // Cuantos cards va mostrar por paginas
    let currentPage = 1;   // Conteo inicinado en 1

    const displayColombiaInfo = async () => {
        try {
            const response = await fetch(colombiaApiURL);
            const colombiaInfo = await response.json();
            
            const colombiaContainer = document.getElementById('colombia-info');
            colombiaContainer.innerHTML = `
                <div class="jumbotron">
                    <h2>${colombiaInfo.name}</h2>
                    <p><strong>Capital:</strong> ${colombiaInfo.stateCapital}</p>
                    <p><strong>Población:</strong> ${colombiaInfo.population}</p>
                    <p><strong>Área:</strong> ${colombiaInfo.surface} km²</p>
                    <p><strong>Continente:</strong> ${colombiaInfo.region}</p>
                    <p><strong>Moneda:</strong> ${colombiaInfo.currency}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error al obtener la información de Colombia:', error);
        }
    };
 // Llama con fetch la api y ordena por codigo 1,2....33
    const fetchAndDisplayDepartments = async () => {
        try {
            const fetchedDepartments = await fetchDepartments(departmentsApiURL);
            departments = fetchedDepartments.sort((a, b) => a.id - b.id);
            displayDepartments(departments);
            createFilterCheckboxes(departments);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };
    const displayDepartments = (departmentsToDisplay) => {
        const cardsContainer = document.getElementById('department-cards');
        cardsContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = departmentsToDisplay.slice(startIndex, endIndex);
        pageItems.forEach(department => {
            cardsContainer.innerHTML += createCard(department);
        });
        renderPagination();
    };

    const createFilterCheckboxes = (departments) => {
        const filterContainer = document.getElementById('filter-checkboxes');
        const departmentNames = [...new Set(departments.map(dept => dept.name.charAt(0).toUpperCase()))];

        departmentNames.forEach(name => {
            filterContainer.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${name}" id="filter-${name}">
                    <label class="form-check-label" for="filter-${name}">
                        ${name}
                    </label>
                </div>
            `;
        });

        document.querySelectorAll('#filter-checkboxes input').forEach(checkbox => {
            checkbox.addEventListener('change', filterDepartments);
        });
    };

        // Función para mostrar los departamentos en la página
        const renderDepartments = () => {
            const cardsContainer = document.getElementById('department-cards');
            cardsContainer.innerHTML = '';
        
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageItems = departments.slice(startIndex, endIndex);
        
            pageItems.forEach(department => {
                cardsContainer.innerHTML += createCard(department);
            });
            renderPagination();
        };
    // Función para manejar la paginación
    const renderPagination = () => {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(departments.length / itemsPerPage);

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
            renderDepartments();
        });
    });
};
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

    // Llama a la función para mostrar la información de Colombia
    displayColombiaInfo();

    // Llama a la función para obtener y mostrar los departamentos
    fetchAndDisplayDepartments();
});
