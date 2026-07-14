export default function SocialAuthOptions() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative flex items-center justify-center w-full">
        <div className="border-t border-auth-card w-full" />
        <span className="absolute bg-white px-4 text-[11px] font-medium tracking-[1.1px] uppercase text-auth-label">
          Atau Lanjutkan Dengan
        </span>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          className="flex items-center justify-center gap-3 w-full border border-auth-border rounded-lg px-[17px] py-[11px] text-[13.5px] font-medium text-[#191c1e] hover:bg-auth-input transition-colors"
        >
          {/* Placeholder logo Google — ganti dengan asset resmi Google */}
          <span className="size-5 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500" />
          Masuk dengan Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-[13.5px] font-medium text-auth-primary hover:bg-auth-input transition-colors"
        >
          Mode Tamu (Anonim)
        </button>
      </div>
    </div>
  );
}
