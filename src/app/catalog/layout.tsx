import Navbar from "@/components/Navbar";

export default function CatalogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="catalog-page">
            <Navbar />
            {children}
        </div>
    );
}
