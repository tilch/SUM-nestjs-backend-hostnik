import { BadRequestException, Body, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Permission } from '../../entities/permission.entity'
import { User } from '../../entities/user.entity'
import Logging from '../../library/Logging'
import { AbstractService } from '../common/abstract.service'
import { CreatePermissionDto } from './dto/create-permission.dto'

@Injectable()
export class PermissionsService extends AbstractService {
  constructor(@InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>) {
    super(permissionsRepository)
  }

  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      const permission = this.permissionsRepository.create(createPermissionDto)
      return this.permissionsRepository.save(permission)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating a new permission.')
    }
  }
}
