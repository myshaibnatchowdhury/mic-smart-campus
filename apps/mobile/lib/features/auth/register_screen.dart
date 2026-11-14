import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/services/campus_data_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController(text: '+88017');
  final _guardianNameController = TextEditingController();
  final _guardianPhoneController = TextEditingController(text: '+88018');
  final _passwordController = TextEditingController();
  
  String _selectedInstitution = 'MIC Smart University';
  String _selectedProgram = 'B.Sc in Computer Science & Engineering (CSE)';
  String _selectedRole = 'student';
  bool _isLoading = false;

  final List<String> _institutions = [
    'MIC Smart University',
    'MIC Model College',
    'MIC International School',
  ];

  final List<String> _programs = [
    'B.Sc in Computer Science & Engineering (CSE)',
    'BBA - Bachelor of Business Administration',
    'B.Sc in Electrical & Electronic Engineering (EEE)',
    'HSC Science (1st Year)',
    'HSC Business Studies',
    'Class 10 - Secondary (SSC)',
    'A-Levels / Cambridge International',
  ];

  final List<String> _roles = [
    'student',
    'teacher',
    'parent',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _guardianNameController.dispose();
    _guardianPhoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final success = await CampusDataService.submitRegistration(
      fullName: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      institutionName: _selectedInstitution,
      role: _selectedRole,
      password: _passwordController.text.trim(),
      program: _selectedRole == 'student' ? _selectedProgram : null,
      guardianName: _selectedRole == 'student' ? _guardianNameController.text.trim() : null,
      guardianPhone: _selectedRole == 'student' ? _guardianPhoneController.text.trim() : null,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: CampusColors.primary, size: 28),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Application Submitted!',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Congratulations ${_nameController.text.trim()}!',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              const Text(
                'Your registration application has been routed directly to the Super Admin Control Panel (Mysha Ibnat Chowdhury) for review.',
                style: TextStyle(fontSize: 12, color: Colors.black87),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: CampusColors.primaryContainer,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  'Once approved by Super Admin, your academic profile will be activated.',
                  style: TextStyle(fontSize: 11, color: CampusColors.primaryDark),
                ),
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.go('/login');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: CampusColors.primaryDark,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Back to Login'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CampusColors.surfaceLight,
      appBar: AppBar(
        backgroundColor: CampusColors.primaryDark,
        elevation: 0,
        title: const Text('Campus Admission & Registration', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/login'),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 580),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Apply for Admission / Register',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: CampusColors.primaryDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Applications arrive directly in the Super Admin review queue.',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                    const SizedBox(height: 20),

                    // FULL NAME
                    TextFormField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: 'Full Name (Student)',
                        prefixIcon: const Icon(Icons.person_outline, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().length < 2) {
                          return 'Please enter your full name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    // EMAIL
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Email Address',
                        prefixIcon: const Icon(Icons.email_outlined, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      validator: (value) {
                        if (value == null || !value.contains('@')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    // PHONE
                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Bangladeshi Phone Number',
                        prefixIcon: const Icon(Icons.phone_outlined, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().length < 11) {
                          return 'Please enter an 11-digit mobile number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    // TARGET INSTITUTION
                    DropdownButtonFormField<String>(
                      value: _selectedInstitution,
                      decoration: InputDecoration(
                        labelText: 'Target Educational Institution',
                        prefixIcon: const Icon(Icons.account_balance_outlined, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      items: _institutions.map((inst) {
                        return DropdownMenuItem(value: inst, child: Text(inst));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedInstitution = val);
                      },
                    ),
                    const SizedBox(height: 14),

                    // DESIRED ROLE
                    DropdownButtonFormField<String>(
                      value: _selectedRole,
                      decoration: InputDecoration(
                        labelText: 'Applying As',
                        prefixIcon: const Icon(Icons.badge_outlined, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      items: _roles.map((r) {
                        return DropdownMenuItem(
                          value: r,
                          child: Text(r.toUpperCase()),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedRole = val);
                      },
                    ),
                    const SizedBox(height: 14),

                    // PROGRAM IF STUDENT
                    if (_selectedRole == 'student') ...[
                      DropdownButtonFormField<String>(
                        value: _selectedProgram,
                        decoration: InputDecoration(
                          labelText: 'Academic Program / Class',
                          prefixIcon: const Icon(Icons.school_outlined, color: CampusColors.primary),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        items: _programs.map((p) {
                          return DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 12)));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedProgram = val);
                        },
                      ),
                      const SizedBox(height: 14),

                      TextFormField(
                        controller: _guardianNameController,
                        decoration: InputDecoration(
                          labelText: 'Guardian / Father Name',
                          prefixIcon: const Icon(Icons.family_restroom, color: CampusColors.primary),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),

                      TextFormField(
                        controller: _guardianPhoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          labelText: 'Guardian Contact Phone',
                          prefixIcon: const Icon(Icons.phone_android, color: CampusColors.primary),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),
                    ],

                    // PASSWORD
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Account Password',
                        prefixIcon: const Icon(Icons.lock_outline, color: CampusColors.primary),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      validator: (value) {
                        if (value == null || value.length < 6) {
                          return 'Password must be at least 6 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),

                    // SUBMIT BUTTON
                    ElevatedButton(
                      onPressed: _isLoading ? null : _handleRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: CampusColors.primaryDark,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 2,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text(
                              'SUBMIT REGISTRATION APPLICATION',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                    ),

                    const SizedBox(height: 16),

                    // BACK TO LOGIN LINK
                    Center(
                      child: TextButton(
                        onPressed: () => context.go('/login'),
                        child: const Text(
                          'Already have an account? Sign in',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: CampusColors.primaryDark,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
