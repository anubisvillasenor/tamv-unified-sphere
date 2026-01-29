import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/hooks/usePosts';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  CheckCircle2
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard = ({ post, onLike }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  const profile = post.profiles;
  const isVerified = profile?.verification_status === 'verified';

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">
                {profile?.display_name || 'Usuario'}
              </span>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>@{profile?.username || 'unknown'}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.content && (
          <p className="text-foreground whitespace-pre-wrap">
            {post.content.split(/(#\w+)/g).map((part, i) => 
              part.startsWith('#') ? (
                <span key={i} className="text-primary hover:underline cursor-pointer">{part}</span>
              ) : part
            )}
          </p>
        )}
      </div>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className={`grid gap-1 ${post.media_urls.length > 1 ? 'grid-cols-2' : ''}`}>
          {post.media_urls.map((url, i) => (
            <div key={i} className="relative aspect-video bg-muted">
              {post.content_type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-3">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={url}
                  alt="Post media"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {post.hashtags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            <span>{post.like_count + (liked ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span>{post.share_count}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={saved ? 'text-secondary' : 'text-muted-foreground'}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark className={`h-4 w-4 ${saved ? 'fill-secondary' : ''}`} />
        </Button>
      </div>
    </motion.div>
  );
};
