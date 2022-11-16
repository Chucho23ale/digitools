const db = require('../util/database');

module.exports = class Tipofalla {
    constructor(nombre){
        this.nombre = nombre;
    }
    
    save(){
        return db.execute('INSERT INTO tipodefalla(nombre) VALUES (?)',[this.nombre]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tipodefalla');
    }

    static delete(idfalla) {
        return db.execute(
            'DELETE FROM tipodefalla WHERE idfalla = ?',[idfalla]);
    }
}