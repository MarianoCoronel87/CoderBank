function obtenerFechaArgentina() {  
    return new Date().toLocaleString("es-AR", {   
        timeZone: "America/Argentina/Buenos_Aires",  
        year: 'numeric',  
        month: '2-digit',  
        day: '2-digit',  
        hour: '2-digit',  
        minute: '2-digit',  
        second: '2-digit',  
        hour12: false  
    });  
}  
 
class CuentaBancaria {  
    constructor() {  
        this.saldo = 0;  
        this.movimientos = [];  
    }  

    depositarMonto(monto) {  
        this.saldo += monto;  
        const argentinaDate = obtenerFechaArgentina();  
        this.movimientos.push({ tipo: 'Depósito', monto: monto, fecha: argentinaDate });  
    }  

    retirarMonto(monto) {  
        if (monto <= this.saldo) {  
            this.saldo -= monto;  
            const argentinaDate = obtenerFechaArgentina();  
            this.movimientos.push({ tipo: 'Retiro', monto: monto, fecha: argentinaDate });  
            return true;  
        } else {  
            Swal.fire('Error', 'Saldo insuficiente para realizar el retiro.', 'error');  
            return false;  
        }  
    }  

    pedirPrestamo(monto) {  
        this.saldo += monto;  
        const argentinaDate = obtenerFechaArgentina();  
        this.movimientos.push({ tipo: 'Préstamo', monto: monto, fecha: argentinaDate });  
    }  
}  

class Usuario {  
    constructor(usuario, contraseña) {  
        this.usuario = usuario;  
        this.contraseña = contraseña;  
        this.cuentaBancaria = new CuentaBancaria();  
    }  
}