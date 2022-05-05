export type UserDTO = {
    id?: number;
    username: string;
    fullName: string;
    gender: userGender;
    email: string;
    password: string;
    birthDate: string;
    autoToken?: string;
    signToken?: string;
}