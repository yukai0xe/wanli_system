import DisplayLayout from "@/app/layout/displayLayout";

export default function FaqLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DisplayLayout title="FAQ">
            {children}
        </DisplayLayout>
    );
}