import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/services/campus_data_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // 'academic' for Student/Teacher/Parent, 'admin' for Super Admin Console
  String _portalMode = 'academic';

  // Credentials must start BLANK — no auto-filling or quick-switching
  final _academicEmailController = TextEditingController();
  final _academicPasswordController = TextEditingController();

  final _adminEmailController = TextEditingController();
  final _adminPasswordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _academicEmailController.dispose();
    _academicPasswordController.dispose();
    _adminEmailController.dispose();
    _adminPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleAcademicSignIn() async {
    final email = _academicEmailController.text.trim();
    final password = _academicPasswordController.text.trim();

    if (email.isEmpty) {
      setState(() => _errorMessage = 'Please enter your campus email or personal student email');
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = 'Please enter your account password');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    // Verify credentials with backend auth service
    final authResult = await CampusDataService.authenticate(email, password);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (authResult['success'] == true) {
      final role = authResult['role'] ?? 'student';
      switch (role) {
        case 'super_admin':
          context.go('/super-admin');
          break;
        case 'teacher':
          context.go('/teacher-dashboard');
          break;
        case 'parent':
          context.go('/parent-dashboard');
          break;
        case 'student':
        default:
          context.go('/student-dashboard');
          break;
      }
    } else {
      setState(() {
        _errorMessage = authResult['error'] ?? 'Invalid email or password. Please verify your credentials.';
      });
    }
  }

  Future<void> _handleAdminSignIn() async {
    final email = _adminEmailController.text.trim();
    final password = _adminPasswordController.text.trim();

    if (email.isEmpty) {
      setState(() => _errorMessage = 'Please enter Super Admin email');
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = 'Please enter Super Admin password');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final isValid = await CampusDataService.verifySuperAdmin(email, password);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (isValid) {
      context.go('/super-admin');
    } else {
      setState(() {
        _errorMessage = 'Invalid Super Admin credentials. Only myshaibnatchowdhury@gmail.com with authorized website password can access this console.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAdminMode = _portalMode == 'admin';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // BRAND LOGO
                  Center(
                    child: Container(
                      height: 70,
                      margin: const EdgeInsets.only(bottom: 8),
                      child: Image.asset(
                        'assets/images/logo.png',
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return const Column(
                            children: [
                              Icon(Icons.school, size: 44, color: CampusColors.primaryDark),
                              Text(
                                'MIC Smart Campus',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: CampusColors.primaryDark,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ),

                  // TOP LEVEL PORTAL SELECTOR (Student vs Super Admin)
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 12),
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _portalMode = 'academic';
                                _errorMessage = null;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: !isAdminMode ? CampusColors.primaryDark : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: !isAdminMode
                                    ? [
                                        BoxShadow(
                                          color: CampusColors.primaryDark.withOpacity(0.3),
                                          blurRadius: 4,
                                          offset: const Offset(0, 2),
                                        )
                                      ]
                                    : null,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.school,
                                    size: 16,
                                    color: !isAdminMode ? Colors.white : Colors.black54,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Student Portal',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: !isAdminMode ? Colors.white : Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _portalMode = 'admin';
                                _errorMessage = null;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: isAdminMode ? const Color(0xFF2E1065) : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: isAdminMode
                                    ? [
                                        BoxShadow(
                                          color: const Color(0xFF2E1065).withOpacity(0.35),
                                          blurRadius: 4,
                                          offset: const Offset(0, 2),
                                        )
                                      ]
                                    : null,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.admin_panel_settings,
                                    size: 16,
                                    color: isAdminMode ? CampusColors.accentGoldLight : Colors.black54,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Super Admin',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: isAdminMode ? Colors.white : Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 8),

                  // SUBTITLE & INSTRUCTION
                  Text(
                    isAdminMode ? 'Super Admin Authentication' : 'Academic Portal Sign In',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: isAdminMode ? const Color(0xFF2E1065) : CampusColors.primaryDark,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    isAdminMode
                        ? 'Dedicated console for Mysha Ibnat Chowdhury'
                        : 'Enter your registered email and password to access your profile',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: Colors.black54,
                    ),
                  ),

                  const SizedBox(height: 16),

                  if (_errorMessage != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.error_outline, size: 16, color: Colors.red.shade700),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: TextStyle(fontSize: 11, color: Colors.red.shade800),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // MAIN BODY: ACADEMIC OR ADMIN
                  if (!isAdminMode) ...[
                    // EMAIL INPUT
                    TextField(
                      controller: _academicEmailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Official or Registered Student Email',
                        hintText: 'e.g. tanvir.student@gmail.com',
                        prefixIcon: const Icon(Icons.email_outlined, color: CampusColors.primary),
                        suffixIcon: _academicEmailController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 18),
                                onPressed: () => setState(() => _academicEmailController.clear()),
                              )
                            : null,
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: CampusColors.primary, width: 1.5),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // PASSWORD INPUT
                    TextField(
                      controller: _academicPasswordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Account Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(Icons.lock_outline, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: CampusColors.primary, width: 1.5),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // SUBMIT BUTTON
                    ElevatedButton(
                      onPressed: _isLoading ? null : _handleAcademicSignIn,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: CampusColors.primaryDark,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: 2,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text(
                              'SIGN IN TO STUDENT PORTAL →',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                    ),

                    const SizedBox(height: 14),

                    // REGISTRATION LINK (APPLY FOR ADMISSION)
                    OutlinedButton.icon(
                      onPressed: () => context.go('/register'),
                      icon: const Icon(Icons.school, size: 18),
                      label: const Text(
                        'Apply for Student Admission / Register',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: CampusColors.primaryDark,
                        side: const BorderSide(color: CampusColors.primaryDark),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ] else ...[
                    // SUPER ADMIN LOGIN VIEW
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF2E1065), Color(0xFF4C1D95)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.purple.shade900.withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: CampusColors.accentGoldLight,
                            child: const Icon(Icons.security, size: 22, color: Color(0xFF2E1065)),
                          ),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Mysha Ibnat Chowdhury',
                                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                                Text(
                                  'myshaibnatchowdhury@gmail.com',
                                  style: TextStyle(fontSize: 10, color: Colors.purpleAccent),
                                ),
                                Text(
                                  'Web & APK Synchronized Authority',
                                  style: TextStyle(fontSize: 9, color: Colors.white70),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // ADMIN EMAIL INPUT
                    TextField(
                      controller: _adminEmailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Super Admin Email',
                        hintText: 'Enter your email (myshaibnatchowdhury@gmail.com)',
                        prefixIcon: const Icon(Icons.admin_panel_settings, color: Color(0xFF2E1065)),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: Color(0xFF2E1065), width: 1.5),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ADMIN PASSWORD INPUT
                    TextField(
                      controller: _adminPasswordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Super Admin Password (from Website)',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(Icons.lock, color: Color(0xFF2E1065)),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: Color(0xFF2E1065), width: 1.5),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // ADMIN SUBMIT BUTTON
                    ElevatedButton(
                      onPressed: _isLoading ? null : _handleAdminSignIn,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2E1065),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: 3,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.shield_outlined, size: 18, color: CampusColors.accentGoldLight),
                                SizedBox(width: 8),
                                Text(
                                  'SIGN IN AS SUPER ADMIN →',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ],

                  const SizedBox(height: 20),
                  const Center(
                    child: Text(
                      'Live Supabase & PostgreSQL Connection • Multi-Tenant',
                      style: TextStyle(fontSize: 11, color: Colors.black45),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
