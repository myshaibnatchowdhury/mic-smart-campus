import 'package:go_router/go_router.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/student/student_dashboard_screen.dart';
import '../../features/teacher/teacher_dashboard_screen.dart';
import '../../features/parent/parent_dashboard_screen.dart';
import '../../features/admin/super_admin_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/student-dashboard',
      builder: (context, state) => const StudentDashboardScreen(),
    ),
    GoRoute(
      path: '/teacher-dashboard',
      builder: (context, state) => const TeacherDashboardScreen(),
    ),
    GoRoute(
      path: '/parent-dashboard',
      builder: (context, state) => const ParentDashboardScreen(),
    ),
    GoRoute(
      path: '/super-admin',
      builder: (context, state) => const SuperAdminScreen(),
    ),
  ],
);
