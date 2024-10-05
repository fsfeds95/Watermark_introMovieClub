// Importar las bibliotecas requeridas
const express = require('express');
const jimp = require('jimp-compact');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/p?url=IMG"
app.get('/p', async (req, res) => {
 const url = req.query.url;

 // Verificar si se suministró un enlace
 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 // Agrega este console.log
 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  image.resize(720, 1080, jimp.RESIZE_MAGPHASE);

  // Cargar las marcas de agua
  const wm1 = await jimp.read('Wtxt-poster.png');
  const wm2 = await jimp.read('Wlogo-poster.png');

  // Escala la marca de agua a 1280px de ancho por 720px de alto
  wm1.resize(720, 1080);
  wm2.resize(720, 1080);

  // Establece la opacidad de la wm1 a 0.375 y wm2 a 0.75
  wm1.opacity(0.08);
  wm2.opacity(0.40);

  // Combinar las marcas de agua en una sola imagen
  wm1.composite(wm2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Aplicar la marca de agua a la imagen
  image.composite(wm1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Generar un número aleatorio de 4 dígitos entre 0000 y 9999
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `poster_${randomNumber}.jpeg`;

  // Guardar la imagen en formato jpeg con calidad al 100%
  image.quality(100).scale(1).write(fileName);

  // Enviar la imagen como respuesta
  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header('Content-Type', 'image/jpeg', 'Content-Disposition', `attachment; filename="${fileName}"`);
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error.message); // Muestra el mensaje del error
  res.status(500).json({ error: 'Error al generar la imagen CATCH', details: error.message });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/b?url=IMG"
app.get('/b', async (req, res) => {
 const url = req.query.url;

 // Verificar si se suministró un enlace
 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 // Agrega este console.log
 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  image.resize(1280, 720, jimp.RESIZE_MAGPHASE);

  // Cargar las marcas de agua
  const wm1 = await jimp.read('Wtxt-Backdrop.png');
  const wm2 = await jimp.read('Wlogo-Backdrop-3.png');

  // Escala la marca de agua a 1280px de ancho por 720px de alto
  wm1.resize(1280, 720);
  wm2.resize(1280, 720);

  // Establece la opacidad de la wm1 a 0.375 y wm2 a 0.75
  wm1.opacity(0.08);
  wm2.opacity(0.40);

  // Combinar las marcas de agua en una sola imagen
  wm1.composite(wm2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Aplicar la marca de agua a la imagen
  image.composite(wm1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Generar un número aleatorio de 4 dígitos entre 0000 y 9999
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `backdrop_${randomNumber}.jpeg`;

  // Guardar la imagen en formato jpeg con calidad al 100%
  image.quality(100).scale(1).write(fileName);

  // Enviar la imagen como respuesta
  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header('Content-Type', 'image/jpeg', 'Content-Disposition', `attachment; filename="${fileName}"`);
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error.message); // Muestra el mensaje del error
  res.status(500).json({ error: 'Error al generar la imagen CATCH', details: error.message });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/logo?url=ENLACE&logoUrl=ENLACE&x=50&y=50"
app.get('/logo', async (req, res) => {
 const { url, logoUrl, x = 0, y = 0 } = req.query;

 // Convertir X y Y a números
 const xPos = parseInt(x, 10);
 const yPos = parseInt(y, 10);

 if (!url || !logoUrl) {
  return res.status(400).json({ error: 'Faltan enlaces de imagen' });
 }

 console.log(`Se solicitó la siguientes imagen: '${url}' y '${logoUrl}' en la ruta '/logo'`);

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);
  // Cargar el logo desde el enlace
  const logoImg = await jimp.read(logoUrl);

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  image.resize(1280, 720, jimp.RESIZE_MAGPHASE);

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  logoImg.resize(543, 188, jimp.RESIZE_MAGPHASE);

  // Cargar las marcas de agua
  const wm1 = await jimp.read('Wtxt-Backdrop.png');
  const wm2 = await jimp.read('Wlogo-Backdrop-3.png');

  wm1.resize(1280, 720);
  wm2.resize(1280, 720);

  wm1.opacity(0.08);
  wm2.opacity(0.40);

  // Combinar las marcas de agua en una sola imagen
  // Combinar el logo como primera marca
  image.composite(logoImg, xPos, yPos, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Combinar wm1 como segunda marca
  image.composite(wm1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Combinar wm2 como tercera marca
  image.composite(wm2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });


  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `backdrop_${randomNumber}.jpeg`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header('Content-Type', 'image/jpeg', 'Content-Disposition', `attachment; filename="${fileName}"`);
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error.message); // Muestra el mensaje del error
  res.status(500).json({ error: 'Error al generar la imagen CATCH', details: error.message });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/ping"
app.get('/ping', (req, res) => {
 // Aquí puedes hacer algo simple, como enviar una respuesta vacía

 const currentDate = new Date();
 const formattedTime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
 console.log(`Sigo vivo 🎉 (${formattedTime})`);
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/ping`)
   .then(response => {
    const currentDate = new Date();
    const formattedTime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de ping:', error);
   });
 }, 5 * 60 * 1000); // 30 minutos * 60 segundos * 1000 milisegundos
});