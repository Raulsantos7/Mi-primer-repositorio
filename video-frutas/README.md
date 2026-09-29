# Video Instagram: Come local, come fresco

Video publicitario vertical (1080×1920, formato Reel) en estilo pizarra dibujada a mano,
sobre los beneficios de comprar en mercados locales y de consumir naranjas, limones,
mandarinas y plátanos. Duración: ~46 s.

- `index.html`: el video animado en HTML. Ábrelo en el navegador (controles: ▶/❚❚, ↺, barra de progreso, barra espaciadora).
- `video-frutas-mercado-local.mp4`: el mismo video exportado a MP4 (H.264), listo para subir a Instagram.
- `img/`: fotos de las frutas (fondo recortado). `fonts/`: tipografías Baloo 2 y Caveat.

## Escenas
1. Portada: "Tu salud empieza en tu mercado LOCAL" + puesto de mercado dibujado.
2. ¿Por qué el mercado local? Más frescos · Apoyas a tu comunidad · Cuidas el planeta · Mejor sabor y precio.
3. Naranjas: defensas, vitamina C, piel sana.
4. Limón: digestión, hidratación, antioxidantes.
5. Mandarinas: fácil de pelar, fibra y vitamina C, dulce y ligera.
6. Plátano: potasio, energía, fibra.
7. Cierre: "¡Ve a tu MERCADO LOCAL!" #ComeLocal #MercadoLocal

## Texto sugerido para la publicación
> 🍊🍋🍌 Tu salud empieza en tu mercado local. Frutas más frescas, de temporada y
> apoyando a quienes las cultivan cerca de ti. Este fin de semana, ¡date una vuelta! 🧺💚
>
> #ComeLocal #MercadoLocal #FrutaDeTemporada #VidaSana #Naranjas #Limones #Mandarinas #Plátanos

## Volver a exportar el MP4
Abre `index.html?rec` (modo grabación, sin controles, a 1080×1920). La página expone
`window.__seek(segundos)` y `window.__total`, así que se puede capturar cuadro a cuadro
con Playwright y unir los cuadros con ffmpeg a 30 fps.
