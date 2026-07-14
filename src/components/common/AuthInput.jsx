/**
 * Input reusable untuk form Auth. Styling mengikuti desain Figma
 * halaman Autentikasi (bg #f2f4f6, border #c3c6d7).
 * Props tambahan (mis. rightSlot) untuk ikon show/hide password.
 */
export default function AuthInput({ label, rightSlot, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-[13px] font-medium text-auth-muted">{label}</label>}
      <div className="relative w-full">
        <input
          className={`w-full bg-auth-input border border-auth-border rounded-lg px-[17px] py-[13px] text-[13.5px] font-medium text-auth-muted placeholder:text-auth-muted focus:outline-none focus:ring-2 focus:ring-auth-primary/30 ${className}`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
