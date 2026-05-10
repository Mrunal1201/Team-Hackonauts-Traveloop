import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  MapPin, TrendingUp, Hash, Send, X, CheckCheck, Sparkles,
} from 'lucide-react';
import { POSTS, TRAVELERS, TRENDING_TAGS, Post } from './communityData';

// ── Avatar helper ─────────────────────────────────────────────────────────
const Avatar = ({ t, size = 40 }: { t: typeof TRAVELERS[0]; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
    style={{ width: size, height: size, background: t.color, fontSize: size * 0.33 }}
  >
    {t.initials}
  </div>
);

// ── Story ring ─────────────────────────────────────────────────────────────
const StoryRing = ({ t }: { t: typeof TRAVELERS[0] }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    className="flex flex-col items-center gap-1.5 flex-shrink-0"
  >
    <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#F5B041] via-[#E84393] to-[#6C63FF]">
      <div className="p-[2px] bg-white rounded-full">
        <Avatar t={t} size={52} />
      </div>
    </div>
    <span className="text-[10px] text-slate-600 font-medium max-w-[54px] truncate text-center">{t.name.split(' ')[0]}</span>
  </motion.button>
);

// ── Post card ──────────────────────────────────────────────────────────────
const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked]     = useState(post.liked ?? false);
  const [saved, setSaved]     = useState(post.bookmarked ?? false);
  const [likeCount, setLikes] = useState(post.likes);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(p => p + (liked ? -1 : 1));
  };

  const content = expanded ? post.content : post.content.slice(0, 140);
  const needsExpand = post.content.length > 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar t={post.author} size={44} />
            {post.author.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#2A4D3A] rounded-full flex items-center justify-center">
                <CheckCheck size={8} className="text-[#F5B041]" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 text-sm">{post.author.name}</span>
              <span className="text-[10px] bg-[#2A4D3A]/10 text-[#2A4D3A] px-2 py-0.5 rounded-full font-semibold">{post.tripDay}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
              <MapPin size={10} />
              <span>{post.location} {post.flag}</span>
              <span>·</span>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">{post.mood}</span>
          <button className="text-slate-300 hover:text-slate-500 p-1">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3 text-sm text-slate-700 leading-relaxed">
        {content}
        {!expanded && needsExpand && (
          <button onClick={() => setExpanded(true)} className="text-[#2A4D3A] font-semibold ml-1">…more</button>
        )}
      </div>

      {/* Image */}
      <div className="relative mx-4 rounded-2xl overflow-hidden">
        <img src={post.image} alt={post.location} className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {post.hashtags.map(h => (
            <span key={h} className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Engagement bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
          >
            <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount.toLocaleString()}</span>
          </motion.button>
          <button
            onClick={() => setCommenting(p => !p)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#2A4D3A] text-sm font-medium transition-colors"
          >
            <MessageCircle size={19} />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors">
            <Share2 size={17} />
            <span>{post.shares}</span>
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => setSaved(p => !p)}
          className={`transition-colors ${saved ? 'text-[#F5B041]' : 'text-slate-300 hover:text-[#F5B041]'}`}
        >
          <Bookmark size={19} fill={saved ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Comment box */}
      <AnimatePresence>
        {commenting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#2A4D3A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              Me
            </div>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 text-sm bg-slate-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A4D3A]/30 border border-slate-200"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-[#2A4D3A] rounded-full flex items-center justify-center text-[#F5B041] flex-shrink-0"
            >
              <Send size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Compose post box ──────────────────────────────────────────────────────
const ComposeBox = () => {
  const [open, setOpen]     = useState(false);
  const [text, setText]     = useState('');
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    setPosted(true);
    setTimeout(() => { setPosted(false); setText(''); setOpen(false); }, 2000);
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-[#2A4D3A] flex items-center justify-center text-[#F5B041] font-bold text-sm flex-shrink-0">
          You
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-left bg-slate-50 rounded-2xl px-4 py-2.5 text-slate-400 text-sm hover:bg-slate-100 transition-colors"
        >
          Share your travel story… ✈️
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 bg-[#2A4D3A] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#1f3d2d] transition-colors flex-shrink-0"
        >
          <Sparkles size={13} /> Post
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 px-4 pb-4 overflow-hidden"
          >
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tell the world about your latest adventure… 🌍"
              rows={4}
              className="w-full mt-3 text-sm text-slate-700 bg-transparent resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <div className="flex gap-3 text-slate-400">
                {['📍 Location', '🏷️ Tag', '📷 Photo'].map(a => (
                  <button key={a} className="text-xs hover:text-[#2A4D3A] transition-colors font-medium">{a}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOpen(false)} className="text-xs text-slate-400 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                  <X size={14} />
                </button>
                <button
                  onClick={handlePost}
                  className="text-xs bg-[#2A4D3A] text-white font-semibold px-4 py-1.5 rounded-xl hover:bg-[#1f3d2d] transition-colors disabled:opacity-40"
                  disabled={!text.trim()}
                >
                  {posted ? '✓ Posted!' : 'Share'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Feed ─────────────────────────────────────────────────────────────
export const FeedTab: React.FC = () => {
  const [activeTag, setActiveTag] = useState('');

  return (
    <div className="space-y-4">
      {/* Stories */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-1 mb-3">
          <TrendingUp size={14} className="text-[#2A4D3A]" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Stories</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
          {/* Add story */}
          <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#2A4D3A]/30 flex items-center justify-center bg-[#2A4D3A]/5">
              <span className="text-2xl font-thin text-[#2A4D3A]">+</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Your Story</span>
          </motion.button>
          {TRAVELERS.map(t => <StoryRing key={t.id} t={t} />)}
        </div>
      </div>

      {/* Trending hashtags */}
      <div className="flex gap-2 flex-wrap">
        {TRENDING_TAGS.slice(0, 6).map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              activeTag === tag
                ? 'bg-[#2A4D3A] text-white border-[#2A4D3A]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#2A4D3A] hover:text-[#2A4D3A]'
            }`}
          >
            <Hash size={11} />
            {tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Compose */}
      <ComposeBox />

      {/* Posts */}
      {POSTS.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
};
