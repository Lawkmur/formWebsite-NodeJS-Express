const express = require('express');
const app = express();
const  http = require('http');
const server = http.createServer(app);
const nodemailer = require('nodemailer');
const  io = require('socket.io')(server);

// Activamos las features de express y handlebars frameworks
const exphbs = require('express-handlebars');

// Datos o middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// __dirname means current folder

// Configurando handlebars
app.set("view engine","hbs");
app.engine('hbs',exphbs({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs', // extension del archivo
    defaultLayout: 'index',
}));

// Landing page
app.get('/', (req,res)=>{
    res.render("main"); // sin extension ya que handlebars lo interpreta como un hbs gracias a extname
})
 
app.get('/about', (req,res)=>{
    res.render("about");
})

app.get('/contact', (req,res)=>{
    res.render("contact");
})

app.get('*', (req,res)=>{
    res.render("team");
})

// configurar el output de salida con el metodo post. Éste es un método. Solicitar y enviar
app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Full name: ${req.body.name}</li>
        <li>Subject: ${req.body.subject}</li>
        <li>Email: ${req.body.email}</li>

      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
      <img src="https://cdn.discordapp.com/attachments/841038533078548491/859469615556853800/369823ad-80df-4a87-bbbd-0b742bc75161.png">
    `;

      // Creamos una funcion re-utilizable usando el protocolo SMTP con nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fragancecsa@gmail.com',
          pass: 'ewqmvhxgyihsuzrf' 
        }
      });
    
      // tls:{
      //   rejectUnauthorized:false
      // }

  // Set up de los datos del correo
  let mailOptions = {
      from: '"Fabio Menjívar" <fragancecsa@gmail.com>', // Correo del emisor
      to: 'ricardo.menjivar2022@adoc.superate.org.sv', // Lista de receptores
      subject: 'IT WORKED!!!', // Asunto del correo
      html: output // cuerpo html.
  };

  // Envia el correo con un medio de transporte
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render({msg:'Email has been sent'});
  });
  });
  
  const port = 3000;
  server.listen(port);
  console.log(`Listening to server: http://localhost:${port}`);