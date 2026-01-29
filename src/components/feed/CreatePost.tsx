import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Sparkles, 
  X,
  Upload,
  Loader2
} from 'lucide-react';

interface CreatePostProps {
  onPost: (content: string, mediaUrls?: string[], contentType?: string) => Promise<{ error: Error | null }>;
}

export const CreatePost = ({ onPost }: CreatePostProps) => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews: string[] = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newPreviews.push(URL.createObjectURL(file));
      }
    }
    
    setMediaFiles(prev => [...prev, ...files]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<string[]> => {
    if (!user || mediaFiles.length === 0) return [];
    
    setUploading(true);
    const urls: string[] = [];
    
    try {
      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
        
        urls.push(data.publicUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir archivo',
        description: 'No se pudo subir el archivo. Intenta de nuevo.'
      });
    } finally {
      setUploading(false);
    }
    
    return urls;
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    
    setPosting(true);
    
    try {
      let mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await uploadMedia();
      }
      
      const contentType = mediaFiles.some(f => f.type.startsWith('video/')) ? 'video' 
        : mediaFiles.some(f => f.type.startsWith('image/')) ? 'image' 
        : 'text';
      
      const { error } = await onPost(content, mediaUrls.length > 0 ? mediaUrls : undefined, contentType);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo publicar. Intenta de nuevo.'
        });
      } else {
        setContent('');
        setMediaFiles([]);
        mediaPreviews.forEach(url => URL.revokeObjectURL(url));
        setMediaPreviews([]);
        toast({ title: '¡Publicado!', description: 'Tu contenido está visible en el feed.' });
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4"
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="¿Qué está pasando en tu dimensión digital?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none border-none bg-transparent focus-visible:ring-0 p-0 text-foreground placeholder:text-muted-foreground"
          />
          
          {/* Media Previews */}
          <AnimatePresence>
            {mediaPreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary">
                <Music className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="tamv"
              size="sm"
              onClick={handleSubmit}
              disabled={(!content.trim() && mediaFiles.length === 0) || posting || uploading}
              className="gap-2"
            >
              {(posting || uploading) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {uploading ? 'Subiendo...' : posting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
