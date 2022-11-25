const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(session({
    secret: 'astrctyfcughftyrwewrqasdfpiuljhtfuhbvrrdeawuibtdkhbtytf', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getSeconds() + '' + new Date().getMinutes() + '' + new Date().getHours() + '' + new Date().getDay() + '' + new Date().getMonth() + '' + new Date().getYear() + file.originalname);
    },
});


app.use(multer({ storage: fileStorage }).single('archivo'));

app.use(cookieParser());



const rutasusers = require('./routes/user.routes');
app.use('/user',rutasusers);

const rutasinci = require('./routes/incidencias.routes.js');
app.use('/incidencias', rutasinci);

const rutasclientes = require('./routes/clientes.routes.js');
app.use('/clientes', rutasclientes);

const rutasunidades = require('./routes/unidades.routes.js')
app.use('/unidades', rutasunidades);

const rutasfallas = require('./routes/fallas.routes.js')
app.use('/fallas', rutasfallas);

const rutasempleados = require('./routes/empleados.routes.js')
app.use('/empleados', rutasempleados);

const rutasfacturacion = require('./routes/facturacion.routes.js')
app.use('/facturacion', rutasfacturacion);

const rutascontrol = require('./routes/control.routes.js');
const dayjs = require('dayjs');
app.use('/control', rutascontrol);

app.get('/',(request,response,next)=>{
    if (request.session.isLoggedIn){
        if (request.session.permisos.indexOf('consultaticket') != -1) {
            response.redirect('/incidencias');
        } else {
            response.redirect('/facturacion');
        }
        response.redirect('/incidencias');
    } else{
        response.redirect('/user/login');
    }
});

app.use((request, response, next)=>{
    response.status(404);
    response.sendFile(path.join(__dirname,'views','error.html'));
})

app.listen(3000);