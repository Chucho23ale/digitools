const path = require('path');

const Unidad = require('../models/unidad.model.js');
const Cliente = require('../models/usuario.model.js');
const Tipofalla = require('../models/tipofalla.model.js');
const Ticket = require('../models/ticket.model');

exports.get_root = (request, response, next) => {
    Cliente.fetchClientes().then(([clientes, fieldData2])=>{
        Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
            Ticket.fetchyears().then(([years, fieldData3])=>{
                    año = new Date().getFullYear();
                    mes = new Date().getMonth() +1;
                    Ticket.facturas(año, mes).then(([facturas, fieldData3])=>{
                        Ticket.fetchmonths(año).then(([months, fieldData3])=>{
                            for(let m of months){
                                m.name = getMonthName(m.mes);
                            }
                        response.render(path.join('facturacion','index.ejs'),{
                            clientes: clientes,
                            tipofallas: tipofallas,
                            permisos: request.session.permisos,
                            facturas: facturas,
                            years: years,
                            months: months,
                            user: request.session.username,
                        });
                    }).catch((error)=>{console.log(error);});
                }).catch((error)=>{console.log(error);});
            }).catch((error)=>{console.log(error);});
        }).catch((error)=>{console.log(error);});
    }).catch((error)=>{console.log(error);});
};

exports.get_facturas = (request,response,next) => {
    Ticket.facturas(request.params.yyyy, request.params.mes).then(([facturas, fieldData2])=>{
        response.status(200).json(facturas);
    }).catch((error)=>{console.log(error);});
}

exports.get_meses = (request,response,next) => {
    Ticket.fetchmonths(request.params.y).then(([meses, fieldData2])=>{
        for(let m of meses){
            m.name = getMonthName(m.mes);
        }
        response.status(200).json(meses);
    }).catch((error)=>{console.log(error);});
}

exports.get_pagar = (request,response,next) => {
    Ticket.pagar(request.params.yyyy, request.params.mes, request.params.cliente).then(([data, fieldData2])=>{
        response.redirect("/facturacion");
    }).catch((error)=>{console.log(error);});
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('es-MX', { month: 'long' });
}