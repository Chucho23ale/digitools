const { response } = require('express');
const express = require('express');
const { request } = require('http');
const path = require('path');
const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js'); 
const Tipofalla = require('../models/tipofalla.model');

exports.get_root = (request, response, next) => {
    let info = request.session.info ? request.session.info : '';
    request.session.info = '';
    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchClientes().then(([clientes, fieldData])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                response.render(path.join('clientes','clientes.ejs'),{
                    clientes: clientes,
                    unidades: unidades,
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
    const cliente = new Cliente(request.body.usuario, request.body.contraseña, request.body.rfc, request.body.razonsocial, request.body.lada + request.body.telefono);
    cliente.save(3).then(()=>{
        response.redirect('/clientes');
    }).catch((error)=>{
        console.log(error);
        console.log("catch");
        request.session.info = 'El nombre de usuario no esta disponible';
        response.redirect('/clientes');
    });  
}

exports.get_delete = (request, response, next) => {
    Cliente.deleteCliente(request.params.usuario)
        .then( ([rows, fieldData]) => {
                response.redirect('/clientes')
            })
        .catch( (error) => {
            console.log(error);
    });
}

exports.get_edit = (request, response, next) => {
    Cliente.fetchOne(request.params.usuario).then( ([cliente, fieldData]) => {
        Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
            Cliente.fetchClientes().then(([clientes, fieldData])=>{
                response.render(path.join('clientes','cliente.edit.ejs'),{
                    cliente: cliente[0],
                    clientes: clientes,
                    tipofallas: tipofallas,
                    permisos: request.session.permisos,
                    user: request.session.username,
                });
            }).catch( (error) => { console.log(error); });
        }).catch( (error) => { console.log(error); });
    }).catch( (error) => { console.log(error); });
}

exports.post_edit = (request, response, next) => {
    console.log(request.body.telefono);
    Cliente.edit(request.body.rfc, request.body.razonsocial, request.body.telefono, request.params.usuario)
    .then( ([rows, fieldData]) => {
        response.redirect('/clientes')
    })
    .catch( (error) => {
        console.log(error);
    });
}