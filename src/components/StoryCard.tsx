import { useState, useRef, useEffect } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface Props {
  post: Post;
  editPost: (post: Post) => void;
  deletePost: (post: number) => void;
}

export default function StoryCard({ post, editPost, deletePost }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr)
      .toLocaleString('en-US', {
        timeZone: 'UTC', // Use UTC, so no shift
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', '');
  };

  return (
    <div className="relative mb-4 w-full max-w-3xl rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-lg">
      <div
        className="absolute right-4 top-4 cursor-pointer text-[#4B3C2F]"
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
      >
        <EllipsisHorizontalIcon className="h-6 w-6 text-[#4B3C2F]" />

        {dropdownOpen && (
          <div
            className="absolute right-0 z-10 mt-2 overflow-hidden rounded-xl border bg-white text-sm shadow"
            ref={dropdownRef}
          >
            <button
              onClick={() => editPost(post)}
              className="block w-full px-4 py-2 text-left hover:bg-[#f3efea]"
            >
              Edit
            </button>
            <button
              onClick={() => deletePost(post.id)}
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-[#f3efea]"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Title & Date */}
      <h2 className="mb-1 pr-10 text-xl font-bold tracking-tight">
        {post.title}
      </h2>
      <p className="mb-3 text-xs italic text-[#4B3C2F] opacity-60">
        {post.updated_at
          ? 'Updated: ' + formatDate(post.updated_at)
          : 'Posted: ' + formatDate(post.created_at)}
      </p>

      {/* Content */}
      <p className="text-base font-medium leading-relaxed">
        {isExpanded || post.content.length <= 200
          ? post.content
          : post.content.slice(0, 200) + '...'}
      </p>

      {post.content.length > 200 && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-sm text-[#4B3C2F] transition hover:text-[#6a4c35] hover:underline"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
}
