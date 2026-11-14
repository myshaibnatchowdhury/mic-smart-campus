import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mic_campus/main.dart';

void main() {
  testWidgets('MIC Smart Campus app launch and dashboard rendering test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: MicSmartCampusApp(),
      ),
    );
    await tester.pumpAndSettle();

    // Verify that institution name is rendered
    expect(find.text('MIC Smart University'), findsOneWidget);
    // Verify that student name is rendered
    expect(find.text('Samiul Karim'), findsOneWidget);
    // Verify that quick actions exist
    expect(find.text('Quick Actions'), findsOneWidget);
  });
}
