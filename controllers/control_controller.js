const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js'); 
const Tipofalla = require('../models/tipofalla.model');
const Ticket = require('../models/ticket.model');
const path = require('path');
const moment = require('moment');
moment.locale('es-mx');

exports.get_root = (request,response,next) => {

    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchCrearunidad().then(([clientes, fieldData])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                Ticket.tiempoabierto().then(([tickets_abiertos, fieldData]) => {
                    Ticket.promedioencerrar().then(([promedio, fieldData]) => {
                        for (let ticket of tickets_abiertos){
                            ticket.fechainicio = moment(ticket.fechainicio).fromNow();
                        }
                        response.render(path.join('control','tablero.ejs'),{
                            clientes: clientes,
                            unidades: unidades,
                            tipofallas: tipofallas,
                            permisos: request.session.permisos,
                            tickets_abiertos: tickets_abiertos,
                            promedio: promedio[0],
                        });
                    }).catch((error)=>{console.log(error);});
                }).catch((error)=>{console.log(error);});
            }).catch((error)=>{console.log(error);});
        }).catch((error)=>{console.log(error);});
    }).catch((error)=>{console.log(error);});
}

exports.get_porcentajesecobra = (request, response, next) => {
    Ticket.porcentajesecobra().then(([porcentaje, fieldData]) => {
        response.status(200).json(porcentaje[0]);
    }).catch( (error) => {console.log(error);});
}

exports.get_fallascomunes = (request,response,next) => {
    Ticket.fallas().then(([fallas, fieldData])=>{
        Ticket.numfallas().then(([numfallas, fieldData]) =>{
            let nombres = new Array();
            let numeros = new Array();
            for (let falla of fallas){
                nombres.push(falla.nombre);
            }
            for (let num of numfallas){
                numeros.push(num.tickets);
            }
            console.log(nombres)
            console.log(numeros)
            response.status(200).json([{f: nombres, nf: numeros}]);
        }).catch( (error) => {console.log(error);});
    }).catch( (error) => {console.log(error);});
}