import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LogOut, Camera, X, CheckSquare, Square, ChevronDown } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportContext';
import { Building, Floor, IncidentType, Student } from '@/types';
import { BUILDINGS, FLOORS, INCIDENT_TYPES } from '@/constants/school';
import colors from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';

export default function StudentReportScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { createReport, isCreatingReport } = useReports();

  const student = currentUser as Student;

  const [reportingForSelf, setReportingForSelf] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [victimName, setVictimName] = useState('');
  const [building, setBuilding] = useState('A' as Building);
  const [floor, setFloor] = useState('1st' as Floor);
  const [room, setRoom] = useState('');
  const [incidentType, setIncidentType] = useState('bullying' as IncidentType);
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [cantRememberDateTime, setCantRememberDateTime] = useState(false);
  const [photoEvidence, setPhotoEvidence] = useState(undefined as string | undefined);
  
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);
  const [showFloorPicker, setShowFloorPicker] = useState(false);
  const [showIncidentPicker, setShowIncidentPicker] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoEvidence(result.assets[0].uri);
    }
  };

  const handleSubmitReport = () => {
    if (!victimName.trim()) {
      Alert.alert('Required Field', 'Please enter the name of the student being bullied.');
      return;
    }

    if (!room.trim()) {
      Alert.alert('Required Field', 'Please enter the room/section.');
      return;
    }

    if (!student) return;

    createReport({
      reporterId: student.id,
      reporterName: student.fullName,
      reporterLRN: student.lrn,
      reporterGradeLevelId: student.gradeLevelId,
      reporterSectionId: student.sectionId,
      reporterPhoto: student.profilePhoto,
      isAnonymous,
      victimName: victimName.trim(),
      location: {
        building,
        floor,
        room: room.trim(),
      },
      incidentType,
      description: description.trim(),
      dateTime: cantRememberDateTime ? undefined : dateTime.trim(),
      cantRememberDateTime,
      photoEvidence,
      reportingForSelf,
    });

    Alert.alert(
      'Report Submitted',
      'Your incident report has been submitted successfully. Thank you for making our school safer.',
      [
        {
          text: 'OK',
          onPress: () => {
            setVictimName('');
            setBuilding('A');
            setFloor('1st');
            setRoom('');
            setIncidentType('bullying');
            setDescription('');
            setDateTime('');
            setCantRememberDateTime(false);
            setPhotoEvidence(undefined);
            setReportingForSelf(true);
            setIsAnonymous(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.name}>{currentUser?.fullName}</Text>
        </View>
        <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.replace('/selector')}
                >
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Report an Incident</Text>
          <Text style={styles.subtitle}>
            Your report helps keep our school safe. All information is handled with care.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who is this report for?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setReportingForSelf(true)}
              >
                {reportingForSelf ? (
                  <CheckSquare size={24} color={colors.primary} />
                ) : (
                  <Square size={24} color={colors.textLight} />
                )}
                <Text style={styles.radioLabel}>Reporting for myself</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setReportingForSelf(false)}
              >
                {!reportingForSelf ? (
                  <CheckSquare size={24} color={colors.primary} />
                ) : (
                  <Square size={24} color={colors.textLight} />
                )}
                <Text style={styles.radioLabel}>Reporting for someone else</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Submit Anonymously</Text>
                <Text style={styles.switchHint}>
                  Your identity will be hidden from public view
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: colors.border, true: colors.anonymous }}
                thumbColor={colors.surface}
                testID="anonymous-switch"
              />
            </View>
            {isAnonymous && (
              <View style={styles.anonymousNote}>
                <Text style={styles.anonymousNoteText}>
                  Note: Your account information will still be attached internally for verification.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name of Student Being Bullied <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={victimName}
              onChangeText={setVictimName}
              placeholder={reportingForSelf ? 'Enter your name' : "Enter student's name"}
              placeholderTextColor={colors.textLight}
              autoCapitalize="words"
              testID="victim-name-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Incident Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowIncidentPicker(true)}
              testID="incident-type-picker"
            >
              <Text style={styles.pickerButtonText}>
                {INCIDENT_TYPES.find(t => t.value === incidentType)?.label}
              </Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location of Incident</Text>
            
            <View style={styles.locationRow}>
              <View style={styles.locationItem}>
                <Text style={styles.label}>Building <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowBuildingPicker(true)}
                  testID="building-picker"
                >
                  <Text style={styles.pickerButtonText}>Building {building}</Text>
                  <ChevronDown size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.locationItem}>
                <Text style={styles.label}>Floor <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowFloorPicker(true)}
                  testID="floor-picker"
                >
                  <Text style={styles.pickerButtonText}>{floor} Floor</Text>
                  <ChevronDown size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Room/Section <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={room}
                onChangeText={setRoom}
                placeholder="e.g., Section A, Room 101, Cafeteria"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                testID="room-input"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what happened (optional)"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              testID="description-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setCantRememberDateTime(!cantRememberDateTime)}
            >
              {cantRememberDateTime ? (
                <CheckSquare size={20} color={colors.primary} />
              ) : (
                <Square size={20} color={colors.textLight} />
              )}
              <Text style={styles.checkboxLabel}>I can&apos;t remember</Text>
            </TouchableOpacity>

            {!cantRememberDateTime && (
              <TextInput
                style={styles.input}
                value={dateTime}
                onChangeText={setDateTime}
                placeholder="e.g., Today at lunch, Yesterday morning"
                placeholderTextColor={colors.textLight}
                testID="datetime-input"
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photo or Video Evidence (Optional)</Text>
            {photoEvidence ? (
              <View style={styles.evidenceContainer}>
                <Image source={{ uri: photoEvidence }} style={styles.evidenceImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setPhotoEvidence(undefined)}
                >
                  <X size={20} color={colors.surface} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickImage}
                testID="upload-evidence-button"
              >
                <Camera size={24} color={colors.primary} />
                <Text style={styles.uploadButtonText}>Add Photo Evidence</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isCreatingReport && styles.submitButtonDisabled]}
            onPress={handleSubmitReport}
            disabled={isCreatingReport}
            testID="submit-report-button"
          >
            {isCreatingReport ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>

          <View style={styles.safetyNote}>
            <Text style={styles.safetyNoteText}>
              Your safety matters. This report will be reviewed by school staff who are here to help.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showBuildingPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBuildingPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowBuildingPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Building</Text>
            {BUILDINGS.map((b) => (
              <TouchableOpacity
                key={b}
                style={[styles.pickerOption, building === b && styles.pickerOptionSelected]}
                onPress={() => {
                  setBuilding(b);
                  setShowBuildingPicker(false);
                }}
              >
                <Text style={[styles.pickerOptionText, building === b && styles.pickerOptionTextSelected]}>
                  Building {b}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showFloorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFloorPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowFloorPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Floor</Text>
            {FLOORS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.pickerOption, floor === f && styles.pickerOptionSelected]}
                onPress={() => {
                  setFloor(f);
                  setShowFloorPicker(false);
                }}
              >
                <Text style={[styles.pickerOptionText, floor === f && styles.pickerOptionTextSelected]}>
                  {f} Floor
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showIncidentPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIncidentPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowIncidentPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Incident Type</Text>
            <ScrollView style={styles.pickerScroll}>
              {INCIDENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[styles.pickerOption, incidentType === type.value && styles.pickerOptionSelected]}
                  onPress={() => {
                    setIncidentType(type.value);
                    setShowIncidentPicker(false);
                  }}
                >
                  <View style={[styles.typeDot, { backgroundColor: type.color }]} />
                  <Text style={[styles.pickerOptionText, incidentType === type.value && styles.pickerOptionTextSelected]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  anonymousNote: {
    backgroundColor: '#F5F3FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  anonymousNoteText: {
    fontSize: 13,
    color: colors.anonymous,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed' as const,
    borderRadius: 12,
    paddingVertical: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  evidenceContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.error,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.surface,
  },
  safetyNote: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  safetyNoteText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  locationItem: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: 400,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary + '15',
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerOptionTextSelected: {
    fontWeight: '600' as const,
    color: colors.primary,
  },
  typeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
});
