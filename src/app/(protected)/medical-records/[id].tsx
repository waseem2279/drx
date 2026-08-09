import { fetchMedicalRecord } from "@/api/medicalRecords";
import PageScrollView from "@/components/PageScrollView";
import { TextBold, TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import {
  Allergy,
  Condition,
  MedicalRecord as Rec,
  Medication,
} from "@/types/medicalRecord";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }
  return null;
}

function formatDate(value: unknown, includeTime = false) {
  const date = toDate(value);
  if (!date) return "Not recorded";

  return includeTime
    ? date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
}

function formatListValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "Not recorded";
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TextBold style={styles.sectionTitle}>{title}</TextBold>
        {subtitle ? (
          <TextRegular style={styles.sectionSubtitle}>{subtitle}</TextRegular>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function EmptyRow({ label = "None recorded" }: { label?: string }) {
  return (
    <View style={styles.emptyRow}>
      <Ionicons name="checkmark-circle-outline" size={18} color="#5E7E65" />
      <TextRegular style={styles.emptyText}>{label}</TextRegular>
    </View>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailPill}>
      <TextRegular style={styles.detailPillLabel}>{label}</TextRegular>
      <TextSemiBold selectable style={styles.detailPillValue}>
        {value}
      </TextSemiBold>
    </View>
  );
}

function CountBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "blue" | "green" | "amber";
}) {
  const color = badgeColors[tone];

  return (
    <View style={[styles.countBadge, { backgroundColor: color.background }]}>
      <TextBold style={[styles.countNumber, { color: color.foreground }]}>
        {count}
      </TextBold>
      <TextRegular style={styles.countLabel}>{label}</TextRegular>
    </View>
  );
}

function MedicationRow({ medication }: { medication: Medication }) {
  const details = [
    medication.dosage,
    medication.route,
    [medication.frequency, medication.interval].filter(Boolean).join("/"),
  ].filter(Boolean);

  return (
    <View style={styles.recordRow}>
      <View style={styles.rowIcon}>
        <Ionicons name="medical-outline" size={18} color={Colors.light.tint} />
      </View>
      <View style={styles.rowBody}>
        <TextSemiBold selectable style={styles.rowTitle}>
          {medication.name || "Unnamed medication"}
        </TextSemiBold>
        <TextRegular selectable style={styles.rowDetail}>
          {details.length ? details.join(" • ") : "Details not recorded"}
        </TextRegular>
      </View>
    </View>
  );
}

function AllergyRow({ allergy }: { allergy: Allergy }) {
  return (
    <View style={styles.recordRow}>
      <View style={[styles.rowIcon, styles.warningIcon]}>
        <Ionicons name="alert-circle-outline" size={18} color="#9A5B00" />
      </View>
      <View style={styles.rowBody}>
        <TextSemiBold selectable style={styles.rowTitle}>
          {allergy.name || "Unnamed allergy"}
        </TextSemiBold>
        <TextRegular selectable style={styles.rowDetail}>
          {allergy.reaction || "Reaction not recorded"}
        </TextRegular>
      </View>
    </View>
  );
}

function ConditionRow({ condition }: { condition: Condition }) {
  const facts = [
    condition.status ? `Status: ${condition.status}` : null,
    condition.severity ? `Severity: ${condition.severity}` : null,
    condition.onsetDate ? `Onset: ${formatDate(condition.onsetDate)}` : null,
  ].filter(Boolean);

  return (
    <View style={styles.recordRow}>
      <View style={styles.rowIcon}>
        <Ionicons name="pulse-outline" size={18} color={Colors.light.tint} />
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTitleLine}>
          <TextSemiBold selectable style={styles.rowTitle}>
            {condition.name || "Unnamed condition"}
          </TextSemiBold>
          {condition.status ? (
            <View style={styles.statusChip}>
              <TextRegular style={styles.statusChipText}>
                {condition.status}
              </TextRegular>
            </View>
          ) : null}
        </View>
        {condition.description ? (
          <TextRegular selectable style={styles.rowDetail}>
            {condition.description}
          </TextRegular>
        ) : null}
        {facts.length ? (
          <TextRegular selectable style={styles.rowMeta}>
            {facts.join(" • ")}
          </TextRegular>
        ) : null}
        {condition.treatment ? (
          <TextRegular selectable style={styles.rowMeta}>
            Treatment: {condition.treatment}
          </TextRegular>
        ) : null}
        {condition.notes || condition.comments ? (
          <TextRegular selectable style={styles.rowMeta}>
            Notes: {condition.notes || condition.comments}
          </TextRegular>
        ) : null}
      </View>
    </View>
  );
}

function SimpleList({ items }: { items?: unknown[] }) {
  if (!items?.length) return <EmptyRow />;

  return (
    <View style={styles.simpleList}>
      {items.map((item, index) => (
        <View key={`${formatListValue(item)}-${index}`} style={styles.simpleRow}>
          <View style={styles.bullet} />
          <TextRegular selectable style={styles.simpleText}>
            {formatListValue(item)}
          </TextRegular>
        </View>
      ))}
    </View>
  );
}

const MedicalRecord = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<Rec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMedicalRecord(id as string);
        setRecord(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch medical record");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRecord();
  }, [id]);

  const medications = record?.medications ?? [];
  const allergies = record?.allergies ?? [];
  const conditions = record?.conditions ?? [];
  const patientName = [record?.firstName, record?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <PageScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <TextSemiBold style={styles.errorText}>{error}</TextSemiBold>
        </View>
      ) : record ? (
        <View style={styles.content}>
          <View style={styles.summary}>
            <View style={styles.documentSeal}>
              <Ionicons name="document-text-outline" size={26} color="#fff" />
            </View>
            <View style={styles.summaryCopy}>
              <TextRegular style={styles.eyebrow}>Patient Chart</TextRegular>
              <TextBold selectable style={styles.patientName}>
                {patientName || "Patient name not recorded"}
              </TextBold>
              <TextRegular selectable style={styles.updatedText}>
                Last updated {formatDate(record.updatedAt, true)}
              </TextRegular>
            </View>
          </View>

          <View style={styles.identityGrid}>
            <DetailPill
              label="Patient ID"
              value={record.patientId || String(id) || "Not recorded"}
            />
            <DetailPill
              label="Date of Birth"
              value={formatDate(record.dateOfBirth)}
            />
            <DetailPill label="Gender" value={record.gender || "Not recorded"} />
            <DetailPill label="Created" value={formatDate(record.createdAt)} />
          </View>

          <View style={styles.countRow}>
            <CountBadge
              label="Medications"
              count={medications.length}
              tone="blue"
            />
            <CountBadge label="Allergies" count={allergies.length} tone="amber" />
            <CountBadge label="Conditions" count={conditions.length} tone="green" />
          </View>

          <Section
            title="Medications"
            subtitle="Active entries recorded in this chart"
          >
            {medications.length ? (
              medications.map((medication) => (
                <MedicationRow key={medication.id} medication={medication} />
              ))
            ) : (
              <EmptyRow label="No medications recorded" />
            )}
          </Section>

          <Section title="Allergies" subtitle="Known allergy reactions">
            {allergies.length ? (
              allergies.map((allergy) => (
                <AllergyRow key={allergy.id} allergy={allergy} />
              ))
            ) : (
              <EmptyRow label="No allergies recorded" />
            )}
          </Section>

          <Section title="Conditions" subtitle="Diagnoses and active history">
            {conditions.length ? (
              conditions.map((condition) => (
                <ConditionRow key={condition.id} condition={condition} />
              ))
            ) : (
              <EmptyRow label="No conditions recorded" />
            )}
          </Section>

          <Section title="Preventive Care">
            <View style={styles.twoColumn}>
              <View style={styles.columnBlock}>
                <TextSemiBold style={styles.columnTitle}>Screenings</TextSemiBold>
                <SimpleList items={record.screenings} />
              </View>
              <View style={styles.columnBlock}>
                <TextSemiBold style={styles.columnTitle}>Vaccinations</TextSemiBold>
                <SimpleList items={record.vaccinations} />
              </View>
            </View>
          </Section>

          <Section title="Health History">
            <View style={styles.historyList}>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>Personal</TextSemiBold>
                <SimpleList items={record.personalHistory} />
              </View>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>Surgical</TextSemiBold>
                <SimpleList items={record.surgicalHistory} />
              </View>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>Family</TextSemiBold>
                <SimpleList items={record.familyHistory} />
              </View>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>Social</TextSemiBold>
                <SimpleList items={record.socialHistory} />
              </View>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>
                  {"Women's Health"}
                </TextSemiBold>
                <SimpleList items={record.womenHealth} />
              </View>
              <View style={styles.historyGroup}>
                <TextSemiBold style={styles.columnTitle}>Notes</TextSemiBold>
                <SimpleList items={record.notes} />
              </View>
            </View>
          </Section>
        </View>
      ) : (
        <View style={styles.centerState}>
          <TextRegular>{t("error.no-record-found")}</TextRegular>
        </View>
      )}
    </PageScrollView>
  );
};

export default MedicalRecord;

const badgeColors = {
  blue: {
    background: "#EEF4FF",
    foreground: "#325B9A",
  },
  green: {
    background: "#EEF8F1",
    foreground: "#2D6940",
  },
  amber: {
    background: "#FFF6E8",
    foreground: "#8A5A00",
  },
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  centerState: {
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: Colors.red,
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    gap: 18,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D8E1EE",
    backgroundColor: "#F7FAFF",
    borderRadius: 8,
    borderCurve: "continuous",
  },
  documentSeal: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCopy: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    color: "#5D6978",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  patientName: {
    fontSize: 22,
    lineHeight: 28,
  },
  updatedText: {
    color: Colors.grey,
    fontSize: 13,
  },
  identityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detailPill: {
    width: "48.5%",
    minHeight: 76,
    padding: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    borderCurve: "continuous",
    backgroundColor: "#fff",
  },
  detailPillLabel: {
    color: Colors.grey,
    fontSize: 12,
  },
  detailPillValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  countRow: {
    flexDirection: "row",
    gap: 10,
  },
  countBadge: {
    flex: 1,
    minHeight: 72,
    justifyContent: "center",
    gap: 3,
    padding: 12,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  countNumber: {
    fontSize: 22,
    fontVariant: ["tabular-nums"],
  },
  countLabel: {
    color: Colors.grey,
    fontSize: 12,
  },
  section: {
    gap: 10,
    paddingTop: 4,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  sectionSubtitle: {
    color: Colors.grey,
    fontSize: 13,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    borderCurve: "continuous",
    backgroundColor: "#fff",
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },
  warningIcon: {
    backgroundColor: "#FFF6E8",
  },
  rowBody: {
    flex: 1,
    gap: 5,
  },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
  },
  rowDetail: {
    color: "#3E4650",
    fontSize: 14,
    lineHeight: 20,
  },
  rowMeta: {
    color: Colors.grey,
    fontSize: 13,
    lineHeight: 18,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF8F1",
  },
  statusChipText: {
    color: "#2D6940",
    fontSize: 11,
    textTransform: "capitalize",
  },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DCE7DE",
    borderRadius: 8,
    borderCurve: "continuous",
    backgroundColor: "#F8FCF9",
  },
  emptyText: {
    color: "#4F6253",
    fontSize: 14,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 10,
  },
  columnBlock: {
    flex: 1,
    gap: 8,
  },
  columnTitle: {
    fontSize: 14,
    color: "#2A2E33",
  },
  simpleList: {
    gap: 8,
  },
  simpleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: Colors.light.tint,
  },
  simpleText: {
    flex: 1,
    color: "#3E4650",
    fontSize: 14,
    lineHeight: 20,
  },
  historyList: {
    gap: 14,
  },
  historyGroup: {
    gap: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
});
