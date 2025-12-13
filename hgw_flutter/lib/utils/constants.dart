import 'package:flutter/material.dart';

class AppColors {
  static const Color primaryGreen = Color(0xFF00C896);
  static const Color darkGreen = Color(0xFF00A076);
  static const Color lightGreen = Color(0xFF00E5A0);
  static const Color accentGreen = Color(0xFF7FFFD4);

  static const Color backgroundLight = Color(0xFFF4F7F6);
  static const Color surfaceWhite = Color(0xFFFFFFFF);

  static const Color elegantGreenDark = Color(0xFF134E4A);
  static const Color elegantGreenLight = Color(0xFF5EEAD4);

  static const Color textDark = Color(0xFF0F172A);
  static const Color textMedium = Color(0xFF334155);
  static const Color textLight = Color(0xFF64748B);

  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color errorColor = Color(0xFFEF4444);
  static const Color warningColor = Color(0xFFF59E0B);
  static const Color successColor = Color(0xFF10B981);

  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryGreen, lightGreen],
  );

  static const LinearGradient elegantGreenGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [elegantGreenDark, Color(0xFF0D3532)],
  );

  static get textPrimary => null;
}

class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.elegantGreenDark,
        brightness: Brightness.light,
        primary: AppColors.elegantGreenDark,
        secondary: AppColors.elegantGreenLight,
      ),
      scaffoldBackgroundColor: AppColors.backgroundLight,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.borderColor, width: 1),
        ),
        color: AppColors.surfaceWhite,
        margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 0),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.elegantGreenDark,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      chipTheme: const ChipThemeData(
        backgroundColor: AppColors.surfaceWhite,
        selectedColor: AppColors.elegantGreenLight,
        side: BorderSide(color: AppColors.borderColor),
        showCheckmark: false,
        labelStyle: TextStyle(color: AppColors.textMedium),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      fontFamily: 'SF Pro Display',
    );
  }
}

class AppStyles {
  static const TextStyle heading1 = TextStyle(
    fontSize: 30,
    fontWeight: FontWeight.w800,
    color: AppColors.textDark,
    letterSpacing: -0.5,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: AppColors.textDark,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textDark,
  );

  static const TextStyle body = TextStyle(
    fontSize: 15,
    color: AppColors.textMedium,
    height: 1.5,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 13,
    color: AppColors.textLight,
  );

  static const TextStyle price = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    color: AppColors.elegantGreenDark,
  );

  static const TextStyle lightHeading = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
}
