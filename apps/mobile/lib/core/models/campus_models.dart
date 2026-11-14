class StudentProfile {
  final String id;
  final String studentIdCode;
  final String firstName;
  final String lastName;
  final String className;
  final String sectionName;
  final String institutionName;
  final String institutionCode;
  final double attendancePercentage;
  final double currentGpa;
  final String bloodGroup;
  final String email;
  final String phone;
  final String guardianName;
  final String guardianPhone;

  const StudentProfile({
    required this.id,
    required this.studentIdCode,
    required this.firstName,
    required this.lastName,
    required this.className,
    required this.sectionName,
    required this.institutionName,
    required this.institutionCode,
    required this.attendancePercentage,
    required this.currentGpa,
    required this.bloodGroup,
    this.email = 'samiul.karim@mic-university.edu.bd',
    this.phone = '+8801712345678',
    this.guardianName = 'Md. Karim Ullah',
    this.guardianPhone = '+8801812345678',
  });

  String get fullName => '$firstName $lastName';
}

class RoutineSlot {
  final String id;
  final String subjectCode;
  final String subjectName;
  final String teacherName;
  final String startTime;
  final String endTime;
  final String roomNumber;
  final String dayOfWeek;

  const RoutineSlot({
    required this.id,
    this.subjectCode = 'CSE-201',
    required this.subjectName,
    required this.teacherName,
    required this.startTime,
    required this.endTime,
    required this.roomNumber,
    this.dayOfWeek = 'Sunday',
  });
}

class InvoiceItem {
  final String id;
  final String invoiceNumber;
  final String title;
  final double totalAmount;
  final double paidAmount;
  final double dueAmount;
  final String status;
  final String dueDate;

  const InvoiceItem({
    required this.id,
    required this.invoiceNumber,
    required this.title,
    required this.totalAmount,
    required this.paidAmount,
    required this.dueAmount,
    required this.status,
    required this.dueDate,
  });
}

class CampusNotice {
  final String id;
  final String title;
  final String content;
  final String publishedDate;
  final bool isPinned;
  final String category;

  const CampusNotice({
    required this.id,
    required this.title,
    required this.content,
    required this.publishedDate,
    required this.isPinned,
    this.category = 'Academic',
  });
}

class ExaminationRecord {
  final String id;
  final String title;
  final String startDate;
  final String status;
  final String room;
  final String time;

  const ExaminationRecord({
    required this.id,
    required this.title,
    required this.startDate,
    required this.status,
    this.room = 'Exam Hall 302',
    this.time = '10:00 AM - 01:00 PM',
  });
}

class SubjectResult {
  final String code;
  final String title;
  final int credits;
  final double gradePoint;
  final String letterGrade;

  const SubjectResult({
    required this.code,
    required this.title,
    required this.credits,
    required this.gradePoint,
    required this.letterGrade,
  });
}

class DailyAttendanceRecord {
  final String date;
  final String day;
  final String status; // Present, Absent, Late, Excused
  final String subject;
  final String time;

  const DailyAttendanceRecord({
    required this.date,
    required this.day,
    required this.status,
    required this.subject,
    required this.time,
  });
}

class RegistrationItem {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String institutionName;
  final String role;
  final String source;
  final String status; // pending, approved, rejected
  final String notes;
  final String createdAt;

  const RegistrationItem({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.institutionName,
    required this.role,
    required this.source,
    required this.status,
    required this.notes,
    required this.createdAt,
  });

  factory RegistrationItem.fromJson(Map<String, dynamic> json) {
    return RegistrationItem(
      id: json['id']?.toString() ?? '',
      fullName: json['full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      institutionName: json['institution_name']?.toString() ?? 'MIC Smart University',
      role: json['role']?.toString() ?? 'student',
      source: json['source']?.toString() ?? 'mobile_apk',
      status: json['status']?.toString() ?? 'pending',
      notes: json['notes']?.toString() ?? '',
      createdAt: json['created_at']?.toString() ?? '',
    );
  }
}
