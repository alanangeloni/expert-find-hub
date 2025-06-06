
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface HeadshotUploadProps {
  currentHeadshotUrl?: string;
  onHeadshotChange: (url: string | null) => void;
}

export function HeadshotUpload({ currentHeadshotUrl, onHeadshotChange }: HeadshotUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentHeadshotUrl || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (JPEG, PNG, or WebP)',
          variant: 'destructive'
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive'
        });
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('advisor-headshots')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('advisor-headshots')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onHeadshotChange(publicUrl);
      
      toast({
        title: 'Headshot uploaded successfully'
      });

    } catch (error: any) {
      console.error('Error uploading headshot:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveHeadshot = () => {
    setPreviewUrl(null);
    onHeadshotChange(null);
  };

  return (
    <div className="space-y-4">
      <Label>Headshot</Label>
      
      {previewUrl ? (
        <div className="relative w-32 h-32">
          <img
            src={previewUrl}
            alt="Advisor headshot"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveHeadshot}
          >
            <X className="h-3 w-3" />
          </Button>
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
          disabled={uploading}
          className="w-fit"
        />
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
      </div>
    </div>
  );
}
