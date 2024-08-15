import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import { Medication } from '@/lib/data';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  logoContainer: {
    paddingBottom: 30,
  },
  logo: {
    width: 60,
    height: 20,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#430d19',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#430d19',
    borderBottomColor: '#430d19',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#430d19',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#430d19',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

type Props = {
  medications: Medication[];
};

export function MedInfoDocument({ medications }: Props) {
  const sortedMeds = medications.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Medication List</Text>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src="./MediTrakLogo.png" />
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Medication</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Dosage</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Form</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Notes</Text>
              </View>
            </View>
            {sortedMeds.map((med) => (
              <View key={med.medicationId} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{med.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{med.dosage}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{med.form}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{med.notes}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </>
  );
}
