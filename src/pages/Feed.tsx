import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import { TrendingSidebar } from '@/components/feed/TrendingSidebar';
import { IsabellaWidget } from '@/components/isabella/IsabellaWidget';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';

const Feed = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, createPost, likePost, refetch } = usePosts();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Isabella Widget */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <IsabellaWidget />
            </div>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            <CreatePost onPost={createPost} />
            
            {postsLoading && posts.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No hay publicaciones aún. ¡Sé el primero en compartir!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PostCard post={post} onLike={() => likePost(post.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Trending */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <TrendingSidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Feed;
