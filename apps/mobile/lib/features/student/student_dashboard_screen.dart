import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/models/campus_models.dart';
import '../../core/services/campus_data_service.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  int _currentTabIndex = 0;
  Map<String, dynamic> _connectionStatus = {
    'connected': true,
    'serverUrl': 'http://10.0.2.2:3000',
    'supabaseConnected': true,
    'supabaseUrl': 'PostgreSQL Cluster Connected',
  };

  late final StudentProfile _student;
  late final List<RoutineSlot> _routine;
  late final Map<String, List<RoutineSlot>> _weekRoutine;
  late final List<InvoiceItem> _invoices;
  late final List<CampusNotice> _notices;
  late final List<ExaminationRecord> _exams;
  late final List<SubjectResult> _results;
  late final List<DailyAttendanceRecord> _attendanceHistory;

  String _selectedRoutineDay = 'Sunday';

  @override
  void initState() {
    super.initState();
    _student = CampusDataService.getActiveStudent();
    _routine = CampusDataService.getTodayRoutine();
    _weekRoutine = CampusDataService.getWeekRoutine();
    _invoices = CampusDataService.getStudentInvoices();
    _notices = CampusDataService.getNotices();
    _exams = CampusDataService.getUpcomingExams();
    _results = CampusDataService.getSemesterResults();
    _attendanceHistory = CampusDataService.getAttendanceHistory();

    _checkBackendConnection();
  }

  Future<void> _checkBackendConnection() async {
    final status = await CampusDataService.checkBackendStatus();
    if (mounted) {
      setState(() => _connectionStatus = status);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: _buildModernAppBar(),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: RefreshIndicator(
            onRefresh: () async {
              await _checkBackendConnection();
              setState(() {});
            },
            child: _buildCurrentTabBody(),
          ),
        ),
      ),
      bottomNavigationBar: _buildModernBottomNav(),
    );
  }

  // --- TOP APP BAR ---
  PreferredSizeWidget _buildModernAppBar() {
    return AppBar(
      backgroundColor: CampusColors.primaryDark,
      elevation: 0,
      titleSpacing: 16,
      title: Row(
        children: [
          Container(
            height: 36,
            width: 36,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 4,
                ),
              ],
            ),
            padding: const EdgeInsets.all(4),
            child: Image.asset(
              'assets/images/logo.png',
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(
                Icons.school,
                size: 22,
                color: CampusColors.primaryDark,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _student.institutionName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -0.2,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: _connectionStatus['connected'] == true ? Colors.greenAccent : Colors.amberAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _connectionStatus['connected'] == true ? 'SYNC: LIVE' : 'LOCAL CACHED',
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: CampusColors.accentGoldLight,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        // Notifications
        IconButton(
          icon: const Badge(
            smallSize: 8,
            backgroundColor: CampusColors.accentGold,
            child: Icon(Icons.notifications_outlined, color: Colors.white, size: 22),
          ),
          onPressed: _showNoticesBottomSheet,
        ),
        // Sign Out
        IconButton(
          icon: const Icon(Icons.logout, color: Colors.white70, size: 20),
          onPressed: () => context.go('/login'),
        ),
      ],
    );
  }

  // --- BOTTOM NAVIGATION BAR ---
  Widget _buildModernBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade200)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_rounded, Icons.home_outlined, 'Home'),
              _buildNavItem(1, Icons.schedule_rounded, Icons.schedule_outlined, 'Routine'),
              _buildNavItem(2, Icons.how_to_reg_rounded, Icons.how_to_reg_outlined, 'Attendance'),
              _buildNavItem(3, Icons.emoji_events_rounded, Icons.emoji_events_outlined, 'Results'),
              _buildNavItem(4, Icons.account_balance_wallet_rounded, Icons.account_balance_wallet_outlined, 'Fees'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData activeIcon, IconData inactiveIcon, String label) {
    final isSelected = _currentTabIndex == index;
    return InkWell(
      onTap: () => setState(() => _currentTabIndex = index),
      borderRadius: BorderRadius.circular(12),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? CampusColors.primaryContainer : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? activeIcon : inactiveIcon,
              size: 20,
              color: isSelected ? CampusColors.primaryDark : const Color(0xFF64748B),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? CampusColors.primaryDark : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- TAB BODY SWITCHER ---
  Widget _buildCurrentTabBody() {
    switch (_currentTabIndex) {
      case 1:
        return _buildRoutineTab();
      case 2:
        return _buildAttendanceTab();
      case 3:
        return _buildResultsTab();
      case 4:
        return _buildFeesTab();
      case 0:
      default:
        return _buildHomeTab();
    }
  }

  // ==========================================
  // TAB 0: HOME / DASHBOARD OVERVIEW
  // ==========================================
  Widget _buildHomeTab() {
    final unpaidInvoice = _invoices.firstWhere(
      (inv) => inv.dueAmount > 0,
      orElse: () => _invoices.first,
    );

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Student Identity Hero Card
          _buildHeroIdentityCard(),

          const SizedBox(height: 16),

          // 2. Metrics Highlight Row (Attendance + Due + GPA)
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  title: 'Attendance',
                  value: '${_student.attendancePercentage}%',
                  subtitle: '88/92 Classes',
                  icon: Icons.how_to_reg,
                  color: CampusColors.primary,
                  onTap: () => setState(() => _currentTabIndex = 2),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildMetricTile(
                  title: 'Pending Due',
                  value: '৳ ${unpaidInvoice.dueAmount.toInt()}',
                  subtitle: 'Due: ${unpaidInvoice.dueDate}',
                  icon: Icons.account_balance_wallet,
                  color: Colors.amber.shade800,
                  onTap: () => setState(() => _currentTabIndex = 4),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildMetricTile(
                  title: 'CGPA',
                  value: '${_student.currentGpa}',
                  subtitle: 'Out of 4.00',
                  icon: Icons.emoji_events,
                  color: Colors.purple.shade700,
                  onTap: () => setState(() => _currentTabIndex = 3),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // 3. Quick Actions
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Campus Modules',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: Colors.black87,
                  letterSpacing: -0.3,
                ),
              ),
              Text(
                'Live SDUI',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: CampusColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _buildCompactQuickActions(),

          const SizedBox(height: 20),

          // 4. Today's Class Routine Timeline
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Today's Lectures",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: Colors.black87,
                  letterSpacing: -0.3,
                ),
              ),
              GestureDetector(
                onTap: () => setState(() => _currentTabIndex = 1),
                child: Text(
                  'Full Week (${_routine.length} today) →',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: CampusColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _buildRoutineTimelinePreview(),

          const SizedBox(height: 20),

          // 5. Official Notices Highlight
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Official Notices & Events',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: Colors.black87,
                  letterSpacing: -0.3,
                ),
              ),
              GestureDetector(
                onTap: _showNoticesBottomSheet,
                child: const Text(
                  'View All →',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: CampusColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _buildNoticesPreview(),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // --- HERO CARD ---
  Widget _buildHeroIdentityCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [CampusColors.primaryDark, CampusColors.primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: CampusColors.primaryDark.withOpacity(0.25),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: Colors.white,
                child: CircleAvatar(
                  radius: 24,
                  backgroundColor: CampusColors.primaryContainer,
                  child: Text(
                    _student.firstName[0],
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: CampusColors.primaryDark,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            _student.fullName,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: -0.2,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.verified, size: 16, color: CampusColors.accentGoldLight),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'ID: ${_student.studentIdCode}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: CampusColors.accentGoldLight,
                        fontFamily: 'monospace',
                      ),
                    ),
                    Text(
                      '${_student.className} • ${_student.sectionName}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.white70,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _student.bloodGroup,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.calendar_today, size: 12, color: Colors.white70),
                    SizedBox(width: 6),
                    Text(
                      'Fall Term 2026',
                      style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.verified_user_outlined, size: 12, color: Colors.greenAccent),
                    const SizedBox(width: 4),
                    Text(
                      'RLS Enforced',
                      style: TextStyle(fontSize: 10, color: Colors.green.shade200, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- METRIC TILE ---
  Widget _buildMetricTile({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Colors.black54,
                  ),
                ),
                Icon(icon, size: 16, color: color),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: CampusColors.primaryDark,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 9,
                color: Colors.black45,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  // --- COMPACT QUICK ACTIONS ---
  Widget _buildCompactQuickActions() {
    final actions = [
      {'icon': Icons.schedule, 'label': 'Routine', 'color': CampusColors.primary, 'tab': 1},
      {'icon': Icons.how_to_reg, 'label': 'Attendance', 'color': Colors.blue.shade700, 'tab': 2},
      {'icon': Icons.emoji_events, 'label': 'Results', 'color': CampusColors.accentGold, 'tab': 3},
      {'icon': Icons.receipt_long, 'label': 'Fees / Pay', 'color': Colors.purple.shade700, 'tab': 4},
      {'icon': Icons.campaign, 'label': 'Notices', 'color': Colors.orange.shade800, 'action': 'notices'},
      {'icon': Icons.app_registration, 'label': 'Admission', 'color': Colors.teal.shade700, 'action': 'register'},
      {'icon': Icons.badge_outlined, 'label': 'ID Card', 'color': Colors.deepPurple, 'action': 'id_card'},
      {'icon': Icons.sync, 'label': 'Web Sync', 'color': Colors.indigo, 'action': 'sync'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: actions.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.05,
      ),
      itemBuilder: (context, index) {
        final a = actions[index];
        return InkWell(
          onTap: () {
            if (a['tab'] != null) {
              setState(() => _currentTabIndex = a['tab'] as int);
            } else if (a['action'] == 'notices') {
              _showNoticesBottomSheet();
            } else if (a['action'] == 'register') {
              context.go('/register');
            } else if (a['action'] == 'id_card') {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Student ID: ${_student.studentIdCode} | Verified Active'),
                  backgroundColor: CampusColors.primaryDark,
                  behavior: SnackBarBehavior.floating,
                ),
              );
            } else if (a['action'] == 'sync') {
              _checkBackendConnection();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Connected to: ${_connectionStatus['serverUrl']} | Supabase: ${_connectionStatus['supabaseConnected']}'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            }
          },
          borderRadius: BorderRadius.circular(14),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.grey.shade200),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.015),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: (a['color'] as Color).withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(a['icon'] as IconData, size: 18, color: a['color'] as Color),
                ),
                const SizedBox(height: 5),
                Text(
                  a['label'] as String,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // --- ROUTINE PREVIEW ---
  Widget _buildRoutineTimelinePreview() {
    return Column(
      children: _routine.take(3).map((slot) {
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            children: [
              Container(
                width: 3,
                height: 36,
                decoration: BoxDecoration(
                  color: CampusColors.primary,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      slot.subjectName,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${slot.subjectCode} • ${slot.teacherName}',
                      style: const TextStyle(fontSize: 11, color: Colors.black54),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    slot.startTime,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: CampusColors.primaryDark,
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 2),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      slot.roomNumber,
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.black54),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // --- NOTICES PREVIEW ---
  Widget _buildNoticesPreview() {
    return Column(
      children: _notices.take(2).map((notice) {
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.campaign, size: 20, color: Colors.amber.shade800),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notice.title,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      notice.content,
                      style: const TextStyle(fontSize: 11, color: Colors.black54),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // ==========================================
  // TAB 1: FULL CLASS ROUTINE
  // ==========================================
  Widget _buildRoutineTab() {
    final days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    final routineSlots = _weekRoutine[_selectedRoutineDay] ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Weekly Academic Routine',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.black87),
          ),
          const Text(
            'Computer Science & Engineering • 3rd Year (Section A)',
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 14),

          // Day of week selector
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: days.map((day) {
                final isSelected = _selectedRoutineDay == day;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: FilterChip(
                    selected: isSelected,
                    label: Text(day),
                    labelStyle: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : Colors.black87,
                    ),
                    backgroundColor: Colors.white,
                    selectedColor: CampusColors.primaryDark,
                    onSelected: (val) {
                      setState(() => _selectedRoutineDay = day);
                    },
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 16),

          // Routine cards for selected day
          if (routineSlots.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              alignment: Alignment.center,
              child: const Text('No lectures scheduled for this day.'),
            )
          else
            ...routineSlots.map((slot) {
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: CampusColors.primaryContainer,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            slot.subjectCode,
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: CampusColors.primaryDark,
                            ),
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.timer_outlined, size: 14, color: Colors.black54),
                            const SizedBox(width: 4),
                            Text(
                              '${slot.startTime} - ${slot.endTime}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: CampusColors.primaryDark,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      slot.subjectName,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.person_outline, size: 14, color: Colors.black54),
                            const SizedBox(width: 4),
                            Text(
                              slot.teacherName,
                              style: const TextStyle(fontSize: 12, color: Colors.black54),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.meeting_room_outlined, size: 14, color: Colors.black54),
                            const SizedBox(width: 4),
                            Text(
                              slot.roomNumber,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.black87),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: ATTENDANCE DETAILS & HISTORY
  // ==========================================
  Widget _buildAttendanceTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Attendance & Academic Biometrics',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.black87),
          ),
          const Text(
            'Fall Term 2026 • Verified RFID & Smart Campus Gate',
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 16),

          // Attendance Summary Progress Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F766E), Color(0xFF0D9488)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.teal.shade900.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                // Circular percentage
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      height: 70,
                      width: 70,
                      child: CircularProgressIndicator(
                        value: _student.attendancePercentage / 100,
                        backgroundColor: Colors.white24,
                        valueColor: const AlwaysStoppedAnimation(Colors.white),
                        strokeWidth: 6,
                      ),
                    ),
                    Text(
                      '${_student.attendancePercentage.toInt()}%',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 20),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Attendance Status: EXCELLENT',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.amberAccent,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Eligible for Semester Final Examinations without penalty.',
                        style: TextStyle(fontSize: 11, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Stats counter row
          Row(
            children: [
              _buildAttendancePill('Present', '88 Days', Colors.green.shade700, Colors.green.shade50),
              const SizedBox(width: 8),
              _buildAttendancePill('Absent', '3 Days', Colors.red.shade700, Colors.red.shade50),
              const SizedBox(width: 8),
              _buildAttendancePill('Late', '1 Day', Colors.amber.shade800, Colors.amber.shade50),
            ],
          ),

          const SizedBox(height: 20),

          const Text(
            'Recent Daily Records',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
          ),
          const SizedBox(height: 10),

          ..._attendanceHistory.map((rec) {
            final isPresent = rec.status == 'Present';
            final isLate = rec.status == 'Late';
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Icon(
                    isPresent ? Icons.check_circle : (isLate ? Icons.access_time_filled : Icons.cancel),
                    size: 18,
                    color: isPresent ? Colors.green.shade600 : (isLate ? Colors.amber.shade700 : Colors.red.shade600),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rec.subject,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black87),
                        ),
                        Text(
                          '${rec.date} (${rec.day})',
                          style: const TextStyle(fontSize: 11, color: Colors.black54),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: isPresent ? Colors.green.shade50 : (isLate ? Colors.amber.shade50 : Colors.red.shade50),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          rec.status,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isPresent ? Colors.green.shade800 : (isLate ? Colors.amber.shade800 : Colors.red.shade800),
                          ),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        rec.time,
                        style: const TextStyle(fontSize: 9, color: Colors.black45),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildAttendancePill(String title, String count, Color textColor, Color bgColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              count,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColor),
            ),
            Text(
              title,
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: textColor.withOpacity(0.8)),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 3: ACADEMIC RESULTS & CGPA
  // ==========================================
  Widget _buildResultsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Examinations & Grade Sheet',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.black87),
          ),
          const Text(
            'Official Transcript Record • Configurable Grading System',
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 16),

          // CGPA Hero Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF4C1D95), Color(0xFF6D28D9)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.shade900.withOpacity(0.25),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Cumulative GPA',
                      style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_student.currentGpa}',
                      style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const Text(
                      'First Class with Distinction',
                      style: TextStyle(fontSize: 11, color: Colors.amberAccent, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.workspace_premium, size: 28, color: Colors.amberAccent),
                      SizedBox(height: 4),
                      Text('Rank #3', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          const Text(
            'Semester Course Results',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
          ),
          const SizedBox(height: 10),

          // Course Result Cards
          ..._results.map((res) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.purple.shade50,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      res.letterGrade,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Colors.purple.shade800,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          res.title,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black87),
                        ),
                        Text(
                          '${res.code} • ${res.credits} Credit Hours',
                          style: const TextStyle(fontSize: 11, color: Colors.black54),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '${res.gradePoint.toStringAsFixed(2)} GPA',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: CampusColors.primaryDark),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 16),

          const Text(
            'Upcoming Examination Schedule',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
          ),
          const SizedBox(height: 10),

          ..._exams.map((ex) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: CampusColors.primaryContainer,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.event_note, color: CampusColors.primaryDark, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ex.title,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black87),
                        ),
                        Text(
                          '${ex.startDate} • ${ex.time}',
                          style: const TextStyle(fontSize: 11, color: Colors.black54),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      ex.room,
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black54),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 4: FEES & INVOICE PAYMENT
  // ==========================================
  Widget _buildFeesTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Fees & Financial Ledger',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.black87),
          ),
          const Text(
            'Student Account • Instant Payment Simulation with Receipts',
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 16),

          // Total Due Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF9A3412), Color(0xFFC2410C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.orange.shade900.withOpacity(0.25),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Outstanding Balance', style: TextStyle(fontSize: 12, color: Colors.white70)),
                    SizedBox(height: 4),
                    Text('৳ 4,500', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: Colors.white)),
                    Text('Due Date: 25 November 2026', style: TextStyle(fontSize: 11, color: Colors.amberAccent)),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () => _showPaymentSheet(_invoices.firstWhere((i) => i.dueAmount > 0)),
                  icon: const Icon(Icons.payment, size: 16),
                  label: const Text('Pay Now'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.orange.shade900,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          const Text(
            'Invoices & Payment Records',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
          ),
          const SizedBox(height: 10),

          ..._invoices.map((inv) {
            final isPaid = inv.status == 'PAID';
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.015),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        inv.invoiceNumber,
                        style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Colors.black54),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isPaid ? Colors.green.shade50 : Colors.amber.shade50,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          inv.status,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isPaid ? Colors.green.shade800 : Colors.amber.shade800,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    inv.title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total: ৳ ${inv.totalAmount.toInt()}',
                        style: const TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                      Text(
                        'Due: ৳ ${inv.dueAmount.toInt()}',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: isPaid ? Colors.green.shade700 : Colors.orange.shade800,
                        ),
                      ),
                    ],
                  ),
                  if (!isPaid) ...[
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => _showPaymentSheet(inv),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: CampusColors.primaryDark,
                          side: const BorderSide(color: CampusColors.primaryDark),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('Simulate Payment & Download Receipt', style: TextStyle(fontSize: 11)),
                      ),
                    ),
                  ],
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // --- MODALS & BOTTOM SHEETS ---
  void _showNoticesBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          maxChildSize: 0.85,
          minChildSize: 0.4,
          expand: false,
          builder: (_, controller) {
            return Padding(
              padding: const EdgeInsets.all(20.0),
              child: ListView(
                controller: controller,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Campus Notice Board',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 12),
                  ..._notices.map((n) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                n.category,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: CampusColors.primary,
                                ),
                              ),
                              Text(n.publishedDate, style: const TextStyle(fontSize: 10, color: Colors.black45)),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            n.title,
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            n.content,
                            style: const TextStyle(fontSize: 12, color: Colors.black87, height: 1.4),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showPaymentSheet(InvoiceItem invoice) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Payment Simulation: ${invoice.title}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Payable Due Amount: ৳ ${invoice.dueAmount.toInt()}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: CampusColors.primaryDark),
              ),
              const SizedBox(height: 16),
              const Text('Select Gateway:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _completePayment(invoice);
                      },
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('bKash'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _completePayment(invoice);
                      },
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Nagad'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _completePayment(invoice);
                      },
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Cards'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _completePayment(InvoiceItem invoice) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Payment of ৳ ${invoice.dueAmount.toInt()} successfully simulated! Receipt generated.'),
        backgroundColor: CampusColors.primaryDark,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
