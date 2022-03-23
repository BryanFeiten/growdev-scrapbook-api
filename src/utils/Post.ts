import { Privacity } from "../classes/Post";

export default function postValidation(postHeader: string, postContent: string, postPrivacity: Privacity) {
    let validPost = false;
    let message = '';

    switch (true) {
        case postHeader.length < 3:
            message = 'Você precisa preencher o campo de Cabeçalho. O Cabeçalho deve ter 3 letras no mínimo.';
            break

        case postContent.length < 4:
            message = 'Você precisa preencher o campo de conteúdo. O Conteúdo deve ter 4 letras no mínimo.';
            break

        case postPrivacity !== 'private' && postPrivacity !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break

        default:
            validPost = true;
    }

    return { validPost, message };
}