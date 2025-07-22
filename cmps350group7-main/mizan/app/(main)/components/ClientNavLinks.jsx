"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./Header.module.css";

export default function ClientNavLinks({ user }) {
  const searchParams = useSearchParams();
  const semesterId = searchParams.get("semesterId");
  const sectionCRN = searchParams.get("sectionCRN");
  const workloadHref = semesterId
    ? `/workload-report?semesterId=${semesterId}${
        sectionCRN ? `&sectionCRN=${sectionCRN}` : ""
      }`
    : "/workload-report";

  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navigation}>
        <li className={styles.navigationItem}>
          <Link href="/assessments">Assessments</Link>
        </li>
        <li className={styles.navigationItem}>
          <Link href={workloadHref}>Workload Report</Link>
        </li>
      </ul>
      <div className={styles.userArea}>
        {user ? (
          <>
            <span className={styles.userName}>
              🤗 Welcome {user.firstName} {user.lastName}
            </span>{" "}
            (<LogoutButton />)
          </>
        ) : (
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
