"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
function postValidation(request, response, next) {
    const { postHeader, postContent, postPrivacity } = request.body;
    switch (true) {
        case postHeader.length < 3:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Cabeçalho do post está'), constants_1.HttpBadRequestCode);
        case postContent.length < 4:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Conteúdo do post está'), constants_1.HttpBadRequestCode);
        case postPrivacity !== 'private' && postPrivacity !== 'public':
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('A privacidade do post é'), constants_1.HttpBadRequestCode);
    }
    next();
}
exports.default = postValidation;
