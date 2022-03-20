const generateId = () => Math.random().toString(36).substring(2);

const generateToken = () => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

const generateRandomValue = () => Math.random().toString(36).substring(2);

type Gender = 'masculine' | 'female' | 'non-binary';
export default class User {
    id: string = generateId();
    token: string = '';
    tempToken: string = '';
    lastLoggedIp: string = '';


    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, public phone: string, private password: string, public age: number) { }


    get getPassword() {
        return this.password;
    }

    setPassword(newPassword: string) {
        this.password = newPassword;
    }
    setFirstName(newFirstName: string) {
        this.firstName = newFirstName;
    }
    setLastName(newLastName: string) {
        this.firstName = newLastName;
    }
    setGender(newGender: Gender) {
        this.gender = newGender;
    }


    setLogout() {
        this.token = '';
        this.tempToken = '';
    }
    setToken(ipAdress: string) {
        this.token = generateToken();
        this.lastLoggedIp = ipAdress;

        return this.token;
    }
    refreshToken() {
        this.tempToken = generateRandomValue();

        return this.tempToken;
    }
}