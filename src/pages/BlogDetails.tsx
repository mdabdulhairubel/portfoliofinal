
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { BlogPost, Profile } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data: profileData } = await supabase.from('profile').select('*').maybeSingle();
        if (profileData) setProfile(profileData);

        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Thoughts</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                <span className="flex items-center gap-1.5"><Tag size={12} /> {post.category}</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="flex items-center gap-1.5 text-slate-500"><Clock size={12} /> {post.read_time}</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="flex items-center gap-1.5 text-slate-500"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                {post.title}
              </h1>
            </div>

            <div className="aspect-[21/9] rounded-[40px] overflow-hidden border border-white/5 bg-white/5">
              <img 
                src={post.image_url} 
                className="w-full h-full object-cover" 
                alt={post.title} 
              />
            </div>

            <div className="prose prose-invert max-w-none">
              <div 
                className="text-slate-400 text-lg leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.div>
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default BlogDetails;
