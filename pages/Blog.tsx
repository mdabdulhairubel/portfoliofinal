
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Profile, BlogPost } from '../types';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: profileData } = await supabase.from('profile').select('*').maybeSingle();
        if (profileData) setProfile(profileData);

        const { data: blogsData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (blogsData) setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h1 className="text-6xl font-extrabold text-white mb-6">Thoughts <span className="text-primary-500">& Insights.</span></h1>
            <p className="text-slate-500 text-lg">Exploring the intersection of motion, design, and technology.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {blogs.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id}>
                  <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-video rounded-[40px] overflow-hidden mb-6 border border-white/5 relative bg-white/5">
                      <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-black uppercase tracking-widest text-sm z-10">Read Article</div>
                      {post.image_url ? (
                        <img src={post.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={post.title} />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{post.category} • {post.read_time}</span>
                      <h2 className="text-3xl font-bold text-white group-hover:text-primary-500 transition-colors">{post.title}</h2>
                      <p className="text-slate-500 leading-relaxed line-clamp-3">{stripHtml(post.content)}</p>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">No blog posts found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Blog;
