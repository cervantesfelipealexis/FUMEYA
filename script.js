//_________________________________________________________-
//_______NO TOCAR; CARRUSEL FUNCIONANDO____________________-
//_________________________________________________________-
let slideIndex = 1;
showSlides(slideIndex);


function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("carrusel-slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

//__________________________________________________________-
//_______tocar si la paginación no sirve____________________-
//__________________________________________________________-
// ===============================================
// 2. LÓGICA DE PAGINACIÓN DE BASE DE DATOS (CSV)
// ===============================================

let allData = []; // Aquí se almacenarán todos los registros del CSV
const rowsPerPage = 20;
let currentPage = 1;

// Referencias a los elementos del DOM
let tableBody;
let prevButton;
let nextButton;
let pageSpan;
let dynamicDataPath = null; 

// -----------------------------------------------
//  FUNCIONES CLAVE QUE FALTAN O DEBEN ESTAR INCLUIDAS
// -----------------------------------------------

// FUNCIÓN PARA MOSTRAR LOS DATOS DE LA PÁGINA ACTUAL
function displayTable(data, wrapper) {
    wrapper.innerHTML = ''; 

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
        `;
        wrapper.appendChild(tr);
    });
}

// FUNCIÓN PARA ACTUALIZAR EL ESTADO DE LA PAGINACIÓN Y BOTONES
function setupPagination() {
    const pageCount = Math.ceil(allData.length / rowsPerPage);
    
    pageSpan.textContent = `Página ${currentPage} de ${pageCount}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === pageCount || allData.length === 0;
    
    if (allData.length === 0) {
        prevButton.disabled = true;
        nextButton.disabled = true;
        pageSpan.textContent = 'No hay datos disponibles.';
        if (tableBody) {
             tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error o datos vacíos.</td></tr>';
        }
    }
}

// FUNCIÓN PARA IR A LA PÁGINA SIGUIENTE
function goToNextPage() {
    const pageCount = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < pageCount) {
        currentPage++;
        displayTable(allData, tableBody);
        setupPagination();
    }
}
// FUNCIÓN PARA IR A LA PÁGINA ANTERIOR
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(allData, tableBody);
        setupPagination();
    }
}
// -----------------------------------------------
//  FIN DE FUNCIONES CLAVE
// -----------------------------------------------

// Función principal de Carga de Datos (Tu código actual - sin cambios)
function loadData() {
    if (!dynamicDataPath) {
        console.error("Ruta del archivo CSV no encontrada en el HTML.");
        setupPagination(); 
        return; 
    }

    Papa.parse(dynamicDataPath, {
        download: true, 
        header: false, 
        skipEmptyLines: true,
        complete: function(results) {
            results.data.shift(); 
            
            allData = results.data;
            displayTable(allData, tableBody);
            setupPagination();
            
            console.log(`Datos cargados desde: ${dynamicDataPath}. Total: ${allData.length}`);
        },
        error: function(error) {
            console.error(`Error al cargar el archivo ${dynamicDataPath}:`, error);
            allData = []; 
            setupPagination();
        }
    });
}

// Inicialización Global (Tu código actual - sin cambios)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener la referencia al contenedor principal y extraer la ruta
    const detailsSection = document.querySelector('.field-details-section');
    if (detailsSection) {
        dynamicDataPath = detailsSection.getAttribute('data-csv-path');
    }
    
    //  Inicializar referencias DOM
    tableBody = document.getElementById('data-table-body');
    prevButton = document.getElementById('prev-btn');
    nextButton = document.getElementById('next-btn');
    pageSpan = document.getElementById('page-status');

    // 3. Inicializar eventos (Carrusel y Paginación)
    if (tableBody && prevButton && nextButton && pageSpan) {
        prevButton.addEventListener('click', goToPrevPage);
        nextButton.addEventListener('click', goToNextPage);
        
        loadData(); // Llama a la carga con la ruta dinámica
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const feedContainer = document.getElementById("teaching-feed");

    if (feedContainer) {
        fetch("enseñanza.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const card = `
                        <div class="activity-card">
                            <img src="${item.imagen}" alt="${item.titulo}">
                            <div class="card-content">
                                <span class="date" style="color: #D4AF37; font-weight: bold;">[ ${item.categoria} ] - ${item.fecha}</span>
                                <h3>${item.titulo}</h3>
                                <p class="description">${item.descripcion}</p>
                                <a href="${item.link}" class="read-more">Ver detalles</a>
                            </div>
                        </div>
                    `;
                    feedContainer.innerHTML += card;
                });
            })
            .catch(error => console.error("Error cargando el feed:", error));
    }
});
