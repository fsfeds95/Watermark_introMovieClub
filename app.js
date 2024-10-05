// Importar las bibliotecas requeridas
const express = require('express');
const jimp = require('jimp-compact');
const sharp = require('sharp');
const axios = require('axios');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

// Objeto para almacenar imágenes en caché
const imageCache = {};

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/p?url=IMG"
// Ruta "/p" para combinar funcionalidades
app.get('/p', async (req, res) => {

 const serverUrl = `${req.protocol}://${req.get('host')}`;
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 if (imageCache[url]) {
  return res.send(imageCache[url]);
 }

 try {
  const image = await jimp.read(url);
  image.resize(720, 1080, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-poster.png');
  const watermark2 = await jimp.read('Wlogo-poster.png');

  watermark1.resize(720, 1080);
  watermark2.resize(720, 1080);

  watermark1.opacity(0.12);
  watermark2.opacity(0.75);

  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });
  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(4, '0');

  const fileName = `backdrop_${randomNumber}.webp`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/webp'
   );
   res.send(buffer);
  });

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `${serverUrl}/p?url=${url}`,
   responseType: 'arraybuffer'
  }).then(response => {
   sharp(response.data)
    .toFormat('webp')
    .toBuffer()
    .then(data => {
     res.setHeader('Content-Type', 'image/webp');
     res.send(data);
    })
    .catch(err => res.send('¡Ups! Algo salió mal al convertir la imagen: ' + err));
  }).catch(err => res.send('¡Error al obtener la imagen: ' + err));

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);
  console.log(`servidor activo en ${serverUrl}`);
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/b?url=IMG"
// Ruta "/b" para combinar funcionalidades
app.get('/b', async (req, res) => {
 const serverUrl = `${req.protocol}://${req.get('host')}`;
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 if (imageCache[url]) {
  return res.send(imageCache[url]);
 }

 try {
  const image = await jimp.read(url);
  image.resize(1280, 720, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-Backdrop.png');
  const watermark2 = await jimp.read('Wlogo-Backdrop-3.png');

  watermark1.resize(1280, 720);
  watermark2.resize(1280, 720);

  watermark1.opacity(0.12);
  watermark2.opacity(0.75);

  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });
  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `backdrop_${randomNumber}.webp`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/webp'
   );
   res.send(buffer);
  });

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `${serverUrl}/b?url=${url}`,
   responseType: 'arraybuffer'
  }).then(response => {
   sharp(response.data)
    .toFormat('webp')
    .toBuffer()
    .then(data => {
     res.setHeader('Content-Type', 'image/webp');
     res.send(data);
    })
    .catch(err => res.send('¡Ups! Algo salió mal al convertir la imagen: ' + err));
  }).catch(err => res.send('¡Error al obtener la imagen: ' + err));

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);
  console.log(`servidor activo en ${serverUrl}`);
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/logo?url=ENLACE&logoUrl=ENLACE&x=50&y=50"
// Ruta "/logo" para combinar funcionalidades
app.get('/logo', async (req, res) => {
 const serverUrl = `${req.protocol}://${req.get('host')}`;
 const { url, logoUrl, x = 0, y = 0 } = req.query;

 // Convertir X y Y a números
 const xPos = parseInt(x, 10);
 const yPos = parseInt(y, 10);

 if (!url || !logoUrl) {
  return res.status(400).json({ error: 'Faltan enlaces de imagen' });
 }

 if (imageCache[url]) {
  return res.send(imageCache[logoUrl]);
 }

 if (imageCache[logoUrl]) {
  return res.send(imageCache[logoUrl]);
 }

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);
  // Cargar el logo desde el enlace
  const logoImg = await jimp.read(logoUrl);
  // Cargar las marcas de agua
  const wm1 = await jimp.read('Wtxt-Backdrop.png');
  const wm2 = await jimp.read('Wlogo-Backdrop-3.png');

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  image.resize(1280, 720, jimp.RESIZE_MAGPHASE);

  logoImg.resize(543, 188, jimp.RESIZE_MAGPHASE);

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
  const fileName = `backdrop_${randomNumber}.webp`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/webp'
   );
   res.send(buffer);
  });

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `${serverUrl}/logo?url=${url}&logoUrl=${logoUrl}`,
   responseType: 'arraybuffer'
  }).then(response => {
   sharp(response.data)
    .toFormat('webp')
    .toBuffer()
    .then(data => {
     res.setHeader('Content-Type', 'image/webp');
     res.send(data);
    })
    .catch(err => res.send('¡Ups! Algo salió mal al convertir la imagen: ' + err));
  }).catch(err => res.send('¡Error al obtener la imagen: ' + err));

  console.log(`Se solicitó la siguiente imagen: '${url}' y '${logoUrl}' en la ruta '/logo'`);
  console.log(`servidor activo en ${serverUrl}`);
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/ping" para mantener la conexión activa
app.get('/ping', (req, res) => {
 // Aquí puedes hacer algo simple, como enviar una respuesta vacía

 const serverUrl = `${req.protocol}://${req.get('host')}`;
 const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
 console.log(`Sigo vivo en ${serverUrl}/ping\n\n(${currentDate})`);
 res.send('');
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 setInterval(() => {
  fetch(`https://localhost:${port}/ping`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
    console.log(`Sigo vivo 🎉 (${currentDate})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de ping:', error);
   });
 }, 5 * 60 * 1000);
});