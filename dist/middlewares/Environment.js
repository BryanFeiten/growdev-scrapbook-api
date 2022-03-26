"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function checkEnvironmentVariables(request, response, next) {
    if (index_1.apiKey !== 'INVALID KEY' && index_1.SECRET_KEY !== 'INVALID KEY') {
        next();
    }
    else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        });
    }
}
exports.default = checkEnvironmentVariables;
