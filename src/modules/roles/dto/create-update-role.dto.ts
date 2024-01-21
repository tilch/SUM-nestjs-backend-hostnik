import {IsNotEmpty} from "class-validator";

export class CreateUpdateRoleDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty({ message: 'There should atleast be one permission selected' })
    permissions: string[]
}