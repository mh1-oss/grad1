import { redirect } from 'next/navigation';

export default function AdminPage() {
    // Redirect /admin to /admin/products since it's the main dashboard area
    redirect('/admin/products');
}
