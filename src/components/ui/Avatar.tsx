interface Props { name: string; size?: number; gradient?: string }

export default function Avatar({ name, size = 40, gradient }: Props) {
    const initials = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className="avatar" style={{
            width: size, height: size,
            fontSize: size * 0.36,
            background: gradient || 'var(--cta-grad)',
        }}>
            {initials}
        </div>
    );
}