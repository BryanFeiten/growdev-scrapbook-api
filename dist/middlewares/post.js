"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function postValidation(request, response, next) {
    const { postHeader, postContent, postPrivacity } = request.body;
    if (!postHeader || !postContent || !postPrivacity)
        return response.status(constants_1.HttpBadRequestCode).json({
            mensagem: (0, constants_1.invalidFieldMessage)('Campo(s) para criação do post')
        });
    switch (true) {
        case postHeader.length < 3:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Cabeçalho do post está')
            });
        case postContent.length < 4:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Conteúdo do post está')
            });
        case postPrivacity !== 'private' && postPrivacity !== 'public':
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('A privacidade do post é')
            });
    }
    next();
}
exports.default = postValidation;
