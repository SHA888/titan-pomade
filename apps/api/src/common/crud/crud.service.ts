import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export abstract class CrudService<T, CreateDto, UpdateDto> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  async create(createDto: CreateDto): Promise<T> {
    try {
      // Cast to any to bypass TypeScript checks for dynamic model access
      const model = this.prisma[this.modelName as keyof PrismaClient] as any;
      return await model.create({
        data: createDto as any,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `A record with the provided details already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(
    pagination?: PaginationOptions,
    sort?: SortOptions,
    filters?: FilterOptions,
  ): Promise<PaginationResult<T>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters) {
      Object.keys(filters).forEach((key) => {
        where[key] = filters[key];
      });
    }

    const orderBy: any = sort ? { [sort.field]: sort.order } : {};

    // Cast to any to bypass TypeScript checks for dynamic model access
    const model = this.prisma[this.modelName as keyof PrismaClient] as any;

    const [data, total] = await this.prisma.$transaction([
      model.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      model.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<T> {
    // Cast to any to bypass TypeScript checks for dynamic model access
    const model = this.prisma[this.modelName as keyof PrismaClient] as any;

    const record = await model.findUnique({
      where: { id } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `${this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} not found`,
      );
    }

    return record;
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    try {
      // Cast to any to bypass TypeScript checks for dynamic model access
      const model = this.prisma[this.modelName as keyof PrismaClient] as any;

      const record = await model.update({
        where: { id } as any,
        data: updateDto as any,
      });

      return record;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `${this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} not found`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<T> {
    try {
      // Cast to any to bypass TypeScript checks for dynamic model access
      const model = this.prisma[this.modelName as keyof PrismaClient] as any;

      const record = await model.delete({
        where: { id } as any,
      });

      return record;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `${this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} not found`,
        );
      }
      throw error;
    }
  }
}
