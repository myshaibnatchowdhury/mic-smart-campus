import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/models/campus_models.dart';
import '../../core/services/campus_data_service.dart';

class SuperAdminScreen extends StatefulWidget {
  const SuperAdminScreen({super.key});

  @override
  State<SuperAdminScreen> createState() => _SuperAdminScreenState();
}

class _SuperAdminScreenState extends State<SuperAdminScreen> {
  List<RegistrationItem> _incomingRegistrations = [];
  Map<String, dynamic> _connectionStatus = {
    'connected': true,
    'serverUrl': 'http://10.0.2.2:3000',
    'supabaseConnected': true,
    'supabaseUrl': 'PostgreSQL Cluster Connected',
  };
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final status = await CampusDataService.checkBackendStatus();
    final regs = await CampusDataService.fetchRegistrations();
    if (mounted) {
      setState(() {
        _connectionStatus = status;
        _incomingRegistrations = regs;
        _isLoading = false;
      });
    }
  }

  Future<void> _handleUpdateRegistration(String id, String newStatus) async {
    await CampusDataService.updateRegistrationStatus(id, newStatus);
    setState(() {
      _incomingRegistrations = _incomingRegistrations.map((r) {
        if (r.id == id) {
          return RegistrationItem(
            id: r.id,
            fullName: r.fullName,
            email: r.email,
            phone: r.phone,
            institutionName: r.institutionName,
            role: r.role,
            source: r.source,
            status: newStatus,
            notes: r.notes,
            createdAt: r.createdAt,
          );
        }
        return r;
      }).toList();
    });
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Registration $newStatus successfully!'),
        backgroundColor: newStatus == 'approved' ? CampusColors.primary : Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pendingCount = _incomingRegistrations.where((r) => r.status == 'pending').length;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E1065), // Deep Purple for Super Admin
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Super Admin Control Plane',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white),
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
                  _connectionStatus['connected'] == true ? 'SYNC: LIVE SUPABASE' : 'CACHED DB',
                  style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.purpleAccent),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, size: 20, color: Colors.white),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout, size: 20, color: Colors.white70),
            onPressed: () {
              CampusDataService.isSuperAdminSession = false;
              context.go('/login');
            },
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: RefreshIndicator(
            onRefresh: _loadData,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ADMIN PROFILE HERO
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3B0764), Color(0xFF581C87)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.purple.shade900.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
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
                              child: Text(
                                'MC',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.purple.shade900,
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Mysha Ibnat Chowdhury',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                    ),
                                  ),
                                  Text(
                                    'myshaibnatchowdhury@gmail.com',
                                    style: TextStyle(fontSize: 11, color: Colors.purpleAccent, fontWeight: FontWeight.w600),
                                  ),
                                  Text(
                                    'Principal Super Administrator • Global Scope',
                                    style: TextStyle(fontSize: 10, color: Colors.white70),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Backend: ${_connectionStatus['serverUrl']}',
                                style: const TextStyle(fontSize: 10, color: Colors.white70, fontFamily: 'monospace'),
                              ),
                              const Text(
                                'Supabase: PostgreSQL Active',
                                style: TextStyle(fontSize: 10, color: Colors.greenAccent, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // PLATFORM METRICS
                  Row(
                    children: [
                      _buildAdminStatTile('Institutions', '3 Active', Icons.account_balance),
                      const SizedBox(width: 10),
                      _buildAdminStatTile('Total Students', '2,840', Icons.school),
                      const SizedBox(width: 10),
                      _buildAdminStatTile('Review Queue', '$pendingCount Pending', Icons.how_to_reg),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // INCOMING REGISTRATIONS REVIEW QUEUE
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Incoming Student & App Registrations',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.black87),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.purple.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.purple.shade200),
                        ),
                        child: Text(
                          '$pendingCount Pending Review',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.purple.shade900),
                        ),
                      ),
                    ],
                  ),
                  const Text(
                    'Applications submitted from Android APK & Web arrive directly in this review queue.',
                    style: TextStyle(fontSize: 11, color: Colors.black54),
                  ),
                  const SizedBox(height: 12),

                  if (_isLoading)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32.0),
                        child: CircularProgressIndicator(),
                      ),
                    )
                  else if (_incomingRegistrations.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      alignment: Alignment.center,
                      child: const Text('No registration requests found in database.'),
                    )
                  else
                    ..._incomingRegistrations.map((reg) {
                      final isPending = reg.status == 'pending';
                      final isApproved = reg.status == 'approved';
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(14),
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
                                  reg.fullName,
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: isPending ? Colors.amber.shade50 : (isApproved ? Colors.green.shade50 : Colors.red.shade50),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    reg.status.toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: isPending ? Colors.amber.shade800 : (isApproved ? Colors.green.shade800 : Colors.red.shade800),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${reg.email} • ${reg.phone}',
                              style: const TextStyle(fontSize: 11, color: Colors.black54),
                            ),
                            Text(
                              'Target: ${reg.institutionName} (${reg.role})',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: CampusColors.primaryDark),
                            ),
                            if (reg.notes.isNotEmpty) ...[
                              const SizedBox(height: 6),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  reg.notes,
                                  style: const TextStyle(fontSize: 10, color: Colors.black87),
                                ),
                              ),
                            ],
                            if (isPending) ...[
                              const SizedBox(height: 10),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: () => _handleUpdateRegistration(reg.id, 'approved'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: CampusColors.primaryDark,
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                      ),
                                      child: const Text('Approve', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: OutlinedButton(
                                      onPressed: () => _handleUpdateRegistration(reg.id, 'rejected'),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: Colors.red.shade700,
                                        side: BorderSide(color: Colors.red.shade300),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                      ),
                                      child: const Text('Reject', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      );
                    }),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAdminStatTile(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 16, color: Colors.purple.shade800),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.black87),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              label,
              style: const TextStyle(fontSize: 9, color: Colors.black54),
            ),
          ],
        ),
      ),
    );
  }
}
