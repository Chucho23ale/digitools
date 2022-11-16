const db = require('../util/database');

module.exports = class Trabajo{

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_idTicket, mi_costo, mi_descripcion) {
        this.idTicket = mi_idTicket;
        this.costo = mi_costo ? mi_costo : 0;
        this.descripcion = mi_descripcion ? mi_descripcion : "sin asunto";
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            'CALL agregartrabajo(?, ?, ?)', 
            [this.idTicket, this.costo, this.descripcion]);
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM trabajo');
    }

    static delete(id) {
        return db.execute(
            'CALL eliminartrabajo(?)',
            [id]);
    }
}