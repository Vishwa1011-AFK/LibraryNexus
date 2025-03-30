import { SiteHeader } from "@/components/site-header";
import { AdminBookForm } from "@/components/admin-book-form";

export default function AddNewBookPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <AdminBookForm mode="add" />
            </main>
        </div>
    );
}