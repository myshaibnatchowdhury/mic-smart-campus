import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/services/campus_data_service.dart';

class TeacherDashboardScreen extends StatelessWidget {
  const TeacherDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final routine = CampusDataService.getTodayRoutine();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: CampusColors.primaryDark,
        elevation: 0,
        title: const Text('Faculty Portal', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white70),
            onPressed: () => context.go('/login'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: CampusColors.primaryContainer,
                    child: Text('N', style: TextStyle(fontWeight: FontWeight.bold, color: CampusColors.primaryDark)),
                  ),
                  SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Dr. Nusrat Jahan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Text('Assistant Professor, CSE', style: TextStyle(fontSize: 12, color: Colors.black54)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text("Today's Classes", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ...routine.map((slot) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(slot.subjectName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text(slot.roomNumber, style: const TextStyle(fontSize: 11, color: Colors.black54)),
                    ],
                  ),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Attendance sheet opened.')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: CampusColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                    child: const Text('Mark Attendance'),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
