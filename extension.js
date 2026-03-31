const vscode = require('vscode');
const express = require('express');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

let serverInstance;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('record-backend.start', async function () {
        
        const baseUrl = await vscode.window.showInputBox({
            prompt: "Introduce tu URL base para capturar",
            placeHolder: "https://api.banca.com",
            ignoreFocusOut: true
        });

        if (!baseUrl) return;

        const portInput = await vscode.window.showInputBox({
            prompt: "¿Qué puerto local quieres usar para el interceptor?",
            placeHolder: "8080",
            value: "8080",
            ignoreFocusOut: true,
            validateInput: value => {
                if (!value) return null;
                const port = Number(value);
                if (!Number.isInteger(port) || port < 1 || port > 65535) {
                    return "Ingresa un número de puerto entre 1 y 65535";
                }
                return null;
            }
        });

        if (!portInput) return;
        const port = parseInt(portInput, 10);

        const storagePath = path.join(context.extensionPath, 'captured_mocks');
        await fs.ensureDir(storagePath);

        const app = express();
        app.use(express.json());

        // --- SOLUCIÓN AL ERROR: Usamos una función middleware en lugar de una ruta con '*' ---
        app.use(async (req, res) => {
            // Generar nombre de archivo
            const sanitizedUrl = req.url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${req.method}${sanitizedUrl}.json`;
            const filePath = path.join(storagePath, fileName);

            try {
                const response = await axios({
                    method: req.method,
                    url: `${baseUrl}${req.url}`,
                    data: req.body,
                    headers: { 
                        'Authorization': req.headers.authorization || '',
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });

                await fs.writeJson(filePath, response.data, { spaces: 2 });
                return res.json(response.data);

            } catch (error) {
                if (await fs.pathExists(filePath)) {
                    const cachedData = await fs.readJson(filePath);
                    vscode.window.setStatusBarMessage(`📦 Mock: ${req.url}`, 4000);
                    return res.json(cachedData);
                }

                res.status(503).json({ error: "Sin conexión y sin mock guardado." });
            }
        });

        if (serverInstance) serverInstance.close();

        serverInstance = app.listen(port, () => {
            vscode.window.showInformationMessage(`✅ Interceptor en http://localhost:${port} -> ${baseUrl}`);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {
    if (serverInstance) serverInstance.close();
}

module.exports = { activate, deactivate };
