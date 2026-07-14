const VARIANTS = {
  primary:
    'bg-primary text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:bg-primary/90',
  secondary: 'bg-surface-soft border border-border text-primary hover:bg-surface-tint',
  onDark: 'bg-white text-primary shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] hover:bg-white/90',
  outlineOnDark: 'border border-white/30 text-white hover:bg-white/10',
};

const SIZES = {
  md: 'px-8 py-[16.5px] text-sm rounded-xl2',
  lg: 'px-10 py-[20.5px] text-sm rounded-xl2',
};

/**
 * Button reusable. Dipakai di Landing Page, Auth, dan halaman lain.
 * Props:
 * - variant: 'primary' | 'secondary' | 'onDark' | 'outlineOnDark'
 * - size: 'md' | 'lg'
 * - as: render sebagai elemen lain, misal 'a' untuk Link
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center font-medium tracking-[0.14px] transition-colors duration-150 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
