let express = require('express'); // importa o framework express
let multer = require('multer'); // importa o multer, para upload de arquivos (audios)
let cors = require('cors'); // importa o CORS para permitir que o servidor aceite requisições de outros domínios (browser)
let path = require('path'); // importa o módulo path do Node.js para lidar com caminhos de arquivos
let fs = require('fs'); // importa o módulo fs (file system) para manipular arquivos

let app = express(); // cria uma instância express
let PORT = 3000; // define a porta do servidor

let upload_direction = path.join(__dirname, 'uploads'); // cria o caminho para a pasta 'uploads' usando o diretório atual (__dirname)

// verifica se a pasta 'uploads' existe -> se não, cria-a
if (!fs.existsSync(upload_direction)) {
  fs.mkdirSync(upload_direction);
}

app.use(cors()); // ativa o CORS
app.use(express.static('uploads')); // permite aceder aos ficheiros enviados pelo browser

// configuração do Multer: define onde e como os ficheiros são guardados
let storage = multer.diskStorage({
  // define onde os ficheiros serão guardados
  destination: function(req, file, cb)  {
    cb(null, 'uploads/');
  },

  // define o nome do ficheiro: hora atual + nome original (evitar conflitos)
  filename: function(req, file, cb) {
    let name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

let upload = multer({ storage: storage }); // cria o multer com a configuração definida acima

// define a rota e aceita ficheiros enviados com o nome audio, mas só 1 ficheiro de cada vez
app.post('/upload', upload.single('audio'), (req, res) => {
  // verifica se um ficheiro foi enviado
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
  }

  // Responde ao frontend 
  res.json({
    message: 'Upload concluído com sucesso!',
    filePath: req.file.path
  });
});

// inicia o servidor 
// mostra uma mensagem no terminal a indicar que o servidor está a funcionar
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
