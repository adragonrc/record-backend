# record-backend

Extensión para interceptar peticiones de tu backend y guardar respuestas en `captured_mocks/`, ideal para desarrollar funciones sin depender del entorno remoto.

## ¿Qué hace?
- Encaminador local que repite el comportamiento de tu API remota usando `axios`.
- Guarda cada respuesta en JSON legible (con identación de dos espacios) para reutilizarla como mock.
- Permite trabajar offline: si una ruta ya fue capturada, responde siempre desde el mock si el host remoto no está disponible.

## Requisitos e instalación
1. Asegúrate de tener [Node.js](https://nodejs.org) (al menos la versión 18).
2. Clona o abre este repositorio en VS Code.
3. Ejecuta `npm install` desde la terminal raíz para instalar dependencias.

> `captured_mocks/` ya está ignorado en `.gitignore`, así que sus contenidos no se subirán al repositorio.

## Cómo ejecutar el proyecto y capturar mocks
1. Abre el proyecto en VS Code y presiona `F5` para lanzar el *Extension Development Host*.
2. En la nueva ventana activa la paleta (`Ctrl+Shift+P` o `Cmd+Shift+P`) y ejecuta `Record Backend: Start`.
3. La extensión te pedirá primero la URL base del backend remoto (por ejemplo, `https://api.banca.com`). Escríbela y confirma.
4. Luego te preguntará por el puerto local para escuchar; lo ideal es usar `8080` o cualquier puerto libre que prefieras.
5. Una vez el proxy esté activo, abre la configuración de tu proyecto y reemplaza temporalmente la URL base por `http://localhost:<puerto>` (el puerto que elegiste). Así las llamadas pasan por la extensión y se guardan en `captured_mocks/`.
6. Navega por la funcionalidad que quieras capturar. Cada petición se almacenará en un archivo nuevo cuyo nombre incluye el verbo HTTP y la ruta sanitizada.
7. Cuando no necesites seguir grabando, vuelve a la URL real de producción/remota y detén el proxy (cierra la ventana del host o detén la extensión).

## Consejos rápidos
- Usa la barra de estado de VS Code para saber cuándo se sirvió un mock: aparece un mensaje tipo `📦 Mock: /api/...`.
- Si el backend real no responde y ya existe un mock previo, la extensión responde con el mock siempre que el archivo exista.
- Guarda los mocks actualizados antes de cerrar la ventana del host para evitar perder cambios locales.

**Disfruta capturando y probando tu backend sin depender del entorno remoto.**
