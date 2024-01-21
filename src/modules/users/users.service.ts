import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {AbstractService} from "../common/abstract.service";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import Logging from "../../library/Logging";
import {UpdateUserDto} from "./dto/update-user.dto";
import {compareHash, hash} from "../../utils/bcrypt";
import {PostgresErrorCodeEnum} from "../../helpers/postgresErrorCode.enum";


@Injectable()
export class UsersService extends AbstractService{
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
        super(usersRepository);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.findBy({ email: createUserDto.email })

        if(user) {
            throw new BadRequestException('User with that email already exists.')
        }

        try {
            const newUser = this.usersRepository.create({ ...createUserDto, role: { id: createUserDto.role_id } })
            return this.usersRepository.save(newUser)
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('Something went wrong while creating a new user')
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const someCondition = '';
        const user = (await this.findById(id)) as User;
        const {email, password,confirm_password, role_id, ...data} = updateUserDto
        if(user.email !== email && email) {
            user.email = email
        }
        else if (email && user.email === email) {
            throw new BadRequestException('User with that email already exists.')
        }
        if(password && confirm_password) {
            if(password !== confirm_password) {
                throw new BadRequestException('Passwords do not match')
            }
            if(await compareHash(password, user.password)) {
                throw new BadRequestException('New password cannot be the same as your old password!')
            }
            user.password = await hash(password)
        }
        if(role_id) {
            user.role = {...user.role, id: role_id}
        }
        try {
            Object.entries(data).map((entry) => {
                user[entry[0]] = entry[1]
            })
            return this.usersRepository.save(user)
        } catch (error) {
            if (error?.code === PostgresErrorCodeEnum.UniqueViolation)
            throw new BadRequestException('User with that email already exists')
        }
        throw new InternalServerErrorException('Something went wrong while updating the user..')
    }


    async updateUserImageId(id: string, avatar: string): Promise<User> {
        const user = await this.findById(id)
        return this.update(user.id, { avatar })
    }


}
