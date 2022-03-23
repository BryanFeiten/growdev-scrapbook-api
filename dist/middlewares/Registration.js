"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyFieldsValues(request, response, next) {
    const { firstName, lastName, gender, email, age } = request.body;
    let mensagem = '';
    let error = false;
    switch (true) {
        case firstName.length < 3:
            mensagem = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            error = true;
            break;
        case lastName.length < 2:
            mensagem = 'Seu último nome deve conter pelo menos 2 letras.';
            error = true;
            break;
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            mensagem = 'Por favor insira um gênero válido.';
            error = true;
            break;
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            mensagem = 'Por favor insira um e-mail válido.';
            error = true;
            break;
        case age < 18:
            mensagem = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            error = true;
            break;
    }
    if (error) {
        return response.status(400).json(mensagem);
    }
    else {
        next();
    }
}
exports.default = verifyFieldsValues;
