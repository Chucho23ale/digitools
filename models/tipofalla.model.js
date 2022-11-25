const db = require('../util/database');

module.exports = class Tipofalla {
    constructor(nombre){
        this.nombre = nombre;
    }
    
    save(){
        return db.execute('INSERT INTO tipodefalla(nombre) VALUES (?)',[this.nombre]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tipodefalla WHERE oculto = 0');
    }

    static delete(idfalla) {
        return db.execute(
            'UPDATE tipodefalla SET oculto = 1 WHERE idfalla = ?',[idfalla]);
    }
}