# Imágenes de skins de la tienda

Poné acá los PNG (cuadrados, idealmente 512×512) con **exactamente** estos nombres.
La tienda ya apunta a `/skins/<archivo>` (columna `SylumSkins.image_url`). Si el archivo
no existe, la card muestra un placeholder con la inicial — no se rompe.

| Skin | item_id | archivo |
|---|---|---|
| Cute Teddy | 200418 | `cute-teddy.png` |
| Panda | 200417 | `panda.png` |
| Devias Knights | 200409 | `devias-knights.png` |
| Rift Legacy | 200411 | `rift-legacy.png` |
| Tall's Wings | 200429 | `talls-wings.png` |
| Dark Angel | 200404 | `dark-angel.png` |

## De dónde sacar las imágenes

Los íconos/arte del juego **no** son archivos sueltos: están dentro de paquetes UE3
cocinados (`.upk`) en `Client/MU2/LegendGame/Content/UI/Icons/`
(`Icon_CashShop.upk`, `Icon_Equip.upk`, `Icon_Item.upk`). Cada item tiene un
`icon_index` en `SharedData/data/item_info.csv` (ej. Dark Angel = 58005).

Opciones, de más simple a más técnica:

1. **Screenshot in-game** (recomendado para las cards): equipá el costume y sacá una
   captura. Se ve mucho mejor que el ícono chico.
2. **Extraer con UE Viewer (umodel)** — herramienta estándar para UE3
   (https://www.gildor.org/en/projects/umodel). Abrí el `.upk` de iconos, buscá la
   textura y exportá a PNG/TGA. Recortá el ícono del atlas si hace falta.
3. **Bases de datos / wikis de MU Legend** con renders de costumes ya listos.

Una vez que tengas los PNG acá, recargá la web (en dev, Vite los sirve al toque).
