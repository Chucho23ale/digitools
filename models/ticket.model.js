const db = require('../util/database');
module.exports = class Ticket {
    constructor(usuarioT, usuarioC, imei, idfalla, descripcion, idstatus, fechahora, secobra, costo){
        this.usuarioT = usuarioT;
        this.usuarioC = usuarioC;
        this.imei = imei;
        this.idfalla = idfalla;
        this.descripcion = descripcion;
        this.idstatus = idstatus;
        this.fechahora = fechahora;
        this.secobra = secobra;
        this.costo = costo;
    }
    
    save(){
        return db.execute('INSERT INTO ticket(usuarioCliente, imei, idtipodefalla, descripcion) VALUES (?, ?, ?, ?)',[this.usuarioC, this.imei, this.idfalla, this.descripcion]);
    }

    static fetchAll(){
        return db.execute('Select T.idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus ORDER BY idticket');
    }

    static fetchSA(){
        return db.execute('Select T.idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND T.usuarioTrabajador is null ORDER BY idticket');
    }

    static fetchA(username){
        return db.execute('Select T.idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND T.usuarioTrabajador = ? ORDER BY idticket', [username]);
    }

    static fetchOne(id){
        return db.execute('Select T.idstatus, idticket, T.fechainicio, razonsocial, N.nombre AS unidad, S.nombre, descripcion, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND idticket = ?', [id]);
    }

    static fetchTrabajos(id){
        return db.execute('Select * FROM trabajo WHERE idticket = ?', [id]);
    }

    static find(valor_busqueda){
        return db.execute('SELECT idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND(idticket LIKE ? OR razonsocial LIKE ? OR N.nombre LIKE ?) ORDER BY idticket', ['%'+valor_busqueda+'%', '%'+valor_busqueda+'%', '%'+valor_busqueda+'%']);
    }

    static asignar(id, usuarioTrabajador){
        return db.execute('UPDATE ticket SET ticket.usuarioTrabajador = ? WHERE idticket = ?', [usuarioTrabajador, id]);
    }

    static cerrar(id){
        return db.execute('CALL cerrar(?)',[id]);
    }

    static abrir(id){
        return db.execute('UPDATE ticket SET idstatus = 2 WHERE idticket = ?',[id]);
    }

    static tiempoabierto(){
        return db.execute('Select idticket, fechainicio, usuarioTrabajador FROM ticket  WHERE idstatus != 3 ORDER BY fechainicio ASC LIMIT 5')
    }

    static promedioencerrar(){
        return db.execute('SELECT SEC_TO_TIME(AVG(TIME_TO_SEC(tiempoabierto))) AS promedio FROM (SELECT fechainicio, fechafin, (TIMEDIFF(fechafin, fechainicio)) AS tiempoabierto FROM ticket WHERE idstatus = 3) AS tiempo');
    }

    static porcentajesecobra(){
        return db.execute('SELECT round((SELECT COUNT(usuarioCliente) FROM ticket WHERE costo != 0)/(SELECT COUNT(usuarioCliente) FROM ticket)*100,2) AS porcentaje FROM ticket LIMIT 1');
    }

    static numfallas(){
        return db.execute('SELECT COUNT(idfalla) AS tickets FROM ticket t, tipodefalla f WHERE t.idtipodefalla = f.idfalla GROUP BY idfalla');
    }

    static fallas(){
        return db.execute('SELECT nombre FROM tipodefalla');
    }
}