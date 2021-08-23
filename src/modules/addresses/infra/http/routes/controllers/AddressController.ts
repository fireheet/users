import {
  Body,
  Controller,
  Patch,
  Post,
  Param,
  UseFilters,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ErrorException from '@shared/exceptions/ErrorException';
import { Address } from '@fireheet/entities';
import ValidationException from '@shared/exceptions/ValidationException';
import CreateAddressService from '@modules/addresses/services/CreateAddressService';
import CreateAddressDTO from '@modules/addresses/dtos/CreateAddressDTO';
import UpdateAddressDTO from '@modules/addresses/dtos/UpdateAddressDTO';
import { Delete, Query } from '@nestjs/common/decorators/http';
import UpdateAddressService from '../../../../services/UpdateAddressService';
import ListAddressService from '../../../../services/ListAddressService';
import ListAllAddressesService from '../../../../services/ListAllAddressesService';
import DeleteAddressService from '../../../../services/DeleteAddressService';

@ApiTags('Addresses Routes')
@Controller()
@UseFilters(ErrorException, ValidationException)
@UseInterceptors(ClassSerializerInterceptor)
export default class AddressesController {
  constructor(
    private readonly createAddress: CreateAddressService,
    private readonly updateAddress: UpdateAddressService,
    private readonly listAddress: ListAddressService,
    private readonly listAllAddresses: ListAllAddressesService,
    private readonly deleteAddress: DeleteAddressService,
  ) {}

  @Post(':user_id')
  async create(
    @Param('user_id')
    user_id: string,
    @Body() data: CreateAddressDTO,
  ): Promise<Address> {
    return this.createAddress.execute(user_id, data);
  }

  @Patch(':user_id')
  async update(
    @Param('user_id')
    user_id: string,
    @Body() data: UpdateAddressDTO,
  ): Promise<Address> {
    return this.updateAddress.execute(user_id, data);
  }

  @Get(':user_id')
  async show(
    @Param('user_id') user_id: string,
    @Query('address_id') address_id: string,
  ): Promise<Address | Address[]> {
    if (!address_id) {
      return this.listAllAddresses.execute(user_id);
    }
    return this.listAddress.execute(user_id, address_id);
  }

  @Delete(':user_id')
  async delete(
    @Param('user_id') user_id: string,
    @Query('address_id') address_id: string,
  ): Promise<Address> {
    return this.deleteAddress.execute(user_id, address_id);
  }
}
