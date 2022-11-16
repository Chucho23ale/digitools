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

    static fetchCrearunidad(){
        return db.execute('SELECT * FROM usuarios WHERE razonsocial IS NOT null AND razonsocial != "" AND oculto = 0');
    }

    static fetchOne(username){
        return db.execute('SELECT * FROM usuarios WHERE oculto = 0 AND usuario = ?', [username]);
    }

    static delete(username) {
        return db.execute(
            'CALL eliminarcliente(?)', [username]
        );
    }

    static getPermisos(username){
        return db.execute('SELECT p.nombre FROM privilegios p, rolesasignados ra, roles r, tieneprivilegio tp WHERE ra.usuario = ? AND ra.idrol = r.idrol AND r.idrol = tp.idrol AND tp.idprivilegio = p.idprivilegio', [username]);
    }

    static fetchTrabajadores(){
        return db.execute('SELECT ra.usuario FROM privilegios p, rolesasignados ra, roles r, tieneprivilegio tp WHERE ra.idrol = r.idrol AND r.idrol = tp.idrol AND tp.idprivilegio = p.idprivilegio AND p.nombre = "asignar"');
    }
}