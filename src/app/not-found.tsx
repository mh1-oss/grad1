import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-vh-100 text-center animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <h2 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h2>
            <p className="subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Could not find the requested resource</p>
            <Link href="/" className="btn-primary">
                Return Home
            </Link>
        </div>
    );
}
