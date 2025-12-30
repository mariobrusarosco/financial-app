import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import type { I_CreateVendorRequest, I_Vendor } from '../types/types-and-interfaces';
import { Loader2 } from 'lucide-react';

const nameSchema = z.string().min(1, 'Vendor name is required.');
const urlSchema = z.string().url('Please enter a valid URL.').optional().or(z.literal(''));

interface VendorFormProps {
  initialValues?: I_Vendor;
  onSubmit: (values: I_CreateVendorRequest) => void;
  isLoading: boolean;
  isEditMode: boolean;
}

export const VendorForm = ({ initialValues, onSubmit, isLoading, isEditMode }: VendorFormProps) => {
  const form = useForm({
    defaultValues: {
      name: initialValues?.name || '',
      logo_url: initialValues?.logo_url || '',
      website: initialValues?.website || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => nameSchema.safeParse(value).success ? undefined : nameSchema.safeParse(value).error?.issues[0].message,
        }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Vendor Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
            )}
          </div>
        )}
      />

      <form.Field
        name="logo_url"
        validators={{
          onChange: ({ value }) => urlSchema.safeParse(value).success ? undefined : urlSchema.safeParse(value).error?.issues[0].message,
        }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Logo URL (Optional)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            {field.state.meta.errors.length > 0 && (
              <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
            )}
          </div>
        )}
      />

      <form.Field
        name="website"
        validators={{
          onChange: ({ value }) => urlSchema.safeParse(value).success ? undefined : urlSchema.safeParse(value).error?.issues[0].message,
        }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Website (Optional)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="https://example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
            )}
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !form.state.canSubmit}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Save Changes' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
};
