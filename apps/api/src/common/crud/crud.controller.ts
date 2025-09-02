import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CrudService } from './crud.service';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Controller()
export abstract class CrudController<T, CreateDto, UpdateDto> {
  protected constructor(
    protected readonly crudService: CrudService<T, CreateDto, UpdateDto>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new record' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBody({ type: Object })
  async create(@Body() createDto: CreateDto) {
    return await this.crudService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all records with pagination' })
  @ApiOkResponse({ description: 'Returns all records with pagination.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const pagination = page || limit ? { page, limit } : undefined;
    const sort =
      sortBy && sortOrder ? { field: sortBy, order: sortOrder } : undefined;

    return await this.crudService.findAll(pagination, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID', type: String })
  @ApiOkResponse({ description: 'Returns the record.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async findOne(@Param('id') id: string) {
    return await this.crudService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID', type: String })
  @ApiOkResponse({ description: 'The record has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiBody({ type: Object })
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return await this.crudService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID', type: String })
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async remove(@Param('id') id: string) {
    return await this.crudService.remove(id);
  }
}
