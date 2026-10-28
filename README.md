# CUASEN — Sitio web + kit de Instagram

**CUASEN — Cada decisión tiene consecuencias.** Sitio responsive para presentar seis juegos de simulación gratuitos, su filosofía y un canal para recibir opiniones. El contenido institucional se presenta como un estudio independiente y explica que las herramientas de inteligencia artificial son parte central del desarrollo.

## Web

Abrí `index.html` con un navegador; también podés publicar la carpeta `cuasen` en Vercel o cualquier hosting estático. No necesita instalar paquetes.

- Previsualización de los seis juegos mediante iframe, cuando el navegador y cada sitio permiten mostrarla.
- Alternativa de captura (carga una imagen desde un servicio externo si hay conexión) y SVG de respaldo. **Los SVG son ilustraciones, no capturas reales.**
- Seis tarjetas visibles, clicables y con enlaces directos: en escritorio, junto al juego destacado; en tablet y celular, en una galería adaptable.
- Recorrido automático: tras 9 segundos sin interacción empieza a pasar de un juego a otro cada 7 segundos. Se pausa con el control correspondiente o mientras el destacado esté fuera de pantalla. Respeta la preferencia de movimiento reducido.
- Una **indicación llamativa para deslizar hacia abajo** conduce a la filosofía del estudio.
- Sección de valores: simulación extrema, gratuidad, ausencia de pay-to-win, futuras posibilidades de donaciones voluntarias y skins cosméticas.
- Botón **Dejá tu opinión**: abre el correo a `tobi198@hotmail.com` con asunto precargado.

Para editar textos y URLs, usá `index.html`; los estilos están en `css/styles.css` y la lógica en `js/app.js`.

## Instagram

La carpeta `instagram` contiene:

- `CUASEN_Icono_Instagram_1080.png`: foto de perfil lista para subir.
- `CUASEN_Marca_vectorial.svg`: variante de marca escalable.
- `publicaciones/`: **seis diseños PNG de 1080 × 1350** listos para el feed.
- `stories/`: historia vertical **1080 × 1920** para lanzamiento.
- `BIO_Y_PUBLICACIONES.txt`: bio, sugerencias de usuario, copies preparados para la campaña original de cinco juegos. Las imágenes promocionales anteriores se conservan como material histórico; el catálogo web ya muestra los seis.

**Importante:** las imágenes publicitarias combinan diseño tipográfico con arte gráfico ilustrativo de las escenas de respaldo; no deben presentarse como pantallazos verificados de las webs. Los nombres de usuario sugeridos no se han comprobado.

## Capturas locales (opcional)

Podés generar capturas auténticas con una computadora conectada a Internet:

```bash
python -m pip install playwright
python -m playwright install chromium
python tools/capturar-juegos.py
```

El script guarda imágenes en `assets/capturas/` y actualiza `js/capturas-locales.js`.

## Marca

El nombre **CUASEN** expresa la relación entre causa y consecuencia: toda decisión altera el mundo simulado. Es un nombre de fantasía, no una etimología reconocida. Conviene comprobar su disponibilidad registral y de dominio antes de registrar la marca.

## Pulso Estelar (nuevo)

El sexto juego es [Pulso Estelar](https://pulso-estelar-git-main-tobias-morel.vercel.app/). Se incorporó a la galería, la vista en vivo, las capturas con fallback ilustrado y el recorrido automático. La disposición de la portada se adapta a escritorio, tablet y celular.

## Previsualización de Pulso Estelar

La URL actualmente utilizada por Pulso Estelar termina en `git-main-tobias-morel.vercel.app` y corresponde a un despliegue de rama. En una sesión pública o dentro de un iframe, Vercel puede mostrar una pantalla de autenticación. Para evitar que eso aparezca en la portada de CUASEN, **Pulso Estelar usa la captura real proporcionada por el creador**: `assets/pulso-real.avif`. Es una vista estática, tanto en el destacado como en la tarjeta. Los otros cinco juegos conservan sus vistas en vivo.

El botón «Entrar a Jugar» mantiene el enlace original compartido por el creador. Si se desea que funcione para todos los visitantes y vuelva a tener vista en vivo, hay que publicar Pulso Estelar en una URL de **producción pública**, verificar que admita incrustación en iframe y actualizar la URL en `index.html` y `js/app.js`. Luego puede quitarse `data-static-preview="true"` de la escena correspondiente.

El generador de capturas no sobreescribe esta imagen, evitando guardar un formulario de acceso por accidente.
