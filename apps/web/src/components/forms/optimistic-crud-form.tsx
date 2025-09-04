'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
}

interface OptimisticCrudFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: unknown) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  initialData?: Record<string, any>;
  className?: string;
  disabled?: boolean;
  mode: 'create' | 'update';
  itemId?: string;
}

export function OptimisticCrudForm({
  fields,
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  initialData = {},
  className,
  disabled = false,
  mode,
  itemId,
}: OptimisticCrudFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    fields.forEach(field => {
      data[field.name] = initialData[field.name] ?? field.defaultValue ?? '';
    });
    return data;
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await onSubmit(formData);
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              disabled={disabled || loading}
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
              required={field.required}
              disabled={disabled || loading}
            />
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2 flex items-center">
            <input
              id={field.name}
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={disabled || loading}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={field.name} className="ml-2">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
          </div>
        );
      
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              disabled={disabled || loading}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading || disabled}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={loading || disabled}>
          {loading ? (mode === 'create' ? 'Creating...' : 'Updating...') : (submitLabel || (mode === 'create' ? 'Create' : 'Update'))}
        </Button>
      </div>
    </form>
  );
}