import 'package:flutter/material.dart';

class SDUIConfig {
  final String version;
  final bool maintenanceMode;
  final String? maintenanceMessage;
  final Color primaryColor;
  final Color secondaryColor;
  final Color accentGold;
  final List<String> activeStudentWidgets;

  const SDUIConfig({
    required this.version,
    required this.maintenanceMode,
    this.maintenanceMessage,
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentGold,
    required this.activeStudentWidgets,
  });

  factory SDUIConfig.defaultConfig() {
    return const SDUIConfig(
      version: '1.0.0',
      maintenanceMode: false,
      primaryColor: Color(0xFF064E3B), // Emerald Deep Green
      secondaryColor: Color(0xFF047857),
      accentGold: Color(0xFFD97706),   // Subtle Academic Gold
      activeStudentWidgets: [
        'announcement_bar',
        'stats_card',
        'quick_actions_grid',
        'routine_timeline',
        'recent_notices',
        'upcoming_exams'
      ],
    );
  }
}

class SDUIService {
  static SDUIConfig currentConfig = SDUIConfig.defaultConfig();

  static Future<SDUIConfig> fetchRemoteConfig() async {
    // In production, listens to Supabase Realtime table 'ui_configurations'
    // Safe fallback to current verified config
    return currentConfig;
  }
}
