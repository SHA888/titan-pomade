'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  search?: {
    placeholder?: string;
    onSearch: (query: string) => void;
  };
  actions?: {
    label: string;
    onClick: (row: T) => void;
  }[];
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading = false,
  pagination,
  onRowClick,
  search,
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search?.onSearch(searchQuery);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {search && (
          <div className="flex justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                {actions && <TableHead><Skeleton className="h-4 w-20" /></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <div className="flex justify-center">
            <Skeleton className="h-10 w-64" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(search || actions?.some(a => a.label === 'Create')) && (
        <div className="flex justify-between">
          {search && (
            <form onSubmit={handleSearch} className="flex w-64">
              <div className="relative w-full">
                <Input
                  placeholder={search.placeholder || 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </form>
          )}
          <div className="flex space-x-2">
            {actions?.filter(a => a.label === 'Create').map((action, index) => (
              <Button key={index} onClick={() => action.onClick(null as any)}>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.title}</TableHead>
              ))}
              {actions && actions.some(a => a.label !== 'Create') && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow 
                  key={row.id} 
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : String(row[column.key])
                      }
                    </TableCell>
                  ))}
                  {actions && actions.some(a => a.label !== 'Create') && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {actions.filter(a => a.label !== 'Create').map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const startPage = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
                const page = startPage + i;
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => pagination.onPageChange(page)}
                      isActive={pagination.page === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                  className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}