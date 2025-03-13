import DisplayLayout from "@/app/layout/displayLayout";

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DisplayLayout title="關於山社">
            {children}
        </DisplayLayout>
    );
}