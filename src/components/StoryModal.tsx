import React from 'react';

type FormData = {
  title: string;
  content: string;
};

type StoryModalProps = {
  show: boolean;
  isEdit: boolean;
  form: FormData;
  errors: {
    title: string;
    content: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function StoryModal({
  show,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
  errors,
}: StoryModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-10 lg:p-4">
      <div className="w-full max-w-md scale-100 rounded-3xl bg-[#f9f5f1] p-8 shadow-2xl transition-all duration-300">
        <h2 className="mb-6 text-center text-xl font-semibold text-[#4B3C2F]">
          {isEdit ? 'Edit Your Coffee Story' : 'Share Your Coffee Story'}
        </h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-[#4B3C2F]">
            Favorite Coffee
          </label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={onChange}
            placeholder="e.g., Spanish Latte"
            className="w-full rounded-lg border border-[#4B3C2F] bg-white px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4B3C2F]/40"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-[#4B3C2F]">
            Your Story
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={onChange}
            rows={4}
            placeholder="How does coffee help you cope?"
            className="w-full resize-none rounded-lg border border-[#4B3C2F] bg-white px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4B3C2F]/40"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-[#4B3C2F] px-5 py-2 text-sm text-[#4B3C2F] transition hover:bg-[#eae3da]"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-full bg-[#4B3C2F] px-5 py-2 text-sm text-white transition hover:bg-[#3a2f26]"
          >
            {isEdit ? 'Update' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
