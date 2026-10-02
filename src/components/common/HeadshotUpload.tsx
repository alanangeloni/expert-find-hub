import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface HeadshotUploadProps {
  currentHeadshotUrl?: string | null;
  onHeadshotChange: (url: string | null) => void;
  disabled?: boolean;
  label?: string;
}

export function HeadshotUpload({
  currentHeadshotUrl,
  onHeadshotChange,
  disabled = false,
  label = 'Headshot',
}: HeadshotUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentHeadshotUrl || null);

  useEffect(() => {
    setPreviewUrl(currentHeadshotUrl || null);
  }, [currentHeadshotUrl]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (JPEG, PNG, or WebP)',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: 'Sign in required',
          description: 'You must be signed in to upload a headshot.',
          variant: 'destructive',
        });
        return;
      }

      // Own-path convention: {auth.uid()}/{filename} — required for non-admin storage RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('advisor-headshots')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('advisor-headshots').getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onHeadshotChange(publicUrl);

      toast({
        title: 'Headshot uploaded successfully',
      });
    } catch (error: unknown) {
      console.error('Error uploading headshot:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Upload failed',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Allow re-selecting the same file
      event.target.value = '';
    }
  };

  const handleRemoveHeadshot = () => {
    if (disabled) return;
    setPreviewUrl(null);
    onHeadshotChange(null);
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {previewUrl ? (
        <div className="relative w-32 h-32">
          <img
            src={previewUrl}
            alt="Advisor headshot"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveHeadshot}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-6 w-6 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-1">No headshot</p>
          </div>
        </div>
      )}

      <div>
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          disabled={uploading || disabled}
          className="w-fit"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        <p className="text-xs text-muted-foreground mt-1">
          JPEG, PNG, or WebP · max 5MB
        </p>
      </div>
    </div>
  );
}
