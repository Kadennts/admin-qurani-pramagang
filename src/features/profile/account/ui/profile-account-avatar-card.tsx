import Image from "next/image";
import { Camera } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

export function ProfileAccountAvatarCard({
  avatar,
  displayName,
  fileInputRef,
  isEditing,
  onPhotoChange,
  onPickPhoto,
  photoHint,
  changePhotoLabel,
}: {
  avatar: string;
  displayName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isEditing: boolean;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPickPhoto: () => void;
  photoHint: string;
  changePhotoLabel: string;
}) {
  const avatarSrc = avatar || "/img/profile admin.jpg";

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Image
            src={avatarSrc}
            alt={displayName}
            fill
            sizes="128px"
            className="object-cover"
            suppressHydrationWarning
            unoptimized={avatarSrc.startsWith("data:")}
          />

          {isEditing ? (
            <button
              type="button"
              onClick={onPickPhoto}
              className="absolute right-2 bottom-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-colors hover:bg-emerald-700"
            >
              <Camera size={18} />
            </button>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoChange}
        />

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {photoHint}
        </p>
        {isEditing ? (
          <button
            type="button"
            onClick={onPickPhoto}
            className="mt-4 w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
          >
            {changePhotoLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
