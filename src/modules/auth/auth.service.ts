import {BadRequestException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../entities/user.entity";
import {compareHash, hash} from "../../utils/bcrypt";
import Logging from "../../library/Logging";
import {RegisterUserDto} from "./dto/register-user.dto";
import {Request} from "express";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
        async validateUser(email: string, password: string): Promise<User> {
            Logging.info('Validating user...')
            const user = await this.usersService.findBy({ email })
            if(!user) {
                throw new BadRequestException('Invalid credentials')
            }
            if(!(await compareHash(password, user.password))) {
                throw new BadRequestException('Invalid credentials')
            }

            Logging.info('User is valid.')
            return user
    }


    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashedPassword = await hash(registerUserDto.password)
        return  this.usersService.create({
            role_id: null,
            ...registerUserDto,
            password: hashedPassword,
        })
    }


    async generateJwt(user: User): Promise<string> {
        return this.jwtService.signAsync({ sub:user.id, name: user.email })
    }

    async user(cookie: string): Promise<string> {
        const data = await this.jwtService.verifyAsync(cookie)
        return this.usersService.findById(data['id'])
    }

    async getUserId(request: Request): Promise<string> {
        const user = request.user as User
        return user.id
    }

}
