// Creo una funcion en navbar para reducir codigo//
export const loadNavbar = () => {
    const navbarContainer = document.getElementById('navbar');
    navbarContainer.innerHTML=`
    <nav class="navbar navbar-expand-lg  bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand col-4 col-sm-2 col-md-1" href="./index.html">
                  <img src="./Logo  y Portada/Logo.png" alt="Bootstrap" width="200" height="100">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup"">
                  <div class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <a class="nav-link active"  href="./index.html">Home</a>
                    <a class= "nav-link" href="./Especies invasoras.html">Especies Invasoras</a>
                  </div>
                </div>
            </div>
            </nav> 
            `;
        }
  // URL de la API para obtener los departamentos
  const apiURL = 'https://api-colombia.com/api/v1/Department';
  let departments = [];
  // Función para crear una tarjeta para cada departamento
  export function createCard(department) {
      return `
          <div class="col-md-4 col-sm-6 mb-4 p-2">
              <div class="card mb-4">
                  <img src="images/departments/${department.id}.jpg" class="card-img-top" alt="${department.name}">
                  <div class="card-body">
                      <h5 class="card-title">${department.name}</h5>
                      <p class="card-text">Código: ${department.id}</p>
                      <a href="details.html?id=${department.id}" class="btn btn-primary">Detalles</a>
                  </div>
              </div>
          </div>
      `;
  };

// Función para obtener los departamentos de la API
export async function fetchDepartments(apiURL) {
    try {
        const response = await fetch(apiURL);
        const departments = await response.json();
        return departments;
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        return [];
    }
}
// Funcion para obtener las ciudades de los deprtamentos seleccionados




// Creo una funcion para footer con el mismo objetivo que navbar
export function loadFooter(){
    const Footer = `
        <ul class="nav col-12 col-md-6 justify-content-center justify-content-md-start list-unstyled d-flex mb-4">
          <li class="ms-3"><a class="text-body-secondary d-flex justify-content-center align-items-center" href="#">
              <img src="./Logo  y Portada/1.png" class="img-fluid" width="50" height="50" alt="Facebook">
            </a>
          </li>
          <li class="ms-3"><a class="text-body-secondary d-flex justify-content-center align-items-center" href="#">
              <img src="./Logo  y Portada/2.png" class="img-fluid" width="50" height="50" alt="Instagram">
          </a></li>
          <li class="ms-3"><a class="text-body-secondary d-flex justify-content-center align-items-center" href="#">
              <img src="./Logo  y Portada/3.png" class="img-fluid" width="50" height="50" alt="whatsapp">
          </a></li>
        </ul>
        <!--Contenedor del Logo y empresa-->
        <div class="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end">
          <a href="index.html" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1 d-flex justify-content-center justify-content-md-end logo-footer">
            <img src="./Logo  y Portada/Created.png" class="img-fluid" alt="Amazing Brand" width="150" height="100">
          </a>
          <span class="mb-3 mb-md-0 text-body-secondary pe-2">© 2024 Company, Inc</span>
        </div>
    `

    document.getElementById('footer').innerHTML = Footer;  
}

