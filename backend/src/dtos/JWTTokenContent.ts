import {Jwt} from 'jsonwebtoken'

//adds new field to the Jwt interface because it does not have userId and we cannot reference it
export interface JWTTokenContent extends Jwt {
    userId: string;
}