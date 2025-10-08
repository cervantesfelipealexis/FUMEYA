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

// 1. FUNCIÓN PARA MOSTRAR LOS DATOS DE LA PÁGINA ACTUAL
function displayTable(data, wrapper) {
    wrapper.innerHTML = ''; 

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        
        // ¡IMPORTANTE! Asegúrate de que los índices (0 a 5) coincidan con el orden de las columnas de tu CSV.
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

// 2. FUNCIÓN PARA ACTUALIZAR EL ESTADO DE LA PAGINACIÓN Y BOTONES
function setupPagination() {
    const pageCount = Math.ceil(allData.length / rowsPerPage);
    
    pageSpan.textContent = `Página ${currentPage} de ${pageCount}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === pageCount || allData.length === 0;
    
    if (allData.length === 0) {
        prevButton.disabled = true;
        nextButton.disabled = true;
        pageSpan.textContent = 'No hay datos disponibles.';
        // Mostrar mensaje en la tabla si falla la carga
        if (tableBody) {
             tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error o datos vacíos.</td></tr>';
        }
    }
}

// 3. FUNCIÓN PARA IR A LA PÁGINA SIGUIENTE
function goToNextPage() {
    const pageCount = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < pageCount) {
        currentPage++;
        displayTable(allData, tableBody);
        setupPagination();
    }
}

// 4. FUNCIÓN PARA IR A LA PÁGINA ANTERIOR
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
    // ⚠️ Usamos la ruta dinámica que obtuvimos en DOMContentLoaded
    if (!dynamicDataPath) {
        console.error("Ruta del archivo CSV no encontrada en el HTML.");
        setupPagination(); // Llama a setup para mostrar el mensaje de error si no hay ruta
        return; 
    }

    Papa.parse(dynamicDataPath, {
        download: true, 
        header: false, 
        skipEmptyLines: true,
        complete: function(results) {
            // Eliminar la primera fila si contiene los encabezados
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
    
    // 2. Inicializar referencias DOM
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