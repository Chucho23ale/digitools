const db = require('../util/database');

module.exports = class Unidad {
    constructor(imei, nombre, cliente){
        this.imei = imei;
        this.nombre = nombre;
        this.cliente = cliente;
    }
    
    save(){
        return db.execute('CALL crearunidad(?, ?, ?)',[this.imei, this.nombre, this.cliente]);
    }

    static fetchOne(imei){
        return db.execute('SELECT * FROM unidades WHERE imei = ?', [imei]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM unidades WHERE oculto = 0');
    }

//   static fetchAllwC() {
//        return db.execute(
//            'SELECT U.imei, U.nombre, C.razonsocial FROM usuarios C, unidades U, tieneunidad T WHERE U.imei = T.imei AND T.usuario = C.usuario AND T.oculto = 0 UNION SELECT imei, nombre, null as razonsocial FROM unidades WHERE oculto = 0 AND imei NOT IN (SELECT U.imei FROM usuarios C, unidades U, tieneunidad T WHERE U.imei = T.imei AND T.usuario = C.usuario AND T.oculto = 0)');
//    }

    static fetchAllwC(){
        return db.execute(
            'SELECT C.razonsocial, U.imei, U.nombre FROM (SELECT * FROM unidades WHERE oculto = 0) AS U LEFT JOIN (SELECT * FROM tieneunidad WHERE oculto = 0) AS T ON U.imei = T.imei LEFT JOIN (SELECT * FROM usuarios WHERE oculto = 0) AS C ON C.usuario = T.usuario');
    }

    static fetchUser(imei){
        return db.execute(
            'SELECT C.razonsocial, U.imei, U.nombre FROM (SELECT * FROM unidades WHERE oculto = 0) AS U LEFT JOIN (SELECT * FROM tieneunidad WHERE oculto = 0) AS T ON U.imei = T.imei LEFT JOIN (SELECT * FROM usuarios WHERE oculto = 0) AS C ON C.usuario = T.usuario WHERE U.imei = ?', 
            [imei]); 
    }

    static delete(imei) {
        return db.execute(
            'CALL eliminarunidad(?)', [imei]);
    }

    static fetchC(usuario){
        return db.execute(
            'SELECT * FROM unidades u, tieneunidad t WHERE u.oculto = 0 AND u.imei = t.imei AND t.usuario = ?', 
            [usuario]);
    }

    static edit(imei, nombre){
        return db.execute(
            'UPDATE unidades SET nombre = ? WHERE imei = ?',
            [nombre, imei]);
    }

    static reasign(imei, nombre, usuario){
        return db.execute(
            'CALL reasignarunidad(?, ?, ?)',
            [imei, nombre, usuario]);
    }
}
