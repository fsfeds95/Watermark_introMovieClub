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

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `http://localhost:8225/p?url=${url}`,
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
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/b?url=IMG"
// Ruta "/b" para combinar funcionalidades
app.get('/b', async (req, res) => {
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
  const watermark2 = await jimp.read('Wlogo-Backdrop-2.png');
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

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `http://localhost:8225/b?url=${url}`,
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
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/small_p?url=IMG"
// Ruta "/small_p" para combinar funcionalidades
app.get('/small_p', async (req, res) => {
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 if (imageCache[url]) {
  return res.send(imageCache[url]);
 }

 try {
  const image = await jimp.read(url);
  image.resize(500, 750, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-Backdrop.png');
  const watermark2 = await jimp.read('Wlogo-Backdrop-2.png');
  watermark1.resize(500, 750);
  watermark2.resize(500, 750);
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

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/small_b'`);

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `http://localhost:8225/small_b?url=${url}`,
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
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/small_b?url=IMG"
// Ruta "/small_b" para combinar funcionalidades
app.get('/small_b', async (req, res) => {
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 if (imageCache[url]) {
  return res.send(imageCache[url]);
 }

 try {
  const image = await jimp.read(url);
  image.resize(500, 281, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-Backdrop.png');
  const watermark2 = await jimp.read('Wlogo-Backdrop-2.png');
  watermark1.resize(500, 281);
  watermark2.resize(500, 281);
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

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/small_b'`);

  // Convertir la imagen a formato WEBP
  axios({
   // Cambiar la URL base si es necesario
   url: `http://localhost:8225/small_b?url=${url}`,
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
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/keep-alive" para mantener la conexión activa
app.get('/keep-alive', (req, res) => {
 // Aquí puedes hacer algo simple, como enviar una respuesta vacía
 res.send('');
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/keep-alive`)
   .then(response => {
    const currentDate = new Date();
    const formattedTime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de keep-alive:', error);
   });
 }, 5 * 60 * 1000); // 5 minutos * 60 segundos * 1000 milisegundos
});