const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario {
    constructor(usuario, contraseña, rfc, razonsocial, telefono){
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.rfc = rfc;
        this.razonsocial = razonsocial;
        this.telefono = telefono ? telefono : null;
    }
    //(usuario, contraseña, rfc, razonsocial, telefono)
    save(idrol){
        return bcrypt.hash(this.contraseña, 12)
        .then((password)=>{
            if(idrol == 3){
                return db.execute('CALL agregarcliente(?, ?, ?, ?, ?)', [this.usuario, password, this.rfc, this.razonsocial, this.telefono]);
            }else {
                return db.execute('CALL agregarusuario(?, ?, ?)', [this.usuario, password, idrol]);
            }
        });
    }

    static fetchAll(){
        return db.execute('SELECT * FROM usuarios WHERE oculto = 0');
    }

    static fetchClientes(){
        return db.execute('SELECT * FROM usuarios WHERE razonsocial IS NOT null AND razonsocial != "" AND oculto = 0');
    }

    static fetchEmpleados(){
        return db.execute('SELECT RA.usuario, R.nombre FROM rolesasignados RA JOIN roles R WHERE RA.idrol = R.idrol AND R.idrol != 3 AND RA.oculto = 0');
    }

    static fetchTrabajadores(){
        return db.execute('SELECT RA.usuario, R.nombre FROM rolesasignados RA JOIN roles R WHERE RA.idrol = R.idrol AND R.idrol = 2 AND RA.oculto = 0');
    }

    static fetchRol(){
        return db.execute('SELECT * FROM roles WHERE idrol != 3');
    }

    static fetchOne(username){
        return db.execute('SELECT * FROM usuarios WHERE oculto = 0 AND usuario = ?', [username]);
    }

    static deleteCliente(username) {
        return db.execute(
            'CALL eliminarcliente(?)', [username]
        );
    }

    static deleteEmpleado(username) {
        return db.execute(
            'CALL eliminarempleado(?)', [username]
        );
    }

    static getPermisos(username){
        return db.execute('SELECT p.nombre FROM privilegios p, rolesasignados ra, roles r, tieneprivilegio tp WHERE ra.usuario = ? AND ra.idrol = r.idrol AND r.idrol = tp.idrol AND tp.idprivilegio = p.idprivilegio', [username]);
    }

    static edit(rfc, razonsocial, telefono, usuario){
        return db.execute('UPDATE usuarios SET rfc = ?, razonsocial = ?, telefono = ? WHERE usuario = ?',
        [rfc, razonsocial, telefono, usuario]);
    }
}