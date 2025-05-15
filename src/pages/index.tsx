import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import axios from '@/axios';
import StoryCard from '@/components/StoryCard';
import StoryModal from '@/components/StoryModal';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export default function Copi() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 3;

  const fetchPosts = async (searchTerm = '', page = 1) => {
    try {
      const offset = (page - 1) * postsPerPage;

      const response = await axios.get('/posts', {
        params: {
          search: searchTerm,
          limit: postsPerPage,
          offset: offset,
        },
      });
      setPosts(response.data.posts);
      setTotalPosts(response.data.total);
    } catch (err) {
      setError(
        'Error fetching posts: ' +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setForm({ title: '', content: '' });
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  const editPost = (post: Post) => {
    setForm({ title: post.title, content: post.content });
    setIsEdit(true);
    setEditingId(post.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ title: '', content: '' });
    setEditingId(null);
    setIsEdit(false);
    setErrors({ title: '', content: '' });
  };

  const handleSubmit = async () => {
    const newErrors: { title: string; content: string } = {
      title: '',
      content: '',
    };

    if (!form.title.trim()) {
      newErrors.title = 'Favorite coffee is required.';
    }
    if (!form.content.trim()) {
      newErrors.content = 'Your story is required.';
    }

    if (newErrors.title || newErrors.content) {
      setErrors(newErrors);
      return;
    }
    try {
      const method = isEdit ? 'patch' : 'post';
      const url = isEdit ? `/posts/${editingId}` : '/posts';

      const timestamp = new Date().toISOString();
      const payload = {
        ...form,
        updated_at: isEdit ? timestamp : null,
        created_at: isEdit ? undefined : timestamp,
      };

      const res = await axios[method](url, payload);

      if (res.status >= 200 && res.status < 300) {
        closeModal();
        await fetchPosts(); // Reload posts after submit
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await axios.delete(`/posts/${id}`);

      await fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Copi</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center overflow-hidden border-solid bg-[#EADBC8] p-6 text-[#4B3C2F]">
        <div className="mb-6 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-5xl font-extrabold drop-shadow">COPI</h1>
          <button
            onClick={openCreateModal}
            className="text-md flex items-center gap-2 rounded-full bg-[#4B3C2F] px-5 py-2 text-white shadow-md transition hover:bg-[#3a2f26] md:text-base"
          >
            <PencilSquareIcon className="h-6 w-6 text-white" />
            <span className="hidden sm:inline"> Share Story</span>
          </button>
        </div>

        <div className="relative mb-6 w-full max-w-3xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4B3C2F]" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-md w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-[#4B3C2F] placeholder:text-gray-400 focus:border-[#4B3C2F] focus:outline-none focus:ring-1 focus:ring-[#4B3C2F]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B3C2F] hover:text-[#2e241b]"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center text-[#4B3C2F]">Loading...</p>
          </div>
        )}
        {error && (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center text-[#4B3C2F]">
              {searchTerm
                ? 'No coffee stories match your search.'
                : 'No coffee stories have been posted yet.'}
            </p>
          </div>
        )}

        {posts.map((post) => (
          <StoryCard
            key={post.id}
            post={post}
            editPost={editPost}
            deletePost={deletePost}
          />
        ))}

        <StoryModal
          show={showModal}
          isEdit={isEdit}
          form={form}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          errors={errors}
        />

        {totalPosts > postsPerPage && (
          <div className="mt-4 flex w-full justify-center">
            <div className="flex w-full max-w-3xl justify-end space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-full bg-[#f3efea] px-3 py-1.5 text-sm text-[#4B3C2F] hover:bg-[#e4d6c7] disabled:opacity-30"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Prev
              </button>

              {[...Array(Math.ceil(totalPosts / postsPerPage))].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                      currentPage === index + 1
                        ? 'bg-[#4B3C2F] text-white shadow'
                        : 'bg-[#f9f5f1] text-[#4B3C2F] hover:bg-[#e4d6c7]'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(totalPosts / postsPerPage))
                  )
                }
                disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
                className="flex items-center gap-1 rounded-full bg-[#f3efea] px-3 py-1.5 text-sm text-[#4B3C2F] hover:bg-[#e4d6c7] disabled:opacity-30"
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
