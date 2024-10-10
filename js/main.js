document.addEventListener("DOMContentLoaded", () => {  
    const saldoElemento = document.getElementById("saldo");  
    const depositarBoton = document.getElementById("depositarBoton");  
    const retirarBoton = document.getElementById("retirarBoton");  
    const movimientosContenedor = document.getElementById("contenedor-movimientos");  
    const prestamoBoton = document.getElementById("prestamoBoton");  
    const eyeIcon = document.getElementById("eye-icon");  
    const userJSON = localStorage.getItem('usuarioActual');  
    if (!userJSON) {  
        Swal.fire('Error', 'No has iniciado sesión.', 'error').then(() => {  
            window.location.href = "login.html";  
        });  
        return;  
    }  
    const userObj = JSON.parse(userJSON);  
    const cuenta = new CuentaBancaria();  
    cuenta.saldo = userObj.cuentaBancaria.saldo;  
    cuenta.movimientos = userObj.cuentaBancaria.movimientos; 
    const usuarioActual = new Usuario(userObj.usuario, userObj.contraseña);  
    usuarioActual.cuentaBancaria = cuenta;  
    saldoElemento.textContent = `$${usuarioActual.cuentaBancaria.saldo}`;   
    registrarMovimientoEnPantalla(usuarioActual);   
    // Event Listeners  
    depositarBoton.addEventListener("click", () => depositarSaldo(usuarioActual));  
    retirarBoton.addEventListener("click", () => retirarSaldo(usuarioActual));  
    prestamoBoton.addEventListener("click", () => pedirPrestamo(usuarioActual));  
    eyeIcon.addEventListener("click", () => ocultarSaldo(usuarioActual));  
});  

function registrarMovimientoEnPantalla(usuario) {  
    const contenedorMovimientos = document.getElementById("contenedor-movimientos");  
    contenedorMovimientos.innerHTML = '';  
    usuario.cuentaBancaria.movimientos.forEach(movimiento => {  
        const movimientoElemento = document.createElement('div');  
        movimientoElemento.innerHTML = `<strong>${movimiento.tipo}:</strong> $${movimiento.monto} <em>(${movimiento.fecha})</em>`;  
        contenedorMovimientos.appendChild(movimientoElemento);  
    });  
}  

function depositarSaldo(usuario) {  
    Swal.fire({  
        title: 'Ingrese dinero a depositar',  
        input: 'text',  
        inputLabel: 'Saldo',  
        inputPlaceholder: 'Escriba un saldo a depositar aquí',  
        showCancelButton: true,  
        confirmButtonText: 'Aceptar',  
        cancelButtonText: 'Cancelar',  
        inputValidator: (value) => {  
            if (!value) {  
                return '¡Necesitas ingresar un saldo!';  
            } else if (isNaN(value)) {  
                return '¡Eso no es un Saldo válido!';  
            } else if (parseFloat(value) <= 0) {  
                return '¡El saldo debe ser mayor que cero!';  
            }   
        }  
    }).then(result => {  
        if(result.isConfirmed){  
            const monto = parseFloat(result.value, 10);  
            usuario.cuentaBancaria.depositarMonto(monto);  
            actualizarUsuarioActual(usuario);  
            Swal.fire('Éxito', `Has depositado $${monto}`, 'success');  
        }  
    });   
}  

function retirarSaldo(usuario){  
    Swal.fire({  
        title:'Ingrese dinero a retirar',  
        input: 'text',  
        inputLabel: 'Retire aquí',  
        inputPlaceholder: 'Escriba un saldo a retirar aquí',  
        showCancelButton: true,  
        confirmButtonText: 'Aceptar',  
        cancelButtonText: 'Cancelar',  
        inputValidator: (value) => {   
            if(!value){  
                return '¡Necesitas ingresar un saldo!';   
            } else if(isNaN(value)){  
                return '¡Eso no es un Saldo válido!';  
            } else if(parseFloat(value) <= 0){  
                return '¡El saldo debe ser mayor que cero!';  
            }  
        }  
    }).then(result => {  
        if(result.isConfirmed){  
            const monto = parseFloat(result.value, 10);  
            const posible = usuario.cuentaBancaria.retirarMonto(monto);  
            if (posible) {  
                actualizarUsuarioActual(usuario);  
                Swal.fire('Éxito', `Has retirado $${monto}`, 'success');  
            }    
        }  
    });   
}  

function pedirPrestamo(usuario) {  
    Swal.fire({  
        title: 'Ingrese monto del préstamo',  
        input: 'text',  
        inputLabel: 'Monto',  
        inputPlaceholder: 'Escriba el monto del préstamo aquí',  
        showCancelButton: true,  
        confirmButtonText: 'Aceptar',  
        cancelButtonText: 'Cancelar',  
        inputValidator: (value) => {  
            if (!value) {  
                return '¡Necesitas ingresar un monto!';  
            } else if (isNaN(value)) {  
                return '¡Eso no es un monto válido!';  
            } else if (parseFloat(value) <= 0) {  
                return '¡El monto debe ser mayor que cero!';  
            }  
        }  
    }).then(result => {  
        if(result.isConfirmed){  
            const monto = parseFloat(result.value, 10);  
            usuario.cuentaBancaria.pedirPrestamo(monto);  
            actualizarUsuarioActual(usuario);  
            Swal.fire('Éxito', `Has recibido un préstamo de $${monto}`, 'success');  
        }  
    });  
}  

function ocultarSaldo(usuario) {  
    const saldoDiv = document.getElementById("saldo");  
    const eyeIcon = document.getElementById("eye-icon");  
    if (saldoDiv.innerText[0] !== '*') {   
        eyeIcon.classList.remove("bi-eye");  
        eyeIcon.classList.add("bi-eye-slash");  
        saldoDiv.dataset.realValue = saldoDiv.innerText;  
        saldoDiv.textContent = '*****';  
    } else {   
        eyeIcon.classList.remove("bi-eye-slash");  
        eyeIcon.classList.add("bi-eye");  
        saldoDiv.innerText = saldoDiv.dataset.realValue;  
    }  
}  
function actualizarUsuarioActual(usuario) {  
    const saldoElemento = document.getElementById("saldo");  
    saldoElemento.textContent = `$${usuario.cuentaBancaria.saldo}`;  
    registrarMovimientoEnPantalla(usuario);  
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));  
    localStorage.setItem(usuario.usuario, JSON.stringify(usuario));  
}
document.addEventListener("DOMContentLoaded", () => {  
    const saldoElemento = document.getElementById("saldo");  
    const depositarBoton = document.getElementById("depositarBoton");  
    const retirarBoton = document.getElementById("retirarBoton");  
    const movimientosContenedor = document.getElementById("contenedor-movimientos");  
    const prestamoBoton = document.getElementById("prestamoBoton");  
    const eyeIcon = document.getElementById("eye-icon");  
    const userJSON = localStorage.getItem('usuarioActual');  
  
    if (!userJSON) {  
      Swal.fire('Error', 'No has iniciado sesión.', 'error').then(() => {  
        window.location.href = "../login.html";  
      });  
      return;  
    }  
  
    const userObj = JSON.parse(userJSON);  
    const cuenta = new CuentaBancaria();  
    cuenta.saldo = userObj.cuentaBancaria.saldo;  
    cuenta.movimientos = userObj.cuentaBancaria.movimientos;  
    const usuarioActual = new Usuario(userObj.usuario, userObj.contraseña);  
    usuarioActual.cuentaBancaria = cuenta;  
    saldoElemento.textContent = `$${usuarioActual.cuentaBancaria.saldo}`;  
  
    registrarMovimientoEnPantalla(usuarioActual);  
    obtenerCotizacionesDolarBlue();
    // Event Listeners  
    depositarBoton.addEventListener("click", () => depositarSaldo(usuarioActual));  
    retirarBoton.addEventListener("click", () => retirarSaldo(usuarioActual));  
    prestamoBoton.addEventListener("click", () => pedirPrestamo(usuarioActual));  
    eyeIcon.addEventListener("click", () => ocultarSaldo(usuarioActual));  
  });  
  function obtenerCotizacionesDolarBlue() {  
  
    const url = "https://dolarapi.com/v1/dolares/blue";  
  
    fetch(url)  
      .then(response => {  
        if (!response.ok) {  
          throw new Error('Error en la respuesta de la API');  
        }  
        return response.json();  
      })  
      .then(data => {  
        const compra = data.compra;  
        const venta = data.venta;  
        document.getElementById('compraBlue').textContent = `$${compra}`;  
        document.getElementById('ventaBlue').textContent = `$${venta}`;  
      })  
      .catch(error => {  
        console.error(error);  
        Swal.fire({  
          title: 'Algo salió mal...',  
          html: '<p class="swaltext">Error al cargar los datos</p>',  
          icon: 'error',  
          showConfirmButton: true,  
          confirmButtonText: 'Ok',  
          confirmButtonColor: '#273746',  
          timer: 5000,  
          timerProgressBar: true,  
          allowOutsideClick: false,  
          allowEscapeKey: true,  
          allowEnterKey: true,   
          background: '#fff',  
          customClass: {  
            title: 'swaltitle',  
          }  
        });  
      });  
  }
  function formatearNumero(numero) {  
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);  
  }  
  document.getElementById('compraBlue').textContent = `${formatearNumero(compra)}`;  
  document.getElementById('ventaBlue').textContent = `${formatearNumero(venta)}`;    