import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {UsersService} from "../../users/users.service";
import {ExtractJwt} from "passport-jwt";
import { Request } from "express";
import {TokenPayload} from "../../../interfaces/auth.interface";
import {User} from "../../../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService, configService: ConfigService) {

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                return request?.cookies?.access_token
                }
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: TokenPayload): Promise<User> {
        return this.usersService.findById(payload.sub)
    }

}