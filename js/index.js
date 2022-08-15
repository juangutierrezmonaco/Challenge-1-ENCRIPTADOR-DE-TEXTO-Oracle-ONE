/* Función que recibe y valida que el texto ingresado sean sólo letras minúsculas */
function textoEsValido (texto) {
    return (/^[a-z\s]*$/.test(texto));
}

/* Retorna el texto encriptado */
function encriptar (texto) {
    let textoEncriptado = texto.split("");
    textoEncriptado.forEach( (element, index, array) => {
        switch (element) {
            case 'a':
                array[index] = "ai";
                break;
            case 'e':
                array[index] = "enter";
                break;
            case 'i':
                array[index] = "imes";
                break;
            case 'o':
                array[index] = "ober";
                break;
            case 'u':
                array[index] = "ufat";
                break;
        }
    });

    return textoEncriptado.join("");
}

/* Retorna el texto desencriptado */
function desencriptar (texto) {
    return texto.replaceAll("ai", "a")
                .replaceAll("enter", "e")
                .replaceAll("imes", "i")
                .replaceAll("ober", "o")
                .replaceAll("ufat", "u");
}

/* Cambia los carteles en el DOM sobre el resultado */
function cambiarCartelesResultado (textoProcesado = "") {
    let contenedorResultado = document.querySelector(".contenedorResultado");
    let contenedorResultadoVacio = document.querySelector(".contenedorResultadoVacio");

    if (textoProcesado == ""){  // Si no se pasa parámetro es porque se quiere volver al cartel vacío
        contenedorResultado.querySelector(".cartelIngresoResultado").innerText = "";
        contenedorResultado.style.display = "none";
        contenedorResultadoVacio.style.display = "flex";
    } else {    // Sino, estoy encriptando o desencriptando algo
        contenedorResultadoVacio.style.display = "none";
        contenedorResultado.querySelector(".cartelIngresoResultado").innerText = textoProcesado;
        contenedorResultado.style.display = "flex";
    }
}

let formTextoIngresado = document.querySelector(".contenedorIngreso");
formTextoIngresado.addEventListener("submit", (e) => {
    e.preventDefault(); 

    let form = e.target;
    let texto = form.querySelector("#textToTranslate");
    let reglas = form.querySelector(".contenedorIngresoTexto");
    let botonId = e.submitter.id;

    if (botonId == "botonReinicio") {
        // Vacío el textarea y vuelvo a la imagen de que no se ingresó ningún texto
        texto.value = "";
        cambiarCartelesResultado();

    } else {
        if (!textoEsValido(texto.value) || texto.value.length == 0) {  // Si el texto es inválido
            reglas.style.color = "red";
            reglas.classList.add("shake-horizontal");
    
            reglas.addEventListener("animationend", () => {
                reglas.classList.remove("shake-horizontal");
                reglas.style.color = "#495057";
            });
        } else {
            let textoProcesado;
            
            switch (botonId) {
                case "botonEncriptar":
                    textoProcesado = encriptar(texto.value);
                    break;
                case "botonDesencriptar":
                    textoProcesado = desencriptar(texto.value);
                    break;
            }

            cambiarCartelesResultado(textoProcesado);            
        }
    }
});

let textArea = document.querySelector("#textToTranslate");
textArea.addEventListener("input", (e) => {
    if (e.target.value.length == 0) {
        cambiarCartelesResultado();
    }
})

function mostrarAlerta(texto, icono = "success") {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
    });
      
    Toast.fire({
        icon: `${icono}`,
        title: `${texto}`
    });
}

/* Copiar resultado */
let contenedorResultado = document.querySelector(".contenedorResultado");
contenedorResultado.addEventListener("submit", (e) => {
    e.preventDefault();

    let texto = e.target.querySelector(".cartelIngresoResultado").value;
    
    navigator.clipboard.writeText(texto)
        .then( (res) => {
            mostrarAlerta('Copiado correctamente!')
        })
        .catch( (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    
});

/* Pegar texto para traducir */
let botonPegar = document.querySelector("#botonPegar");
botonPegar.addEventListener("click", (e) => {
    e.preventDefault();

    let seccionPegado = document.querySelector("#textToTranslate");
    
    navigator.clipboard.readText()
        .then( (texto) => {
            seccionPegado.value = texto;
        })
        .catch( (err) => {
            console.error('Async: Could not paste text: ', err);
            mostrarAlerta("Hubo un error y no se pudo pegar!", "error");
        });
    
});