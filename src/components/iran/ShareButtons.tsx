import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  text: string;
  sectionId?: string;
  className?: string;
}

export const ShareButtons = ({ title, text, sectionId, className }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return sectionId ? `${baseUrl}#${sectionId}` : baseUrl;
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider mr-1">
        Share:
      </span>
      <button
        onClick={shareToTwitter}
        className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        title="Share on X/Twitter"
      >
        <Twitter size={14} />
      </button>
      <button
        onClick={shareToLinkedIn}
        className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin size={14} />
      </button>
      <button
        onClick={copyLink}
        className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        title="Copy link"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Link2 size={14} />}
      </button>
    </div>
  );
};

export default ShareButtons;
