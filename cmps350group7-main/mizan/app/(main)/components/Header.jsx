import { getCurrentUser } from "@/app/actions/auth";
import styles from "./Header.module.css";
import ClientNavLinks from "./ClientNavLinks";

export default async function Header() {
  // Get current user (if logged in)
  const user = await getCurrentUser();

  return (
    <header className={styles.header}>
      <div className={styles.brandLogo}>Mizān</div>
      <ClientNavLinks user={user} />
    </header>
  );
}
