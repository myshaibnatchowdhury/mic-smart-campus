import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/services/campus_data_service.dart';

class ParentDashboardScreen extends StatelessWidget {
  const ParentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = CampusDataService.getDemoStudent();
    final invoices = CampusDataService.getStudentInvoices();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: CampusColors.primaryDark,
        elevation: 0,
        title: const Text('Guardian Desk', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
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
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: CampusColors.accentGoldContainer,
                    child: Text(student.firstName[0], style: const TextStyle(fontWeight: FontWeight.bold, color: CampusColors.accentGold)),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(student.fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Text('ID: ${student.studentIdCode} • ${student.className}', style: const TextStyle(fontSize: 11, color: Colors.black54)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.grey.shade200)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Attendance', style: TextStyle(fontSize: 11, color: Colors.black54)),
                        const SizedBox(height: 4),
                        Text('${student.attendancePercentage}%', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: CampusColors.primaryDark)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.grey.shade200)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Current GPA', style: TextStyle(fontSize: 11, color: Colors.black54)),
                        const SizedBox(height: 4),
                        Text('${student.currentGpa}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: CampusColors.accentGold)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text('Pending Fees', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ...invoices.filter((inv) => inv.dueAmount > 0).map((inv) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.grey.shade200)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(inv.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      Text('Due: ${inv.dueDate}', style: const TextStyle(fontSize: 11, color: Colors.black54)),
                    ],
                  ),
                  Text('৳ ${inv.dueAmount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}

extension FilterIterable<E> on Iterable<E> {
  Iterable<E> filter(bool Function(E element) test) => where(test);
}
