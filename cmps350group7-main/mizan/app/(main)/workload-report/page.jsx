import WorkloadSummary from "./components/WorkloadSummary";
import { getAssessmentSummary } from "@/app/actions/assessments";
import styles from "./report.module.css";

export default async function ReportPage({ searchParams }) {
  const { semesterId, sectionCRN } = searchParams;
  const workloadSummary = await getAssessmentSummary(semesterId, sectionCRN);
  return (
    <main className={styles.reportContainer}>
      <WorkloadSummary workloadSummary={workloadSummary} />
    </main>
  );
}
