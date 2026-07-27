export const dynamic = "force-dynamic";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/categoria", label: "Categorías" }, { href: "/pedido", label: "Pedidos" }, { href: "/producto", label: "Productos" }, { href: "/usuario", label: "Usuarios" }];

export const metadata = { title: "Farmacia SaludTotal", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppShell items={NAV} title="Farmacia SaludTotal">{children}</AppShell>
      </body>
    </html>
  );
}
