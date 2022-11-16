const express = require('express');
const path = require('path');
const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js'); 
const Ticket = require('../models/ticket.model.js'); 
const Tipofalla = require('../models/tipofalla.model');
const Trabajo = require('../models/trabajo.model.js');
const moment = require('moment'); // require
const { response } = require('express');
moment.locale('es-mx');

exports.get_one = (request, response, next) => {
    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchCrearunidad().then(([clientes, fieldData2])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                Ticket.fetchOne(request.params.id).then(([ticket, fieldData3])=>{
                    Ticket.fetchTrabajos(request.params.id).then(([trabajos, fieldData])=>{
                        Cliente.fetchTrabajadores().then(([trabajadores, fieldData3])=>{
                            ticket[0].fechainicio = moment(ticket[0].fechainicio).format('l');
                            for (let trabajo of trabajos){
                                trabajo.fecha = moment(trabajo.fecha).format('ll');
                            }
                            response.render(path.join('incidencias','incidencia.ejs'),{
                                unidades: unidades,
                                clientes: clientes,
                                ticket: ticket[0],
                                tipofallas: tipofallas,
                                trabajos: trabajos,
                                permisos: request.session.permisos,
                                trabajadores: trabajadores,
                            });
                        }).catch((err)=>{
                            console.log(err);
                        }); 
                    }).catch((err)=>{
                        console.log(err);
                    });    
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
};

exports.get_root = (request, response, next) => {

    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchCrearunidad().then(([clientes, fieldData2])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                Ticket.fetchSA().then(([tickets_sa, fieldData3])=>{
                    Cliente.fetchTrabajadores().then(([trabajadores, fieldData3])=>{
                        if (request.session.permisos.indexOf('ver_todos') == -1){
                            Ticket.fetchA(request.session.username).then(([tickets_a, fieldData3])=>{
                                response.render(path.join('incidencias','tabla.ejs'),{
                                    unidades: unidades,
                                    clientes: clientes,
                                    tickets_sa: tickets_sa,
                                    tipofallas: tipofallas,
                                    tickets_a: tickets_a,
                                    permisos: request.session.permisos,
                                    trabajadores: trabajadores,
                                });
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }else{
                            Ticket.fetchAll(request.session.username).then(([tickets_a, fieldData3])=>{
                                response.render(path.join('incidencias','tabla.ejs'),{
                                    unidades: unidades,
                                    clientes: clientes,
                                    tickets_sa: tickets_sa,
                                    tipofallas: tipofallas,
                                    tickets_a: tickets_a,
                                    permisos: request.session.permisos,
                                    trabajadores: trabajadores,
                                });
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }
                    }).catch((error)=>{
                        console.log(error);
                    });
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
};

exports.post_new = (request, response, next) => {
    const ticket = new Ticket(null, request.body.cliente, request.body.unidad, request.body.falla, request.body.descripcion);
    ticket.save().then(()=>{
        response.redirect('/incidencias');
    }).catch(err => {
        console.log(err);
    })
};

exports.post_trabajo = (request, response, next) => {
    const miTrabajo = new Trabajo(request.body.idticket, request.body.costo, request.body.descripcion);
    miTrabajo.save();
    response.redirect(request.body.idticket);
};

exports.get_delete = (request, response, next) => {
    Trabajo.delete(request.params.idtrabajo)
        .then( ([rows, fieldData]) => {
                response.redirect('./')
            })
        .catch( (error) => {
            console.log(error);
    });
}
exports.get_buscar = (request, response, next) => {
    Ticket.find(request.body.valor_busqueda)
        .then( ([tickets, fieldData]) => {
            response.status(200).json(tickets);
        }).catch( (error) => {
            console.log(error);
        });
};

exports.post_asignar = (request,response,next) => {
    Ticket.asignar(request.body.idticket, request.body.usuarioTrabajador)
    .then( ([rows, fieldData]) => {
        Ticket.fetchSA().then( ([tickets_sa, fieldData]) => {
            Cliente.fetchTrabajadores().then(([trabajadores, fieldData3])=>{
                response.status(200).json({tsa: tickets_sa, t: trabajadores});
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }).catch( (error) => {
        console.log(error);
    });
}

exports.post_reasignar = (request,response,next) => {
    Ticket.asignar(request.body.id, request.body.usuarioTrabajador)
    .then( ([rows, fieldData]) => {
        response.redirect("/incidencias/")
    }).catch( (error) => {
        console.log(error);
    });
}

exports.post_getunidades = (request,response,next) => {
    Unidad.fetchC(request.body.cliente)
    .then( ([unidades, fieldData]) => {
        response.status(200).json(unidades);
    }).catch( (error) => {
        console.log(error);
    });
}

exports.get_cerrar = (request,response,next) => {
    Ticket.cerrar(request.params.id).then(([rows, fieldData]) => {
        response.redirect('/incidencias/');
    }).catch((err)=>{console.log(err)});
}

exports.get_abrir = (request,response,next) => {
    Ticket.abrir(request.params.id).then(([rows, fieldData]) => {
        response.redirect('/incidencias/');
    }).catch((err)=>{console.log(err)});
}
