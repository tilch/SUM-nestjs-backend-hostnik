import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {PermissionsService} from "./permissions.service";
import {Permission} from "../../entities/permission.entity";
import {CreatePermissionDto} from "./dto/create-permission.dto";

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Permission[]> {
        return this.permissionsService.findAll()
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.permissionsService.create(createPermissionDto)
    }
}
