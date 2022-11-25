const { response } = require('express');
const express = require('express');
const path = require('path');
const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js');
const Tipofalla = require('../models/tipofalla.model');

exports.get_root = (request, response, next) => {
    let info = request.session.info ? request.session.info : '';
    request.session.info = '';
    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchClientes().then(([clientes, fieldData2])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                response.render(path.join('unidades','unidades.ejs'),{
                    unidades: unidades,
                    clientes: clientes,
                    tipofallas: tipofallas,
                    permisos: request.session.permisos,
                    info: info,
                    user: request.session.username,
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

exports.post_new = (request,response,next) => {
    
    const unidad = new Unidad(request.body.imei, request.body.nombre, request.body.cliente);
    unidad.save().then(()=>{
        response.redirect('/unidades');
    }).catch((error)=>{
        console.log(error);
        console.log("catch");
        request.session.info = 'El IMEI ya se encuentra asignado a otra unidad';
        response.redirect('/unidades');
    });
    
}

exports.get_delete = (request, response, next) => {
    Unidad.delete(request.params.imei)
        .then( ([unidad, fieldData]) => {
                response.redirect('/unidades')
            })
        .catch( (error) => {
            console.log(error);
    });
}

exports.get_edit = (request, response, next) => {
    Unidad.fetchUser(request.params.imei).then( ([unidad, fieldData]) => {
        Cliente.fetchClientes().then(([clientes, fieldData2])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                response.render(path.join('unidades','unidad.edit.ejs'),{
                    unidad: unidad,
                    permisos: request.session.permisos,
                    clientes: clientes,
                    tipofallas: tipofallas,
                });
            }).catch( (error) => {
                console.log(error);
            });
        }).catch( (error) => {
            console.log(error);
        });
    }).catch( (error) => {
        console.log(error);
    });
}

exports.post_edit = (request, response, next) => {
    if(request.body.cliente == ""){
        //Update del nombre de la unidad
        Unidad.edit(request.params.imei, request.body.nombre)
        .then(() => {
            response.redirect('/unidades')
        })
        .catch( (error) => {
            console.log(error);
        });
    }else{
        //Update de tiene unidad
        Unidad.reasign(request.params.imei, request.body.nombre, request.body.cliente)
        .then(() => {
            response.redirect('/unidades')
        })
        .catch( (error) => {
            console.log(error);
        });
    }
}