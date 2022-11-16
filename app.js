const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

const rutascontrol = require('./routes/control.routes.js')
app.use('/control', rutascontrol);

app.get('/',(request,response,next)=>{
    if (request.session.isLoggedIn){
        response.redirect('/incidencias');
    } else{
        response.redirect('/user/login');
    }
});

app.use((request, response, next)=>{
    response.status(404);
    response.sendFile(path.join(__dirname,'views','error.html'));
})

app.listen(8080);