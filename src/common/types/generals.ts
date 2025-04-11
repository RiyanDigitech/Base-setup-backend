export interface userRegistrationSchema {
    username: string,
    email: string
    password: string
    image: string | undefined
}

export interface UserUpdateSchema {
    username?: string;
    email?: string;
    password?: string;
    image?: string;
}

export interface UserLoginSchema {
    email: string
    password: string
}

export interface resetPasswordSchema {
    token: string
    newPassword: string
    confirmPassword: string
}

