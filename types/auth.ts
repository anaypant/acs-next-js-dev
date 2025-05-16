export interface User {
    id: string;
    username: string;
    email: string;
    attributes: {
        sub: string;
        email: string;
        name: string;
        [key: string]: string;
    };
} 