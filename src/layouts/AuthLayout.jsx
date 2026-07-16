/**
 * AuthLayout membungkus halaman Login/Register dengan background
 * gradient + dua lingkaran blur ("atmosphere") sesuai desain Figma.
 */
export default function AuthLayout({ children }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 py-12 md:py-16 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgb(247, 249, 251) 0%, rgb(247, 249, 251) 100%)',
      }}
    >

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-16 -top-24 size-[500px] rounded-full bg-[rgba(0,74,198,0.05)] blur-3xl" />
        <div className="absolute -left-16 bottom-0 size-[400px] rounded-full bg-[rgba(0,81,177,0.05)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">{children}</div>
    </div>
  );
}
