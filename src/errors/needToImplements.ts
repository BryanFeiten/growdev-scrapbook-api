export class ImplementsError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}