document.addEventListener("DOMContentLoaded", () => {  
    const usernameInput = document.getElementById("usuario");  
    const passwordInput = document.getElementById("contraseña");  
    const registerButton = document.getElementById("register-button");  
    const loginButton = document.getElementById("login-button");  

    registerButton.addEventListener("click", generarUsuario);  
    loginButton.addEventListener("click", loginUser);  
});  

let usuarioActual = null; 

function generarUsuario() {  
    const username = document.getElementById("usuario").value.trim();  
    const password = document.getElementById("contraseña").value.trim();  

    if (!username || !password) {  
        Swal.fire('Error', 'Por favor ingresa un nombre de usuario y una contraseña.', 'error');  
        return;  
    }  

    const localS = localStorage.getItem(username);  
    if (localS) {  
        Swal.fire('Error', 'Ya hay un usuario registrado con este nombre.', 'error');  
    } else {  
        const nuevoUsuario = new Usuario(username, password);  
        localStorage.setItem(username, JSON.stringify(nuevoUsuario));  
        Swal.fire('Éxito', 'Registro exitoso! Ahora puedes iniciar sesión.', 'success');  
    }  
}  

function loginUser(event) {  
    event.preventDefault();  
    const username = document.getElementById("usuario").value.trim();  
    const password = document.getElementById("contraseña").value.trim();  
    const userJSON = localStorage.getItem(username);  
    if (userJSON) {  
        const userObj = JSON.parse(userJSON);  
        if (userObj.contraseña === password) {   
            const cuenta = new CuentaBancaria();  
            cuenta.saldo = userObj.cuentaBancaria.saldo;  
            cuenta.movimientos = userObj.cuentaBancaria.movimientos;
            const user = new Usuario(userObj.usuario, userObj.contraseña);  
            user.cuentaBancaria = cuenta;  
            usuarioActual = user;  
            localStorage.setItem('usuarioActual', JSON.stringify(user));  
            window.location.href = "pages/index.html";   
        } else {  
            Swal.fire('Error', 'Contraseña incorrecta.', 'error');  
        }  
    } else {  
        Swal.fire('Error', 'Usuario no encontrado.', 'error');  
    }  
}