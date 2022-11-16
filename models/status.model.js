const status = [];

module.exports = class Status {
    constructor(idstatus, nombre){
        this.idstatus = idstatus;
        this.nombre = nombre;

    }
    
    save(){
        status.push(this);
    }

    static fetchAll(){
        return status;

    }

}