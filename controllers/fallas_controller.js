const path = require('path');
const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js');
const Tipofalla = require('../models/tipofalla.model.js');


exports.get_root = (request, response, next) => {
    Unidad.fetchAllwC().then(([unidades, fieldData])=>{
        Cliente.fetchClientes().then(([clientes, fieldData2])=>{
            Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                response.render(path.join('falla','falla.ejs'),{
                    unidades: unidades,
                    clientes: clientes,
                    tipofallas: tipofallas,
                    permisos: request.session.permisos,
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
    const falla = new Tipofalla(request.body.falla);
    falla.save().then(()=>{
        response.redirect('/fallas');
    }).catch((error)=>{
        console.log(error);
    });
    
}

exports.get_delete = (request, response, next) => {
    Tipofalla.delete(request.params.idfalla)
        .then( ([rows, fieldData]) => {
                response.redirect('/fallas')
            })
        .catch( (error) => {
            console.log(error);
    });
}

