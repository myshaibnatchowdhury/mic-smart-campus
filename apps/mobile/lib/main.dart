import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'core/constants/colors.dart';
import 'core/router/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL', 
    defaultValue: 'https://epctmfazlaganiecnobh.supabase.co',
  );
  const supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY', 
    defaultValue: 'sb_publishable_UTwyECdPgFePZtsbR7q88w_2XyUoEXY',
  );

  if (supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty) {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      );
    } catch (_) {}
  }

  runApp(
    const ProviderScope(
      child: MicSmartCampusApp(),
    ),
  );
}

class MicSmartCampusApp extends StatelessWidget {
  const MicSmartCampusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'MIC Smart Campus',
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: CampusColors.primaryDark,
          primary: CampusColors.primaryDark,
          secondary: CampusColors.accentGold,
          surface: CampusColors.surfaceLight,
        ),
        scaffoldBackgroundColor: CampusColors.surfaceLight,
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: CampusColors.primaryDark,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
    );
  }
}
