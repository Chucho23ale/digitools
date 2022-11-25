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
        return db.execute('Select T.idstatus AS idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND TU.oculto = 0 ORDER BY idticket');
    }

    static fetchSA(){
        return db.execute('Select T.idstatus AS idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND TU.oculto = 0 AND T.usuarioTrabajador is null ORDER BY idticket');
    }

    static fetchA(username){
        return db.execute('Select T.idstatus, idticket, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND TU.oculto = 0 AND (T.usuarioTrabajador = ? OR T.usuarioCliente = ?) ORDER BY idticket', [username, username]);
    }

    static fetchOne(id){
        return db.execute('Select T.idstatus, idticket, T.fechainicio, razonsocial, N.nombre AS unidad, S.nombre, descripcion, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND TU.oculto = 0 AND T.idstatus = S.idstatus AND idticket = ?', [id]);
    }

    static fetchTrabajos(id){
        return db.execute('Select * FROM trabajo WHERE idticket = ?', [id]);
    }

    static find(valor_busqueda){
        return db.execute('SELECT idticket, T.idstatus AS idstatus, razonsocial, N.nombre AS unidad, S.nombre, costo FROM ticket T, usuarios U, unidades N, tieneunidad TU, status S WHERE T.usuarioCliente = U.usuario AND T.imei = TU.imei AND TU.imei = N.imei AND T.idstatus = S.idstatus AND TU.oculto = 0 AND(idticket LIKE ? OR razonsocial LIKE ? OR N.nombre LIKE ? OR S.nombre LIKE ?) ORDER BY idticket', ['%'+valor_busqueda+'%', '%'+valor_busqueda+'%', '%'+valor_busqueda+'%', '%'+valor_busqueda+'%']);
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
        return db.execute('SELECT COUNT(t.idtipodefalla) AS tickets FROM tipodefalla f LEFT JOIN ticket t ON t.idtipodefalla = f.idfalla GROUP BY f.idfalla');
    }

    static fallas(){
        return db.execute('SELECT nombre FROM tipodefalla');
    }

    static deudores(){
        return db.execute('SELECT t.usuarioCliente, SUM(tr.costo) AS deuda FROM ticket t, trabajo tr WHERE t.idticket = tr.idticket GROUP BY t.usuarioCliente ORDER By deuda DESC');
    }

    static tiempoencerrarfalla(){
        return db.execute('SELECT tf.nombre AS falla, SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(t.fechafin, t.fechainicio)))) AS tiempoabierto FROM ticket t, tipodefalla tf WHERE idstatus = 3 AND t.idtipodefalla=tf.idfalla GROUP BY falla');
    }
    
    static fetchEdit(id){
        return db.execute('SELECT descripcion FROM `ticket` WHERE idticket = ?',[id]);
    }

    static edit(desc,id){
        return db.execute('UPDATE ticket SET descripcion = ? WHERE idticket = ?',[desc, id]);
    }

    static tiempoencerrarempleado(){
        return db.execute('SELECT t.usuarioTrabajador AS usuario, SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(t.fechafin, t.fechainicio)))) AS tiempoabierto FROM ticket t WHERE idstatus = 3  GROUP BY usuarioTrabajador');
    }

    static img(name, id){
        return db.execute('INSERT INTO imagenes VALUES(?, ?)',[name, id]);
    }

    static fetchimg(id){
        return db.execute('SELECT * FROM imagenes WHERE idticket = ?',[id]);
    }

    static facturas(año, mes){
        return db.execute('SELECT t.usuarioCliente, SUM(tr.costo) AS Factura, t.pagado FROM ticket t, trabajo tr WHERE t.idstatus = 3 AND t.idticket = tr.idticket AND YEAR(DATE(fechafin)) = ? AND MONTH(Date(fechafin)) = ? GROUP BY t.usuarioCliente', [año, mes]);
    }

    static fetchyears(){
        return db.execute('SELECT YEAR(DATE(fechafin)) AS ano FROM ticket GROUP BY ano ORDER BY ano DESC');
    }

    static fetchmonths(año){
        return db.execute('SELECT MONTH(DATE(fechafin)) AS mes FROM ticket WHERE YEAR(DATE(fechafin)) = ? GROUP BY mes ORDER BY mes DESC',[año]);
    }

    static pagar(año, mes, cliente){
        return db.execute('UPDATE ticket SET pagado = 1 WHERE idstatus = 3  AND YEAR(DATE(fechafin)) = ? AND MONTH(Date(fechafin)) = ?  AND usuarioCliente = ?', [año, mes, cliente]);
    }
}